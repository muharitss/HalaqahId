export interface OfflineQueuedMutation {
  client_mutation_id: string;
  type: "SETORAN_UPSERT" | "ABSENSI_UPSERT";
  client_recorded_at: string;
  status: "PENDING" | "SYNCED" | "NEEDS_REVIEW";
  payload: Record<string, any>;
  server_conflict?: Record<string, any>;
}

const DB_NAME = "halaqah_offline_db";
const STORE_NAME = "mutation_queue";

function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "client_mutation_id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueOfflineMutation(
  mutation: Omit<OfflineQueuedMutation, "status">
): Promise<OfflineQueuedMutation> {
  const item: OfflineQueuedMutation = {
    ...mutation,
    status: "PENDING",
  };
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
}

export async function listOfflineMutations(): Promise<OfflineQueuedMutation[]> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function updateOfflineMutationStatus(
  clientMutationId: string,
  status: OfflineQueuedMutation["status"],
  serverConflict?: Record<string, any>
): Promise<void> {
  const db = await openOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(clientMutationId);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (existing) {
        existing.status = status;
        if (serverConflict) existing.server_conflict = serverConflict;
        store.put(existing);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

