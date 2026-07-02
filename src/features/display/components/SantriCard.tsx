import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SantriCardProps {
  id: number;
  nama: string;
  halaqah: string;
  nomorTelepon?: string;
}

// Generate a consistent color from a name string
function getAvatarColor(name: string): string {
  const colors = [
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-sky-600",
    "from-lime-500 to-green-600",
    "from-fuchsia-500 to-pink-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone || "";
  return phone.slice(0, 4) + "****" + phone.slice(-3);
}

export function SantriCard({ id, nama, halaqah, nomorTelepon }: SantriCardProps) {
  const navigate = useNavigate();
  const gradient = getAvatarColor(nama);

  return (
    <Card
      className="group relative cursor-pointer border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
      onClick={() => navigate(`santri/${id}`)}
    >
      <CardContent className="p-4 flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-100 blur-[1px] transition-opacity duration-300`} />
          <Avatar className="relative h-11 w-11 border-2 border-background shadow-sm">
            <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-bold text-sm`}>
              {nama.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-semibold text-sm text-foreground truncate leading-none">
            {nama}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0 h-[18px] bg-primary/8 text-primary border-0 rounded-md">
              {halaqah || "Umum"}
            </Badge>
            {nomorTelepon && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Phone className="h-2.5 w-2.5" />
                {maskPhone(nomorTelepon)}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 translate-x-0 group-hover:translate-x-1 group-hover:text-primary transition-all duration-200" />
      </CardContent>
    </Card>
  );
}
