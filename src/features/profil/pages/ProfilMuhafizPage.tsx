import { UserProfilePage } from "./UserProfilePage";

/**
 * ProfilMuhafizPage — Wrapper komponen profil muhafiz untuk backward-compatibility.
 * Mengintegrasikan UserProfile API baru dengan fallback user data.
 */
export function ProfilMuhafizPage() {
  return <UserProfilePage />;
}

export default ProfilMuhafizPage;
