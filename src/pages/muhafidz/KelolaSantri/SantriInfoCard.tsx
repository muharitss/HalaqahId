import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export function SantriInfoCard() {
  const targets = [
    { label: "Ringan", desc: "1-2 halaman per pertemuan (untuk pemula)", color: "text-green-500" },
    { label: "Sedang", desc: "3-4 halaman per pertemuan (rata-rata)", color: "text-yellow-500" },
    { label: "Intens", desc: "5-6 halaman per pertemuan (lanjutan)", color: "text-orange-500" },
    { label: "Khusus", desc: "Target khusus sesuai kesepakatan", color: "text-purple-500" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faBook} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="font-semibold dark:text-white mb-2">Keterangan Target Hafalan</h4>
          <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-2">
            {targets.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`font-bold ${t.color}`}>• {t.label}:</span>
                <span>{t.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}