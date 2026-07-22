import { useTenant } from "@/store/tenant-context";

export function LoginFooter() {
  const { brand } = useTenant();

  return (
    <div className="mt-auto py-4">
      <p className="text-xs text-text-secondary-light/60 dark:text-gray-600">
        {brand?.copyright_text || "© 2026 Halaqah Management System."}
      </p>
    </div>
  );
}
