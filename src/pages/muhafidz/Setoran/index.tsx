"use client";

import { useEffect } from "react";
import { useSetoran } from "@/hooks/useSetoran";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SetoranForm } from "./SetoranForm";
import { SummaryCards } from "./SummaryCard";
import { SetoranTable } from "./SetoranTable";

export default function InputSetoranPage() {
  const { history, santriList, loading, fetchSantri, addSetoran } = useSetoran();

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  const summary = {
    total: history.length,
    santri: new Set(history.map((s) => s.santri_id)).size,
    rataRata: history.length > 0 
      ? (history.reduce((sum, s) => sum + (s.nilai || 0), 0) / history.length).toFixed(1)
      : "0",
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Setoran Hafalan</h1>
        <p className="text-muted-foreground">Kelola input harian dan pantau progress santri.</p>
      </div>

      <SummaryCards {...summary} />

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

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Hari Ini</CardTitle>
            <CardDescription>Daftar setoran yang masuk pada sesi ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <SetoranTable history={history} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}