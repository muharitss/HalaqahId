"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetoran } from "./hooks/useSetoran";
import { SetoranForm } from "./components/SetoranForm";
import { Setoran } from "@/components/typed-text";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InputSetoranPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { santriList, sesiList, loading, fetchSantri, addSetoran } = useSetoran();
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
          <div className="space-y-1">
            <Setoran/>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Form Input</CardTitle>
            <CardDescription>Masukkan detail hafalan santri terbaru.</CardDescription>
          </CardHeader>
          <CardContent>
            <SetoranForm 
              santriList={santriList} 
              sesiList={sesiList}
              onSubmit={addSetoran} 
              onValidationChange={setIsFormValid}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>Daftar santri yang muncul hanya yang terdaftar di halaqah Anda. Pastikan data juz dan surah sudah benar sebelum menyimpan.</p>
        </div>
        <Button 
          type="submit"
          form="setoran-form"
          disabled={loading || santriList.length === 0 || !isFormValid}
          className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20"
        >
          {loading ? "Menyimpan..." : "Simpan Setoran"}
        </Button>
      </div>
    </div>
  );
}