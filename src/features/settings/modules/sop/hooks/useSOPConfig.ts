import { useState, useEffect, useCallback } from "react";
import { sekolahService } from "@/features/sekolah";
import type { SOPConfig, SOPSection, SOPItem, SOPItemType } from "@/types/domain/sekolah";
import { nanoid } from "@/utils/nanoid";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSOPConfig() {
  const [config, setConfig] = useState<SOPConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    sekolahService
      .getProfile()
      .then((res) => {
        if (!cancelled) {
          setConfig(res.data?.sop_config ?? null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Gagal memuat konfigurasi SOP");
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  const save = useCallback(async (newConfig: SOPConfig) => {
    setSaveStatus("saving");
    try {
      const res = await sekolahService.updateProfile({ sop_config: newConfig });
      setConfig(res.data?.sop_config ?? null);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }, []);

  // ── Section CRUD ─────────────────────────────────────────────────────────
  const addSection = useCallback((): SOPSection => {
    const newSection: SOPSection = {
      id: nanoid(),
      title: "",
      order: (config?.sections.length ?? 0) + 1,
      items: [],
    };
    setConfig((prev) => ({
      sections: [...(prev?.sections ?? []), newSection],
    }));
    return newSection;
  }, [config]);

  const updateSection = useCallback((id: string, updates: Partial<Pick<SOPSection, "title">>) => {
    setConfig((prev) => ({
      sections: (prev?.sections ?? []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setConfig((prev) => ({
      sections: (prev?.sections ?? [])
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));
  }, []);

  const moveSectionUp = useCallback((id: string) => {
    setConfig((prev) => {
      const sections = [...(prev?.sections ?? [])];
      const idx = sections.findIndex((s) => s.id === id);
      if (idx <= 0) return prev;
      [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
      return { sections: sections.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }, []);

  const moveSectionDown = useCallback((id: string) => {
    setConfig((prev) => {
      const sections = [...(prev?.sections ?? [])];
      const idx = sections.findIndex((s) => s.id === id);
      if (idx < 0 || idx >= sections.length - 1) return prev;
      [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
      return { sections: sections.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }, []);

  // ── Item CRUD ────────────────────────────────────────────────────────────
  const addItem = useCallback((sectionId: string): SOPItem => {
    const newItem: SOPItem = {
      id: nanoid(),
      subtitle: "",
      type: "bullet_list",
      content: [""],
    };
    setConfig((prev) => ({
      sections: (prev?.sections ?? []).map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      ),
    }));
    return newItem;
  }, []);

  const updateItem = useCallback(
    (sectionId: string, itemId: string, updates: Partial<Pick<SOPItem, "subtitle" | "type" | "content">>) => {
      setConfig((prev) => ({
        sections: (prev?.sections ?? []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : s
        ),
      }));
    },
    []
  );

  const deleteItem = useCallback((sectionId: string, itemId: string) => {
    setConfig((prev) => ({
      sections: (prev?.sections ?? []).map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
          : s
      ),
    }));
  }, []);

  const addContentLine = useCallback((sectionId: string, itemId: string, value = "") => {
    setConfig((prev) => ({
      sections: (prev?.sections ?? []).map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((item) =>
                item.id === itemId
                  ? { ...item, content: [...item.content, value] }
                  : item
              ),
            }
          : s
      ),
    }));
  }, []);

  const updateContentLine = useCallback(
    (sectionId: string, itemId: string, lineIdx: number, value: string) => {
      setConfig((prev) => ({
        sections: (prev?.sections ?? []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((item) => {
                  if (item.id !== itemId) return item;
                  const content = [...item.content];
                  content[lineIdx] = value;
                  return { ...item, content };
                }),
              }
            : s
        ),
      }));
    },
    []
  );

  const removeContentLine = useCallback(
    (sectionId: string, itemId: string, lineIdx: number) => {
      setConfig((prev) => ({
        sections: (prev?.sections ?? []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((item) => {
                  if (item.id !== itemId) return item;
                  const content = item.content.filter((_, i) => i !== lineIdx);
                  return { ...item, content: content.length ? content : [""] };
                }),
              }
            : s
        ),
      }));
    },
    []
  );

  const changeItemType = useCallback(
    (sectionId: string, itemId: string, type: SOPItemType) => {
      setConfig((prev) => ({
        sections: (prev?.sections ?? []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((item) =>
                  item.id === itemId ? { ...item, type } : item
                ),
              }
            : s
        ),
      }));
    },
    []
  );

  return {
    config,
    isLoading,
    saveStatus,
    error,
    save,
    // Section ops
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    // Item ops
    addItem,
    updateItem,
    deleteItem,
    addContentLine,
    updateContentLine,
    removeContentLine,
    changeItemType,
  };
}
