import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Term } from "@/components/ui/Term";
import {
  usePengumumanList,
  usePengumumanUnreadCount,
  usePengumumanMutations,
} from "../api";
import { PengumumanCard } from "../components/PengumumanCard";
import { PengumumanDetailDialog } from "../components/PengumumanDetailDialog";
import type { PengumumanItem } from "../types";

export function PengumumanListPage() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<PengumumanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const queryFilters = useMemo(() => {
    return {
      active_only: true,
      search: search.trim() ? search.trim() : undefined,
    };
  }, [search]);

  const { data: pengumumanResult, isLoading } = usePengumumanList(queryFilters);
  const { data: unreadCount = 0 } = usePengumumanUnreadCount();
  const { markAsReadMutation } = usePengumumanMutations();

  const allItems = useMemo(
    () => pengumumanResult?.data || [],
    [pengumumanResult?.data]
  );

  const displayedItems = useMemo(() => {
    if (tab === "unread") {
      return allItems.filter((item) => item.is_read === false);
    }
    return allItems;
  }, [allItems, tab]);

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleViewDetail = (item: PengumumanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Pusat Pengumuman
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Informasi, edaran resmi, dan pengumuman seputar kegiatan{" "}
            <Term code="HALAQAH" className="lowercase" />.
          </p>
        </div>

        {unreadCount > 0 && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 self-start sm:self-auto px-3 py-1 font-medium tabular-nums"
          >
            {unreadCount} belum dibaca
          </Badge>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as "all" | "unread")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-64">
            <TabsTrigger value="all">
              Semua ({allItems.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Belum Dibaca ({unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau isi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="py-14 px-4 text-center border rounded-lg bg-card">
          <h3 className="font-semibold text-base text-foreground">
            {search.trim()
              ? "Tidak Ada Hasil Pencarian"
              : tab === "unread"
              ? "Semua Pengumuman Sudah Dibaca"
              : "Belum Ada Pengumuman"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-3">
            {search.trim()
              ? `Tidak ditemukan pengumuman yang sesuai dengan kata kunci "${search}".`
              : tab === "unread"
              ? "Tidak ada pengumuman baru yang belum Anda baca."
              : "Saat ini belum ada pengumuman yang ditujukan untuk Anda."}
          </p>
          {search.trim() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch("")}
            >
              Hapus Pencarian
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedItems.map((item) => (
            <PengumumanCard
              key={item.id_pengumuman}
              item={item}
              canManage={false}
              onMarkAsRead={handleMarkAsRead}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <PengumumanDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={selectedItem}
        onMarkAsRead={handleMarkAsRead}
        canManage={false}
      />
    </div>
  );
}
export default PengumumanListPage;
