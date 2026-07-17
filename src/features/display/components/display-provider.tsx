import React, { createContext, useContext } from "react";
import { useDisplayProvider } from "../hooks/useDisplayProvider";
import { type DisplayContextType } from "../types";

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider = ({ children }: { children: React.ReactNode }) => {
  const display = useDisplayProvider();

  return (
    <DisplayContext.Provider value={display}>
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
