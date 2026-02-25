"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetoran } from "./hooks/useSetoran";
import { SetoranForm } from "./components/SetoranForm";
import { Setoran } from "@/components/typed-text";

export default function InputSetoranPage() {
  const { santriList, loading, fetchSantri, addSetoran } = useSetoran();

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <Setoran/>
        <p className="text-muted-foreground">Kelola input harian dan pantau progress santri.</p>
      </div>

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