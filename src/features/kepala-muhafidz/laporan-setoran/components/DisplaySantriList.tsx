import { Input } from "@/components/ui/input";
import { Search, ChevronRight, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Santri } from "@/types/domain/santri";

interface DisplaySantriListProps {
  santriList: Santri[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectSantri: (id: number) => void;
}

export function DisplaySantriList({ 
  santriList, 
  searchQuery, 
  onSearchChange,
  onSelectSantri 
}: DisplaySantriListProps) {

  const filteredSantri = santriList.filter((s) =>
    s.nama_santri.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama santri..."
          className="pl-9 h-10 text-sm shadow-sm border-primary/20 focus-visible:ring-primary bg-card"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* SANTRI LIST */}
      <div className="flex flex-col gap-2">
        {filteredSantri.length > 0 ? (
          filteredSantri.map((santri) => (
            <Card 
              key={santri.id_santri}
              onClick={() => onSelectSantri(santri.id_santri)}
              className="group cursor-pointer transition-all duration-200"
            >
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar className="h-9 w-9 border border-primary/10 shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-foreground truncate uppercase transition-colors leading-tight">
                      {santri.nama_santri}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold leading-tight mt-0.5">
                      {santri.halaqah?.name_halaqah || "Halaqah Aktif"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Text LIHAT sekarang akan muncul karena ada class 'group' di Card */}
                  <span className="hidden sm:block text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full opacity-0 transition-all transform translate-x-2">
                    LIHAT
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <div className="max-w-xs mx-auto space-y-3">
              <Search className="h-10 w-10 text-muted-foreground/20 mx-auto" />
              <p className="text-sm text-muted-foreground font-medium">
                Santri "{searchQuery}" tidak ditemukan.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSearchChange("")}
                className="mt-2"
              >
                Hapus Pencarian
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}