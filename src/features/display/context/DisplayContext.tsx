import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { displayService } from "@/features/display/api/displayService";
import { type DisplayContextType } from "@/types/domain/display";

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useParams<{ token: string }>();
  const [santriList, setSantriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSantri = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const result = await displayService.getSantriList(token);
      
      // Safeguard: Pastikan result benar-benar array sebelum masuk ke state
      setSantriList(Array.isArray(result) ? result : [] as any);
    } catch (error) {
        console.error("Gagal load santri:", error);
        setSantriList([]);
    } finally {
        setIsLoading(false);
    }
    };

  useEffect(() => {
    refreshSantri();
  }, []);

  return (
    <DisplayContext.Provider value={{ santriList, isLoading, refreshSantri }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) throw new Error("useDisplay must be used within DisplayProvider");
  return context;
};