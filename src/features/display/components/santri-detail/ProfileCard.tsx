
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface ProfileCardProps {
  nama: string;
  halaqah: string;
  nomorTelepon?: string;
  target?: string;
  muhafiz?: string;
}

export function ProfileCard({ nama, halaqah, nomorTelepon, target, muhafiz }: ProfileCardProps) {
  const waLink = nomorTelepon ? `https://wa.me/${nomorTelepon.replace(/^0/, '62').replace(/\D/g, '')}` : null;

  return (
    <Card className="border shadow-none bg-background overflow-hidden">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
          {/* Avatar - Ukuran dikecilkan dan style lebih simple */}
          <Avatar className="h-16 w-16 border bg-muted shrink-0 rounded-lg">
            <AvatarFallback className="bg-primary/5 text-primary font-semibold text-xl">
              {nama.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2.5 text-center sm:text-left min-w-0">
            <div>
              {/* Nama: Dari 3xl/Black ke Base/Semibold */}
              <h1 className="text-base md:text-lg font-semibold tracking-tight text-foreground truncate">
                {nama}
              </h1>
              
              {/* Info Halaqah & Muhafiz: Lebih rapat dan clean */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 mt-0.5">
                <span className="text-xs font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                  {halaqah}
                </span>
                {muhafiz && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-border hidden sm:inline-block" />
                    Muhafidz: <span className="font-medium text-foreground/80">{muhafiz}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {target && (
                <Badge variant="outline" className="border-amber-200 bg-amber-50/50 text-amber-700 font-medium text-[10px] px-2 py-0">
                  Target: {target}
                </Badge>
              )}
              
              {nomorTelepon && (
                <a 
                  href={waLink || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 border border-green-200 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-semibold">{nomorTelepon}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}