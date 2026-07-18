import { ChevronLeft, RotateCcw, User, Home, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTrashSection } from "../hooks/useTrashSection";

export default function TrashPage() {
  const {
    navigate,
    isSuperadmin,
    basePath,
    loading,
    processingId,
    deletedHalaqah,
    deletedMuhafiz,
    deletedSchools,
    handleRestoreHalaqah,
    handleRestoreMuhafiz,
    handleRestoreSchool,
  } = useTrashSection();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-8">
        <Button variant="outline" size="icon" onClick={() => navigate(basePath)} className="rounded-full h-10 w-10 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Tempat Sampah</h1>
        </div>
      </div>

      <Tabs defaultValue={isSuperadmin ? "sekolah" : "muhafiz"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-11 p-1 bg-muted/50">
          {isSuperadmin ? (
            <>
              <TabsTrigger value="sekolah" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <Building2 className="h-4 w-4" /> Sekolah
              </TabsTrigger>
              <TabsTrigger value="muhafiz" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <User className="h-4 w-4" /> Pengguna
              </TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="muhafiz" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <User className="h-4 w-4" /> Muhafiz
              </TabsTrigger>
              <TabsTrigger value="halaqah" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <Home className="h-4 w-4" /> Halaqah
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* CONTENT: SEKOLAH (Superadmin only) */}
        {isSuperadmin && (
          <TabsContent value="sekolah" className="space-y-4 focus-visible:outline-none">
            <div className="px-1">
              <h3 className="text-lg font-semibold tracking-tight">Sekolah Terhapus</h3>
              <p className="text-sm text-muted-foreground">Sekolah yang telah dihapus beserta seluruh datanya dapat dipulihkan di sini.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
            ) : deletedSchools.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-xl">
                Tidak ada data sekolah terhapus
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-25">Nama Sekolah</TableHead>
                    <TableHead className="hidden sm:table-cell">Kota</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedSchools.map((item) => (
                    <TableRow key={item.id_sekolah} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.nama_sekolah}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{item.kota || "-"}</TableCell>
                      <TableCell className="text-right py-4">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="h-8 px-4"
                          disabled={processingId === item.id_sekolah}
                          onClick={() => handleRestoreSchool(item.id_sekolah)}
                        >
                          {processingId === item.id_sekolah ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5 mr-2" />
                          )}
                          Pulihkan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        )}

        {/* CONTENT: MUHAFIZ / PENGGUNA */}
        <TabsContent value="muhafiz" className="space-y-4 focus-visible:outline-none">
          <div className="px-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {isSuperadmin ? "Pengguna Terhapus" : "Muhafiz Terhapus"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isSuperadmin ? "Akun pengajar/administrator terhapus yang dapat dipulihkan." : "Akun pengajar dalam daftar ini dapat dipulihkan ke sistem."}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
          ) : deletedMuhafiz.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-xl">
              Tidak ada data pengguna terhapus
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Nama</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedMuhafiz.map((item) => (
                  <TableRow key={item.id_user} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{item.email}</TableCell>
                    <TableCell className="text-right py-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-8 px-4"
                        disabled={processingId === item.id_user}
                        onClick={() => handleRestoreMuhafiz(item.id_user)}
                      >
                        {processingId === item.id_user ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        )}
                        Pulihkan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* CONTENT: HALAQAH (Non-Superadmin only) */}
        {!isSuperadmin && (
          <TabsContent value="halaqah" className="space-y-4 focus-visible:outline-none">
            <div className="px-1">
              <h3 className="text-lg font-semibold tracking-tight">Halaqah Terhapus</h3>
              <p className="text-sm text-muted-foreground">Daftar kelompok halaqah yang tersedia untuk pemulihan.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
            ) : deletedHalaqah.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-xl">
                Tidak ada data halaqah terhapus
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead>Nama Halaqah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedHalaqah.map((item) => (
                    <TableRow key={item.id_halaqah} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-4">{item.name_halaqah}</TableCell>
                      <TableCell className="text-right py-4">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="h-8 px-4"
                          disabled={processingId === item.id_halaqah}
                          onClick={() => handleRestoreHalaqah(item.id_halaqah)}
                        >
                          {processingId === item.id_halaqah ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5 mr-2" />
                          )}
                          Pulihkan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
