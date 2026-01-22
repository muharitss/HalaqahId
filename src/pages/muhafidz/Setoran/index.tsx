"use client";

import { useEffect } from "react";
import { useSetoran } from "@/hooks/useSetoran";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SetoranForm } from "./SetoranForm";
import { TahfidzAi } from "@/components/shared/TahfidzAi";

export default function InputSetoranPage() {
  const { santriList, loading, fetchSantri, addSetoran } = useSetoran();

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Setoran Hafalan</h1>
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