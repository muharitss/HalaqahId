import { useProfilSekolah } from "./hooks/useProfilSekolah";
import { ProfilSekolahInfo } from "./components/ProfilSekolahInfo";
import { ProfilSekolahForm } from "./components/ProfilSekolahForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";

export default function ProfilSekolahPage() {
  const { sekolah, loading, saving, updateProfile } = useProfilSekolah();

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Profil Sekolah</h1>
          </div>
          <p className="text-muted-foreground">
            Kelola informasi dan pengaturan sekolah Anda.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      ) : !sekolah ? (
        <div className="p-8 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Gagal memuat data sekolah.</p>
        </div>
      ) : (
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informasi</TabsTrigger>
            <TabsTrigger value="edit">Edit Profil</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <div className="max-w-3xl">
              <ProfilSekolahInfo sekolah={sekolah} />
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="mt-0">
            <div className="max-w-3xl">
              <ProfilSekolahForm 
                sekolah={sekolah} 
                onSubmit={updateProfile} 
                saving={saving} 
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
