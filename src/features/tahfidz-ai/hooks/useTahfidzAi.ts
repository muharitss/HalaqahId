import { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import {
  type Ayah,
  type DetectedAyahState,
  type AlQuranCloudResponse,
  type AlQuranCloudSurah,
  type AlQuranCloudAyah,
  type ISpeechRecognition,
  type ISpeechRecognitionEvent,
} from "../types";
import { normalizeArabic } from "../utils/normalize";
import { setoranService } from "@/features/setoran/api/services/setoranService";

const PREFERRED_AUDIO_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
];

const getSupportedAudioMimeType = (): string | undefined => {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return undefined;
  return PREFERRED_AUDIO_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
};

export function useTahfidzAi() {
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [detectedAyah, setDetectedAyah] = useState<DetectedAyahState | null | "not_found">(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "recording">("idle");

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const fuseRef = useRef<Fuse<Ayah> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Inisialisasi Data & Speech Recognition
  useEffect(() => {
    const initQuranData = async () => {
      const CACHE_KEY = "quran_data_v2";
      let allAyahs: Ayah[] = [];

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          allAyahs = JSON.parse(cached) as Ayah[];
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }

      if (allAyahs.length === 0) {
        try {
          const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as AlQuranCloudResponse;
          allAyahs = data.data.surahs.flatMap((s: AlQuranCloudSurah) =>
            s.ayahs.map((a: AlQuranCloudAyah) => ({
              text: a.text,
              surahName: s.englishName,
              numberInSurah: a.numberInSurah,
              normalizedText: normalizeArabic(a.text),
            })),
          );
          try {
            localStorage.removeItem("quran_data_v1");
            localStorage.setItem(CACHE_KEY, JSON.stringify(allAyahs));
          } catch {
            // QuotaExceededError tidak boleh memblokir pemakaian data yang sudah diunduh
          }
        } catch (err) {
          console.error("Gagal memuat Al-Quran:", err);
          setErrorMessage("Gagal memuat data mushaf Al-Quran. Periksa koneksi internet.");
          return;
        }
      }

      fuseRef.current = new Fuse(allAyahs, {
        keys: ["normalizedText"],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
      });
      setIsDataLoaded(true);
    };

    initQuranData();

    // Browser Speech API Setup
    const SpeechRecognitionClass =
      (window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognition;
        webkitSpeechRecognition?: new () => ISpeechRecognition;
      }).SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: new () => ISpeechRecognition;
      }).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "ar-SA";

      recognitionRef.current.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setLiveTranscript(transcript);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Logika Pemrosesan AI (Whisper via Backend + Fuse)
  const handleFinalProcess = async (audioBlob: Blob) => {
    if (audioBlob.size < 2000) {
      setErrorMessage("Rekaman suara terlalu singkat atau kosong. Coba baca lebih lama.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const res = await setoranService.verifyAi(audioBlob);
      const whisperText = res.data?.text?.trim();

      if (!whisperText) {
        setErrorMessage("Transkrip suara kosong. Pastikan mikrofon aktif dan baca dengan jelas.");
        return;
      }

      setLiveTranscript(whisperText);

      if (fuseRef.current) {
        const searchResults = fuseRef.current.search(normalizeArabic(whisperText), { limit: 7 });

        if (searchResults.length > 0) {
          const primaryMatch = searchResults[0].item;
          const otherMatches = searchResults.slice(1, 4).map((r) => r.item);

          setDetectedAyah({ primary: primaryMatch, others: otherMatches });
        } else {
          setDetectedAyah("not_found");
        }
      }
    } catch (err) {
      console.error("Processing Error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal memverifikasi audio AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const onStart = async () => {
    setLiveTranscript("");
    setDetectedAyah(null);
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErrorMessage("Browser tidak mendukung perekaman audio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = getSupportedAudioMimeType();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32000, // Tetap di bawah batas payload 4.5MB Vercel
      });

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const recordedMimeType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: recordedMimeType });
        chunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setStatus("idle");
        void handleFinalProcess(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Recognition start failed", e);
      }
    } catch (err) {
      console.error("Mic error:", err);
      setStatus("idle");
      setErrorMessage("Gagal mengakses mikrofon. Pastikan izin mikrofon diberikan.");
    }
  };

  const onStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      setStatus("idle");
    }
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.warn("Recognition stop failed", e);
    }
  };

  const resetSession = () => {
    setLiveTranscript("");
    setDetectedAyah(null);
    setErrorMessage(null);
  };

  return {
    liveTranscript,
    detectedAyah,
    errorMessage,
    isProcessing,
    isDataLoaded,
    status,
    onStart,
    onStop,
    resetSession,
  };
}
