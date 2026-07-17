// API
export * from "./api";

// Services
export { setoranService } from "./api/services/setoranService";

// Hooks
export {
  useSetoran,
  useSmartSetoranMode,
  useLaporanData,
  useLaporanPdf,
  useMushafPage,
} from "./hooks";
export type { FormMode } from "./hooks";

// Modules (Form components & hooks)
export {
  SetoranForm,
  useFormInit,
  useDynamicSchema,
  buildPayload,
  useDraftManager,
  setoranBaseSchema,
  buildDynamicSchema,
  EditSetoranModal,
} from "./modules";

// Types
export type {
  SetoranPayload,
  SetoranRecord,
  SetoranItem,
  SetoranFormFields,
  MushafSelection,
  KategoriSetoran,
  DateFilter,
  LaporanHafalanData,
} from "./types";

export { InputSetoranPage as SetoranPage } from "./pages/input-setoran-page";
export { LaporanSetoranPage } from "./pages/laporan-setoran-page";
export { MushafPage } from "./pages/mushaf-page";