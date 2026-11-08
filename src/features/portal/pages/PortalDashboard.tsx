import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, History, CalendarCheck, Award, Target, Users, Sparkles } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { usePortal } from "../hooks/usePortal";
import {
  PortalLayout,
  PortalProgressView,
  PortalSetoranHistory,
  PortalAbsensiView,
  PortalUjianView,
} from "../components";

export function PortalDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");

  const {
    session,
    isAuthenticated,
    isLoadingSession,
    santri,
    isLoadingSantri,
    progress,
    isLoadingProgress,
    setoran,
    isLoadingSetoran,
    setoranPage,
    setSetoranPage,
    absensi,
    isLoadingAbsensi,
    absensiPage,
    setAbsensiPage,
    ujian,
    isLoadingUjian,
  } = usePortal();

  // Guard: if unauthenticated, redirect to portal login
  useEffect(() => {
    if (!isLoadingSession && !isAuthenticated) {
      const redirectSlug = slug || "demo";
      navigate(`/${redirectSlug}/portal`, { replace: true });
    }
  }, [isLoadingSession, isAuthenticated, slug, navigate]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="space-y-3 w-full max-w-md text-center">
          <Skeleton className="h-10 w-10 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  const currentSantriName = santri?.nama_santri || session?.santri.nama_santri;
  const currentNis = santri?.nomor_induk_santri || session?.santri.nomor_induk_santri;
  const halaqahName = santri?.halaqah?.nama_halaqah;
  const targetHafalan = santri?.target?.nama_target;
  const waliName = session?.wali.nama_wali;
  const hubunganWali = session?.wali.hubungan;

  return (
    <PortalLayout
      schoolSlug={slug || session?.sekolah.slug}
      santriName={currentSantriName}
      nis={currentNis}
    >
      <div className="space-y-6">
        {/* Student Profile Overview Banner */}
        <Card className="bg-card border-border/80 shadow-2xs overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {isLoadingSantri ? <Skeleton className="h-6 w-40 inline-block" /> : currentSantriName}
                  </h2>
                  <Badge variant="outline" className="text-xs font-semibold">
                    NIS: {currentNis}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                  {halaqahName && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>Halaqah: <strong className="text-foreground">{halaqahName}</strong></span>
                    </div>
                  )}

                  {targetHafalan && (
                    <div className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Target: <strong className="text-foreground">{targetHafalan}</strong></span>
                    </div>
                  )}

                  {waliName && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>
                        Wali: <strong className="text-foreground">{waliName}</strong> ({hubunganWali})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation & Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted rounded-xl gap-1">
            <TabsTrigger
              value="progress"
              className="py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Progress Hafalan</span>
            </TabsTrigger>

            <TabsTrigger
              value="setoran"
              className="py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg flex items-center gap-1.5"
            >
              <History className="h-4 w-4" />
              <span>Riwayat Setoran</span>
            </TabsTrigger>

            <TabsTrigger
              value="absensi"
              className="py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg flex items-center gap-1.5"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Absensi</span>
            </TabsTrigger>

            <TabsTrigger
              value="ujian"
              className="py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-lg flex items-center gap-1.5"
            >
              <Award className="h-4 w-4" />
              <span>Hasil Ujian</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-0 focus-visible:outline-hidden">
            <PortalProgressView
              progress={progress}
              isLoading={isLoadingProgress}
            />
          </TabsContent>

          <TabsContent value="setoran" className="mt-0 focus-visible:outline-hidden">
            <PortalSetoranHistory
              data={setoran}
              isLoading={isLoadingSetoran}
              page={setoranPage}
              onPageChange={setSetoranPage}
            />
          </TabsContent>

          <TabsContent value="absensi" className="mt-0 focus-visible:outline-hidden">
            <PortalAbsensiView
              data={absensi}
              isLoading={isLoadingAbsensi}
              page={absensiPage}
              onPageChange={setAbsensiPage}
            />
          </TabsContent>

          <TabsContent value="ujian" className="mt-0 focus-visible:outline-hidden">
            <PortalUjianView
              data={ujian}
              isLoading={isLoadingUjian}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}

export default PortalDashboard;
