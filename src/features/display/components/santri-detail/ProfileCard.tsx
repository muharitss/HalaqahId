import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  nama: string;
  halaqah: string;
  nomorTelepon?: string;
}

export function ProfileCard({ nama, halaqah, nomorTelepon }: ProfileCardProps) {
  return (
    <Card className="border-none shadow-sm bg-linear-to-br from-card to-muted/20">
      <CardContent className="p-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                {nama.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight uppercase">{nama}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  {halaqah}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  Telp: {nomorTelepon || "-"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}