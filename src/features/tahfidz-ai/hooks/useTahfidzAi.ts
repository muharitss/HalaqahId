import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Fuse from "fuse.js";
import { 
  type Ayah, 
  type DetectedAyahState, 
  type AlQuranCloudResponse, 
  type AlQuranCloudSurah, 
  type AlQuranCloudAyah, 
  type ISpeechRecognition, 
  type ISpeechRecognitionEvent
} from "../types";
import { normalizeArabic } from "../utils/normalize";
import { setoranService } from "@/features/setoran/api/services/setoranService";

export function useTahfidzAi() {
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [detectedAyah, setDetectedAyah] = useState<DetectedAyahState | null | "not_found">(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const fuseRef = useRef<Fuse<Ayah> | null>(null);

  // Inisialisasi Data & Speech Recognition
  useEffect(() => {
    const initQuranData = async () => {
      const CACHE_KEY = "quran_data_v1";
      const cached = localStorage.getItem(CACHE_KEY);
      let allAyahs: Ayah[] = [];

      if (cached) {
        allAyahs = JSON.parse(cached);
      } else {
        try {
          const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
          const data = (await res.json()) as AlQuranCloudResponse;
          allAyahs = data.data.surahs.flatMap((s: AlQuranCloudSurah) => 
            s.ayahs.map((a: AlQuranCloudAyah) => ({ 
              text: a.text,
              surahName: s.englishName,
              numberInSurah: a.numberInSurah,
              normalizedText: normalizeArabic(a.text) 
            }))
          );
          localStorage.setItem(CACHE_KEY, JSON.stringify(allAyahs));
        } catch (err) {
          console.error("Gagal memuat Al-Quran:", err);
          return;
        }
      }

      fuseRef.current = new Fuse(allAyahs, {
        keys: ["normalizedText"],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true 
      });
      setIsDataLoaded(true);
    };

    initQuranData();

    // Browser Speech API Setup
    const SpeechRecognitionClass = (window as unknown as {
      SpeechRecognition?: new () => ISpeechRecognition;
      webkitSpeechRecognition?: new () => ISpeechRecognition;
    }).SpeechRecognition || (window as unknown as {
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
    };
  }, []);

  // Logika Pemrosesan AI (Whisper via Backend + Fuse)
  const handleFinalProcess = async (audioBlob: Blob) => {
    if (audioBlob.size < 2000) return; 
    setIsProcessing(true);
    
    try {
      const res = await setoranService.verifyAi(audioBlob);
      const whisperText = res.data?.text;
      
      if (!whisperText) throw new Error("Transcription empty");
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
      setDetectedAyah("not_found");
    } finally {
      setIsProcessing(false);
    }
  };

  const { status, startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: (_, blob) => handleFinalProcess(blob),
  });

  const onStart = () => {
    setLiveTranscript("");
    setDetectedAyah(null);
    clearBlobUrl();
    startRecording();
    try { recognitionRef.current?.start(); } catch (e) { console.warn("Recognition start failed", e); }
  };

  const onStop = () => {
    stopRecording();
    try { recognitionRef.current?.stop(); } catch (e) { console.warn("Recognition stop failed", e); }
  };

  const resetSession = () => {
    setLiveTranscript("");
    setDetectedAyah(null);
  };

  return {
    liveTranscript,
    detectedAyah,
    isProcessing,
    isDataLoaded,
    status,
    onStart,
    onStop,
    resetSession,
  };
}
