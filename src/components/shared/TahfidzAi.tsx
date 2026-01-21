import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Fuse from 'fuse.js';
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { BookOpen, Mic, RefreshCw, Search, Square } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const TahfidzAi = () => {
  const [liveTranscript, setLiveTranscript] = useState("");
  const [_fullQuran, setFullQuran] = useState<any[]>([]);
  const [detectedAyah, setDetectedAyah] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const fuseRef = useRef<any>(null);

  const normalize = (text: string) => {
    return text
      .replace(/[\u064B-\u065F]/g, "") 
      .replace(/[\u0670-\u0671]/g, "\u0627") 
      .replace(/[\u06D6-\u06ED]/g, "") 
      .trim();
  };

  useEffect(() => {
    const fetchQuran = async () => {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
        const data = await res.json();
        const allAyahs = data.data.surahs.flatMap((s: any) => 
          s.ayahs.map((a: any) => ({ 
            ...a, 
            surahName: s.englishName,
            normalizedText: normalize(a.text) 
          }))
        );
        setFullQuran(allAyahs);
        fuseRef.current = new Fuse(allAyahs, {
          keys: ["normalizedText"],
          threshold: 0.4,
          includeScore: true
        });
      } catch (err) {
        console.error("Gagal memuat Al-Quran", err);
      }
    };
    fetchQuran();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "ar-SA";
      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interim += event.results[i][0].transcript;
        }
        setLiveTranscript(interim);
      };
    }
  }, []);

  const { status, startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: (_blobUrl, blob) => handleFinalProcess(blob),
  });

  const handleFinalProcess = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.m4a");
      formData.append("model", "whisper-large-v3");
      formData.append("language", "ar");

      const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
        body: formData,
      });
      const data = await res.json();
      const finalResult = data.text;
      setLiveTranscript(finalResult);

      if (finalResult && fuseRef.current) {
        const results = fuseRef.current.search(normalize(finalResult));
        if (results.length > 0) setDetectedAyah(results[0].item);
        else setDetectedAyah("not_found");
      }
    } catch (err) {
      setDetectedAyah("not_found");
    } finally {
      setIsProcessing(false);
    }
  };

  const startAll = () => {
    setLiveTranscript("");
    setDetectedAyah(null);
    clearBlobUrl();
    startRecording();
    try { recognitionRef.current?.start(); } catch (e) {}
  };

  const stopAll = () => {
    stopRecording();
    recognitionRef.current?.stop();
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 py-10 space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tahfidz AI</h1>
        <p className="text-muted-foreground">Pelacak Hafalan Al-Quran Pintar</p>
      </div>

      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-center">
            <CardDescription className="uppercase tracking-widest font-semibold text-[10px]">
              Deteksi Suara
            </CardDescription>
            {status === "recording" && (
               <Badge variant="destructive" className="animate-pulse">Recording</Badge>
            )}
          </div>
          <div className="min-h-15 flex items-center justify-end">
            <p className="text-2xl font-serif text-right leading-relaxed" dir="rtl">
              {liveTranscript || <span className="text-muted text-lg font-sans tracking-normal italic">Menunggu suara...</span>}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Hasil Mushaf</span>
            </div>

            <div className="min-h-35 rounded-lg border bg-background p-6 flex flex-col justify-center relative">
              {isProcessing ? (
                <div className="space-y-3">
                  <Progress value={66} className="h-1 animate-pulse" />
                  <p className="text-center text-xs text-muted-foreground italic">Mencocokkan dengan 6236 ayat...</p>
                </div>
              ) : detectedAyah && detectedAyah !== "not_found" ? (
                <div className="text-right space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <Badge variant="secondary" className="font-mono">
                    QS. {detectedAyah.surahName} : {detectedAyah.numberInSurah}
                  </Badge>
                  <p className="text-3xl font-serif leading-14 text-foreground" dir="rtl">
                    {detectedAyah.text}
                  </p>
                </div>
              ) : detectedAyah === "not_found" ? (
                <p className="text-center text-destructive text-sm italic">Ayat tidak ditemukan dalam database.</p>
              ) : (
                <div className="text-center text-muted-foreground opacity-50">
                  <Search className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm italic">Ayat asli akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              size="lg"
              variant={status === "recording" ? "destructive" : "default"}
              className={`w-20 h-20 rounded-full shadow-lg transition-all ${status !== 'recording' && 'hover:scale-105'}`}
              onClick={status === "recording" ? stopAll : startAll}
            >
              {status === "recording" ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest">
                {status === "recording" ? "Tekan untuk Berhenti" : "Mulai Mengaji"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(detectedAyah || liveTranscript) && !isProcessing && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mx-auto flex gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => { setLiveTranscript(""); setDetectedAyah(null); }}
        >
          <RefreshCw className="w-3 h-3" />
          Reset Sesi
        </Button>
      )}
    </div>
  );
};