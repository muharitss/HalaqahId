import axiosClient from "@/lib/axiosClient";
import {
  listOfflineMutations,
  updateOfflineMutationStatus,
  type OfflineQueuedMutation,
} from "./mutationQueue";

export async function flushOfflineMutations(
  forceResolution?: { clientMutationId: string; resolution: "MERGE" | "OVERWRITE" | "DISCARD" }
) {
  const all = await listOfflineMutations();
  const pending = all.filter(
    (m) =>
      m.status === "PENDING" ||
      (forceResolution && m.client_mutation_id === forceResolution.clientMutationId)
  );

  if (pending.length === 0) return { synced: 0, conflicts: 0 };

  const res = await axiosClient.post("/sync/batch", {
    mutations: pending.map((m: OfflineQueuedMutation) => ({
      client_mutation_id: m.client_mutation_id,
      type: m.type,
      client_recorded_at: m.client_recorded_at,
      force_resolution:
        forceResolution?.clientMutationId === m.client_mutation_id
          ? forceResolution.resolution
          : undefined,
      payload: m.payload,
    })),
  });

  const results = res.data?.data?.results || [];
  let synced = 0;
  let conflicts = 0;

  for (const item of results) {
    if (item.status === "APPLIED" || item.status === "DUPLICATE_IDEMPOTENT" || item.status === "DISCARDED") {
      await updateOfflineMutationStatus(item.client_mutation_id, "SYNCED");
      synced++;
    } else if (item.status === "CONFLICT_NEEDS_REVIEW") {
      await updateOfflineMutationStatus(
        item.client_mutation_id,
        "NEEDS_REVIEW",
        item.server_state
      );
      conflicts++;
    }
  }

  return { synced, conflicts };
}

