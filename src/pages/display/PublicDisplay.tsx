// PublicDisplay.tsx
import { useState } from "react";
import { useDisplay } from "@/context/DisplayContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle"; // Import ThemeToggle

const PublicDisplay = () => {
  const { santriList, isLoading } = useDisplay();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredSantri = (santriList || []).filter((s) =>
    s?.nama_santri?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-background"><Spinner /></div>;

  return (
    // Gunakan bg-background agar sesuai dengan variabel CSS di index.css
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Portal Informasi Santri
          </h1>
          <p className="text-muted-foreground">Cari nama santri untuk melihat detail progres dan absensi.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Ketik nama santri..."
            className="pl-10 h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List Santri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSantri.length > 0 ? (
            filteredSantri.map((santri) => (
              <Card 
                key={santri.id_santri} 
                className="hover:border-primary border-2 border-transparent cursor-pointer transition-all active:scale-95 shadow-md bg-card"
                onClick={() => navigate(`/display/santri/${santri.id_santri}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {santri.nama_santri.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate text-foreground">{santri.nama_santri}</p>
                    <p className="text-xs text-muted-foreground truncate uppercase tracking-wider">
                      {santri.halaqah?.name_halaqah || "Umum"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Santri "{search}" tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;