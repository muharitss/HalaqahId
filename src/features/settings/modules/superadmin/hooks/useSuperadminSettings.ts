import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { systemSettingsService } from "@/features/settings/api/services/systemSettingsService";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";
import type { LandingSection, RedirectRule } from "../types/superadmin.types";

export type { LandingSection, RedirectRule };

export function useSuperadminSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showWaKey, setShowWaKey] = useState(false);

  // --- Redirects State ---
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState("301");
  const [editingRedirectId, setEditingRedirectId] = useState<number | null>(null);

  // --- Landing Sections State ---
  const [landingSections, setLandingSections] = useState<LandingSection[]>([]);
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [sectTitle, setSectTitle] = useState("");
  const [sectSubtitle, setSectSubtitle] = useState("");
  const [sectActive, setSectActive] = useState(true);
  const [sectOrder, setSectOrder] = useState("0");

  useEffect(() => {
    fetchSettings();
    fetchRedirects();
    fetchLandingSections();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await systemSettingsService.getSettings();
      if (res.success && res.data) {
        const dataMap: Record<string, string> = {};
        res.data.forEach((item) => {
          dataMap[item.key] = item.value;
        });
        setFormData(dataMap);
      } else {
        toast.error("Gagal memuat pengaturan sistem.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const fetchRedirects = async () => {
    try {
      const res = await axiosClient.get("/seo/redirects");
      if (res.data && res.data.success) {
        setRedirects(res.data.data);
      }
    } catch (e) {
      console.error("Gagal memuat pengalihan URL");
    }
  };

  const fetchLandingSections = async () => {
    try {
      const res = await axiosClient.get("/landing/admin/sections");
      if (res.data && res.data.success) {
        setLandingSections(res.data.data);
      }
    } catch (e) {
      console.error("Gagal memuat section landing page");
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await systemSettingsService.updateSettings(formData);
      if (res.success) {
        toast.success("Pengaturan sistem berhasil diperbarui!");
        if (res.data) {
          const dataMap: Record<string, string> = {};
          res.data.forEach((item) => {
            dataMap[item.key] = item.value;
          });
          setFormData(dataMap);
        }
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // --- Redirect Handlers ---
  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPath || !toPath) return;

    try {
      if (editingRedirectId) {
        await axiosClient.put(`/seo/redirects/${editingRedirectId}`, {
          from_path: fromPath,
          to_path: toPath,
          status_code: parseInt(statusCode),
        });
        toast.success("Redireksi berhasil diperbarui!");
      } else {
        await axiosClient.post("/seo/redirects", {
          from_path: fromPath,
          to_path: toPath,
          status_code: parseInt(statusCode),
        });
        toast.success("Redireksi baru berhasil dibuat!");
      }
      setFromPath("");
      setToPath("");
      setStatusCode("301");
      setEditingRedirectId(null);
      fetchRedirects();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan redireksi");
    }
  };

  const handleDeleteRedirect = async (id: number) => {
    if (!confirm("Hapus aturan redireksi ini?")) return;
    try {
      await axiosClient.delete(`/seo/redirects/${id}`);
      toast.success("Redireksi berhasil dihapus");
      fetchRedirects();
    } catch (e) {
      toast.error("Gagal menghapus redireksi");
    }
  };

  // --- Redirect Handlers ---
  const handleEditRedirectClick = (red: RedirectRule) => {
    setEditingRedirectId(red.id_redirect);
    setFromPath(red.from_path);
    setToPath(red.to_path);
    setStatusCode(red.status_code.toString());
  };

  // --- Landing Section Handlers ---
  const handleEditSection = (section: any) => {
    setEditingSectionKey(section.section_key);
    setSectTitle(section.title || "");
    setSectSubtitle(section.subtitle || "");
    setSectActive(section.is_active);
    setSectOrder(section.order.toString());
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSectionKey) return;

    try {
      await axiosClient.put(`/landing/admin/sections/${editingSectionKey}`, {
        title: sectTitle,
        subtitle: sectSubtitle,
        is_active: sectActive,
        order: parseInt(sectOrder),
      });
      toast.success("Section landing page berhasil diperbarui!");
      setEditingSectionKey(null);
      fetchLandingSections();
    } catch (e) {
      toast.error("Gagal menyimpan section landing page");
    }
  };

  return {
    navigate,
    formData,
    loading,
    saving,
    showOpenaiKey,
    setShowOpenaiKey,
    showWaKey,
    setShowWaKey,
    redirects,
    fromPath,
    setFromPath,
    toPath,
    setToPath,
    statusCode,
    setStatusCode,
    editingRedirectId,
    setEditingRedirectId,
    landingSections,
    editingSectionKey,
    setEditingSectionKey,
    sectTitle,
    setSectTitle,
    sectSubtitle,
    setSectSubtitle,
    sectActive,
    setSectActive,
    sectOrder,
    setSectOrder,
    handleInputChange,
    handleSubmit,
    handleSaveRedirect,
    handleDeleteRedirect,
    handleEditRedirectClick,
    handleSaveSection,
    handleEditSection,
  };
}
