export { default as KelolaSekolahPage } from "./pages";
export { default as ProfilSekolahPage } from "./pages/ProfilSekolahPage";
export {
  sekolahService,
  type KategoriSetoranResponse,
  useSekolahQueryList,
  useUserSchoolsQuery,
  useAssignUserSchoolMutation,
  useSetPrimarySchoolMutation,
  useRemoveUserSchoolMutation,
} from "./api";
export { useProfilSekolah } from "./hooks/useProfilSekolah";
export { useSekolahList } from "./hooks/useSekolahList";
