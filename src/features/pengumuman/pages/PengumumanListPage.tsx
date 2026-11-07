import { useState, useMemo } from "react";
import { Search, Megaphone, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  usePengumumanList,
  usePengumumanUnreadCount,
  usePengumumanMutations,
} from "../api";
import { PengumumanCard } from "../components/PengumumanCard";

export function PengumumanListPage() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

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

  // Filter based on tab
  const displayedItems = useMemo(() => {
    if (tab === "unread") {
      return allItems.filter((item) => item.is_read === false);
    }
    return allItems;
  }, [allItems, tab]);

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-primary" />
            Pusat Pengumuman
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Informasi, edaran, dan pengumuman terbaru seputar kegiatan halaqah.
          </p>
        </div>

        {unreadCount > 0 && (
          <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary self-start sm:self-auto py-1 px-3">
            <span className="font-semibold mr-1">{unreadCount}</span> pengumuman belum dibaca
          </Badge>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Memuat pengumuman...
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="py-16 text-center border rounded-lg bg-card/40">
          <CheckCheck className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
          <h3 className="font-semibold text-base">
            {tab === "unread"
              ? "Semua Pengumuman Sudah Dibaca"
              : "Belum Ada Pengumuman"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            {tab === "unread"
              ? "Tidak ada pengumuman baru yang belum Anda baca."
              : "Saat ini belum ada pengumuman yang ditujukan untuk Anda."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedItems.map((item) => (
            <PengumumanCard
              key={item.id_pengumuman}
              item={item}
              canManage={false}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default PengumumanListPage;
