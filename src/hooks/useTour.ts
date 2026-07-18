import { useEffect, useRef } from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

interface UseTourProps {
  tourKey: string;
  steps: DriveStep[];
  userId?: number | string | null;
  autoStart?: boolean;
  ready?: boolean;
}

export function useTour({ tourKey, steps, userId, autoStart = true, ready = true }: UseTourProps) {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    if (!userId || !ready) return;

    const storageKey = `${tourKey}_completed_${userId}`;

    driverRef.current = driver({
      animate: true,
      showProgress: true,
      progressText: "{{current}} dari {{total}}",
      nextBtnText: "Lanjut",
      prevBtnText: "Kembali",
      doneBtnText: "Selesai",
      allowClose: true,
      popoverClass: "halaqah-tour-popover",
      steps: steps,
      onDestroyed: () => {
        // Simpan status selesai saat ditutup atau diselesaikan oleh user
        localStorage.setItem(storageKey, "completed");
      },
    });

    const hasCompleted = localStorage.getItem(storageKey);
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (autoStart && !hasCompleted && driverRef.current) {
      timer = setTimeout(() => {
        driverRef.current?.drive();
      }, 500); // Berikan delay sedikit agar DOM render selesai sepenuhnya
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [tourKey, steps, userId, autoStart, ready]);

  const restartTour = () => {
    if (!userId) return;
    const storageKey = `${tourKey}_completed_${userId}`;
    localStorage.removeItem(storageKey);
    driverRef.current?.drive();
  };

  return { restartTour };
}
