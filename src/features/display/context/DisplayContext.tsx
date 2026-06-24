import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { displayService } from "@/features/display/api/displayService";
import { type DisplayContextType, type DisplaySantri } from "@/types/domain/display";

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useParams<{ token: string }>();
  const [santriList, setSantriList] = useState<DisplaySantri[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSantri = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const result = await displayService.getSantriList(token);
      
      // Safeguard: Pastikan result benar-benar array sebelum masuk ke state
      setSantriList(Array.isArray(result) ? result : []);
    } catch (error) {
        console.error("Gagal load santri:", error);
        setSantriList([]);
    } finally {
        setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshSantri();
  }, [refreshSantri]);

  return (
    <DisplayContext.Provider value={{ santriList, isLoading, refreshSantri }}>
      {children}
    </DisplayContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) throw new Error("useDisplay must be used within DisplayProvider");
  return context;
};
