import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { sekolahService } from "@/services/sekolahService";
import { type Sekolah } from "@/types/domain/sekolah";
import { toast } from "sonner";

export default function KelolaSekolahPage() {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSekolah();
  }, []);

  const fetchSekolah = async () => {
    setIsLoading(true);
    try {
      const res = await sekolahService.getAll();
      if (res.success) {
        setSekolahList(res.data || []);
      } else {
        toast.error(res.message || "Gagal memuat data sekolah");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memuat data sekolah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Sekolah</h1>
          <p className="text-muted-foreground">
            Daftar tenant sekolah yang menggunakan Halaqah.id
          </p>
        </div>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Tambah Sekolah & Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sekolah</CardTitle>
          <CardDescription>Menampilkan daftar semua tenant sekolah di sistem</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Sekolah</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Memuat data sekolah...
                    </TableCell>
                  </TableRow>
                ) : sekolahList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Belum ada data sekolah
                    </TableCell>
                  </TableRow>
                ) : (
                  sekolahList.map((sekolah) => (
                    <TableRow key={sekolah.id_sekolah}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBuilding} className="text-primary" />
                          </div>
                          {sekolah.nama_sekolah}
                        </div>
                      </TableCell>
                      <TableCell>{sekolah.alamat || "-"}</TableCell>
                      <TableCell>{sekolah.email || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Detail</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
