import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

// 1. Tambahkan interface untuk mendefinisikan props
interface ThemeToggleProps {
  variant?: "simple" | "default"; // "?" berarti opsional
}

// 2. Terima props di fungsi
export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useAuth();

  // 3. Logika untuk varian "simple"
  if (variant === "simple") {
    return (
      <button onClick={toggleDarkMode} className="p-2">
        <FontAwesomeIcon 
          icon={isDarkMode ? faSun : faMoon} 
          className={isDarkMode ? 'text-yellow-500' : 'text-gray-500'}
        />
      </button>
    );
  }

  // Tampilan default (kode asli kamu)
  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-yellow-100 dark:from-gray-800 dark:to-purple-800 opacity-60" />
      
      <div
        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <FontAwesomeIcon 
            icon={isDarkMode ? faSun : faMoon} 
            className={`text-[10px] ${
              isDarkMode ? 'text-yellow-500' : 'text-indigo-600'
            }`}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full px-1.5">
        <FontAwesomeIcon icon={faSun} className="text-[10px] text-yellow-500 opacity-80" />
        <FontAwesomeIcon icon={faMoon} className="text-[10px] text-indigo-400 opacity-80" />
      </div>
    </button>
  );
}