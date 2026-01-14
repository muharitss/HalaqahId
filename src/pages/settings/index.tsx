import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAkun } from "@/hooks/useAkun";
import { useHalaqah } from "@/hooks/useHalaqah";
import { akunService } from "@/services/akunService";
import { halaqahService } from "@/services/halaqahService";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, UserCog, Database } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { deletedMuhafiz, fetchDeletedMuhafiz, loading: loadingAkun } = useAkun();
  const { deletedHalaqah, fetchDeletedHalaqah, loading: loadingHalaqah } = useHalaqah();

  useEffect(() => {
    if (user?.role === "superadmin") {
      fetchDeletedMuhafiz();
      fetchDeletedHalaqah();
    }
  }, [user, fetchDeletedMuhafiz, fetchDeletedHalaqah]);

  const handleRestoreMuhafiz = async (id: number) => {
    try {
      await akunService.restoreMuhafiz(id);
      toast.success("Akun Muhafiz berhasil dipulihkan");
      fetchDeletedMuhafiz();
    } catch (error) {
      toast.error("Gagal memulihkan akun");
    }
  };

  const handleRestoreHalaqah = async (id: number) => {
    try {
      await halaqahService.restoreHalaqah(id);
      toast.success("Kelompok Halaqah berhasil dipulihkan");
      fetchDeletedHalaqah();
    } catch (error) {
      toast.error("Gagal memulihkan halaqah");
    }
  };

  if (user?.role !== "superadmin") {
    return <div className="p-8 text-center">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Kelola konfigurasi sistem dan pemulihan data.</p>
      </div>

      <Tabs defaultValue="trash" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trash" className="flex gap-2">
            <Trash2 className="h-4 w-4" /> Tempat Sampah
          </TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2">
            <UserCog className="h-4 w-4" /> Akun Saya
          </TabsTrigger>
        </TabsList>

        {/* TAB: TRASH MANAGEMENT */}
        <TabsContent value="trash" className="space-y-6">
          {/* Trash Muhafiz */}
          <Card>
            <CardHeader>
              <CardTitle>Arsip Muhafiz</CardTitle>
              <CardDescription>Daftar akun pengajar yang dinonaktifkan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedMuhafiz.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-4">Kosong</TableCell></TableRow>
                  ) : (
                    deletedMuhafiz.map((m) => (
                      <TableRow key={m.id_user}>
                        <TableCell className="font-medium">{m.username}</TableCell>
                        <TableCell>{m.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleRestoreMuhafiz(m.id_user)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Trash Halaqah */}
          <Card>
            <CardHeader>
              <CardTitle>Arsip Kelompok Halaqah</CardTitle>
              <CardDescription>Daftar halaqah yang telah dihapus.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Halaqah</TableHead>
                    <TableHead>Muhafiz</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedHalaqah.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-4">Kosong</TableCell></TableRow>
                  ) : (
                    deletedHalaqah.map((h) => (
                      <TableRow key={h.id_halaqah}>
                        <TableCell className="font-medium">{h.name_halaqah}</TableCell>
                        <TableCell>{h.muhafiz?.username || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleRestoreHalaqah(h.id_halaqah)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: ACCOUNT (Self-Service) */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Profil Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-semibold">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="secondary">{user?.role}</Badge>
                </div>
              </div>
              <Button variant="destructive" onClick={() => toast.info("Fitur ganti password sedang dikembangkan")}>
                Ganti Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}