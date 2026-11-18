import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PortalWaliPage: React.FC = () => {
  const [step, setStep] = useState<"REQUEST" | "VERIFY" | "DASHBOARD">("REQUEST");
  const [slug, setSlug] = useState("");
  const [nis, setNis] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axiosClient.post("/portal/otp/request", {
        slug,
        nis,
        nomor_telepon: nomorTelepon,
      });
      setStep("VERIFY");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axiosClient.post("/portal/otp/verify", {
        slug,
        nis,
        otp,
      });
      setPortalData(res.data?.data || res.data);
      setStep("DASHBOARD");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Kode OTP tidak valid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Portal Wali Santri</h1>
          <p className="text-sm text-muted-foreground">
            Pantau perkembangan hafalan, kehadiran, dan rapor putra/putri Anda secara aman.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {step === "REQUEST" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug Sekolah / Pesantren</label>
              <Input
                name="slug"
                placeholder="contoh: al-hikmah"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nomor Induk Santri (NIS)</label>
              <Input
                name="nis"
                placeholder="contoh: 20260001"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nomor WhatsApp Wali</label>
              <Input
                name="nomor_telepon"
                placeholder="contoh: 081234567890"
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mengirim OTP..." : "Kirim Kode OTP WhatsApp"}
            </Button>
          </form>
        )}

        {step === "VERIFY" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Kode OTP 6 Digit</label>
              <Input
                name="otp"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memverifikasi..." : "Verifikasi & Masuk Portal"}
            </Button>
          </form>
        )}

        {step === "DASHBOARD" && portalData && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Santri</p>
              <p className="font-semibold">{portalData.santri?.nama_santri}</p>
              <p className="text-xs text-muted-foreground">
                Wali: {portalData.wali?.nama_wali} ({portalData.wali?.hubungan})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalWaliPage;

