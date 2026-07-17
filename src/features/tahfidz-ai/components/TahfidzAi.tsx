import { 
  BookOpen, 
  Mic, 
  RefreshCw, 
  Search, 
  Square, 
  ChevronRight 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTahfidzAi } from "../hooks/useTahfidzAi";

export const TahfidzAi = () => {
  const {
    liveTranscript,
    detectedAyah,
    isProcessing,
    isDataLoaded,
    status,
    onStart,
    onStop,
    resetSession,
  } = useTahfidzAi();

  return (
    <div className="container max-w-2xl mx-auto p-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-primary">Tahfidz AI</h1>
        <p className="text-muted-foreground text-sm font-medium">Verifikator Hafalan Quran Berbasis AI</p>
      </header>

      <Card className="border-2 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="bg-background">Whisper Engine v3</Badge>
            {status === "recording" && (
              <Badge variant="destructive" className="animate-pulse">Mendengarkan...</Badge>
            )}
          </div>
          <div className="min-h-[80px] flex items-center justify-center text-center px-4">
            <p className="text-2xl font-serif leading-relaxed text-foreground/80 italic" dir="rtl">
              {liveTranscript || "Tekan tombol mikrofon untuk mulai..."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mushaf Virtual</span>
            </div>

            <div className="min-h-[200px] rounded-2xl border-2 border-dashed bg-muted/5 p-5 flex flex-col justify-center transition-all">
              {isProcessing ? (
                <div className="space-y-4 w-full px-10">
                  <Progress value={90} className="h-2" />
                  <p className="text-center text-[10px] font-bold text-primary animate-pulse uppercase">Mencari Ayat dalam Mushaf...</p>
                </div>
              ) : (detectedAyah && typeof detectedAyah !== "string") ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Primary Result */}
                  <div className="bg-background border-2 border-primary/20 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge className="text-[10px] px-2 py-0">Hasil Terbaik</Badge>
                      <span className="text-xs font-bold text-primary">
                        QS. {detectedAyah.primary.surahName} : {detectedAyah.primary.numberInSurah}
                      </span>
                    </div>
                    <p className="text-4xl font-serif text-right leading-[1.6]" dir="rtl">
                      {detectedAyah.primary.text}
                    </p>
                  </div>

                  {/* Others (Mutasyabihat) */}
                  {detectedAyah.others.length > 0 && (
                    <div className="pt-2 space-y-3">
                      <p className="text-[10px] font-black uppercase text-muted-foreground border-b pb-1">Kemungkinan Lain:</p>
                      <div className="grid gap-2">
                        {detectedAyah.others.map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group">
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-muted-foreground">QS. {item.surahName} : {item.numberInSurah}</span>
                              <p className="text-lg font-serif" dir="rtl">{item.text.slice(0, 50)}...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-30 py-10">
                  {detectedAyah === "not_found" ? (
                    <p className="text-destructive font-bold italic">Ayat tidak ditemukan. Coba baca lebih jelas.</p>
                  ) : (
                    <>
                      <Search className="w-12 h-12 mx-auto" />
                      <p className="text-sm font-medium">Belum ada ayat yang terdeteksi</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 py-4">
            <Button
              size="lg"
              disabled={!isDataLoaded || isProcessing}
              variant={status === "recording" ? "destructive" : "default"}
              className={`w-20 h-20 rounded-full shadow-2xl transition-all ${status === 'recording' ? 'scale-110 ring-8 ring-red-50' : 'hover:scale-105'}`}
              onClick={status === "recording" ? onStop : onStart}
            >
              {status === "recording" ? (
                <Square className="w-8 h-8 fill-current text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              {status === "recording" ? "Selesai Membaca" : "Klik Untuk Rekam"}
            </span>
          </div>
        </CardContent>
      </Card>

      {(detectedAyah || liveTranscript) && !isProcessing && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mx-auto flex gap-2 text-muted-foreground rounded-full hover:bg-muted/50"
          onClick={resetSession}
        >
          <RefreshCw className="w-3 h-3" /> Reset Sesi
        </Button>
      )}
    </div>
  );
};

export default TahfidzAi;
