import { useState } from "react";
import { KeyRound, Eye, EyeOff, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GantiPasswordFormValues } from "../types";

interface GantiPasswordFormProps {
  isExpanded: boolean;
  isSubmitting: boolean;
  onToggle: () => void;
  onCancel: () => void;
  onSave: (values: GantiPasswordFormValues) => void;
}

export function GantiPasswordForm({
  isExpanded,
  isSubmitting,
  onToggle,
  onCancel,
  onSave,
}: GantiPasswordFormProps) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const isPasswordMismatch =
    konfirmasiPassword.length > 0 && passwordBaru !== konfirmasiPassword;
  const isFormValid =
    passwordLama.length >= 6 &&
    passwordBaru.length >= 8 &&
    passwordBaru === konfirmasiPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      password_lama: passwordLama,
      password_baru: passwordBaru,
      konfirmasi_password: konfirmasiPassword,
    });
  };

  const handleCancel = () => {
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasiPassword("");
    onCancel();
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 border-b bg-muted/20 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Ganti Password</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Collapsible Body */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Password Lama */}
          <div className="space-y-1.5">
            <Label htmlFor="password-lama" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Password Saat Ini
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password-lama"
                type={showLama ? "text" : "password"}
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="pl-9 pr-9 h-10"
                required
                minLength={6}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowLama((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showLama ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div className="space-y-1.5">
            <Label htmlFor="password-baru" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Password Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password-baru"
                type={showBaru ? "text" : "password"}
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="pl-9 pr-9 h-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowBaru((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showBaru ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordBaru.length > 0 && passwordBaru.length < 8 && (
              <p className="text-[11px] text-amber-600">Password minimal 8 karakter</p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password-konfirmasi" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Konfirmasi Password Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password-konfirmasi"
                type={showKonfirmasi ? "text" : "password"}
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className={`pl-9 pr-9 h-10 ${isPasswordMismatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowKonfirmasi((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showKonfirmasi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {isPasswordMismatch && (
              <p className="text-[11px] text-destructive">Password tidak cocok</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-9 px-4 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isFormValid || isSubmitting}
              className="h-9 px-6 text-xs gap-2"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {isSubmitting ? "Menyimpan..." : "Ganti Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
