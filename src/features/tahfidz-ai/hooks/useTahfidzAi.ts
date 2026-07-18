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
  type ISpeechRecognitionEvent, 
  type GroqResponse 
} from "../types";
import { normalizeArabic } from "../utils/normalize";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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

  // Logika Pemrosesan AI (Whisper + Fuse + Llama)
  const handleFinalProcess = async (audioBlob: Blob) => {
    if (audioBlob.size < 2000) return; 
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("model", "whisper-large-v3");
      formData.append("language", "ar");

      const resWhisper = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
        body: formData,
      });

      const whisperData = await resWhisper.json();
      const whisperText = whisperData.text;
      
      if (!whisperText) throw new Error("Transcription empty");
      setLiveTranscript(whisperText);

      if (fuseRef.current) {
        const searchResults = fuseRef.current.search(normalizeArabic(whisperText), { limit: 7 });

        if (searchResults.length > 0) {
          const candidates = searchResults.map((r, idx) => ({
            index: idx,
            text: r.item.text,
            surah: r.item.surahName,
            ayah: r.item.numberInSurah
          }));

          const resAi = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are a Quran expert. Return JSON ONLY: {\"bestIndex\": number}"
                },
                {
                  role: "user",
                  content: `Input: "${whisperText}"\nCandidates: ${JSON.stringify(candidates)}`
                }
              ],
              response_format: { type: "json_object" },
              temperature: 0
            })
          });

          const aiData: GroqResponse = await resAi.json();
          const { bestIndex } = JSON.parse(aiData.choices[0].message.content);
          
          const primaryMatch = searchResults[bestIndex]?.item || searchResults[0].item;
          const otherMatches = searchResults
              .filter((_, idx) => idx !== (bestIndex ?? 0))
              .map(r => r.item)
              .slice(0, 3);

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
