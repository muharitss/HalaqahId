"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetoran } from "./hooks/useSetoran";
import { SetoranForm } from "./components/SetoranForm";
import { Setoran } from "@/components/typed-text";

export default function InputSetoranPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { santriList, loading, fetchSantri, addSetoran } = useSetoran();

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
              onSubmit={addSetoran} 
              loading={loading} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}