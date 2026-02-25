import { Skeleton } from "@/components/ui/skeleton";

export function LaporanSkeleton() {
  return (
    <div className="space-y-4 pt-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}