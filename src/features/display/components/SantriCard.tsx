import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface SantriCardProps {
  id: number;
  nama: string;
  halaqah: string;
}

export function SantriCard({ id, nama, halaqah }: SantriCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="hover:border-primary border-2 border-transparent cursor-pointer transition-all active:scale-95 shadow-sm bg-card"
      onClick={() => navigate(`/display/santri/${id}`)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm">
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {nama.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="font-bold truncate text-foreground uppercase text-sm">
            {nama}
          </p>
          <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-medium">
            {halaqah || "Umum"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}