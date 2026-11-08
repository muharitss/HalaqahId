import { useState } from "react";
import type { AuthUser } from "@/types/domain/auth";
import type { UserProfileData, ProfilFormValues } from "../../../types";

interface UseEditProfilFormOptions {
  user: AuthUser | UserProfileData;
  onSave: (values: ProfilFormValues) => void;
  onEdit: () => void;
}

export function useEditProfilForm({
  user,
  onSave,
  onEdit,
}: UseEditProfilFormOptions) {
  const initialName =
    ("nama_lengkap" in user && user.nama_lengkap) || user.name || "";
  const initialPhone = user.nomor_telepon || "";
  const initialBio = ("bio" in user && user.bio) || "";
  const initialSpesialisasi =
    ("spesialisasi" in user && user.spesialisasi) || "";
  const initialNoIjazah = ("no_ijazah" in user && user.no_ijazah) || "";

  const [name, setName] = useState(initialName);
  const [nomorTelepon, setNomorTelepon] = useState(initialPhone);
  const [bio, setBio] = useState(initialBio);
  const [spesialisasi, setSpesialisasi] = useState(initialSpesialisasi);
  const [noIjazah, setNoIjazah] = useState(initialNoIjazah);

  const [prevValues, setPrevValues] = useState({
    initialName,
    initialPhone,
    initialBio,
    initialSpesialisasi,
    initialNoIjazah,
  });

  if (
    prevValues.initialName !== initialName ||
    prevValues.initialPhone !== initialPhone ||
    prevValues.initialBio !== initialBio ||
    prevValues.initialSpesialisasi !== initialSpesialisasi ||
    prevValues.initialNoIjazah !== initialNoIjazah
  ) {
    setPrevValues({
      initialName,
      initialPhone,
      initialBio,
      initialSpesialisasi,
      initialNoIjazah,
    });
    setName(initialName);
    setNomorTelepon(initialPhone);
    setBio(initialBio);
    setSpesialisasi(initialSpesialisasi);
    setNoIjazah(initialNoIjazah);
  }

  const isMuhafizOrKoordinator =
    user.role === "MUHAFIZ" ||
    user.role === "KOORDINATOR_TAHFIZ" ||
    ("roles" in user &&
      (user.roles?.includes("MUHAFIZ") ||
        user.roles?.includes("KOORDINATOR_TAHFIZ")));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return;

    onSave({
      name: name.trim(),
      nama_lengkap: name.trim(),
      nomor_telepon: nomorTelepon.trim(),
      bio: bio.trim() || undefined,
      spesialisasi: isMuhafizOrKoordinator ? spesialisasi.trim() || undefined : undefined,
      no_ijazah: isMuhafizOrKoordinator ? noIjazah.trim() || undefined : undefined,
    });
  };

  const handleStartEdit = () => {
    setName(initialName);
    setNomorTelepon(initialPhone);
    setBio(initialBio);
    setSpesialisasi(initialSpesialisasi);
    setNoIjazah(initialNoIjazah);
    onEdit();
  };

  return {
    name,
    setName,
    nomorTelepon,
    setNomorTelepon,
    bio,
    setBio,
    spesialisasi,
    setSpesialisasi,
    noIjazah,
    setNoIjazah,
    isMuhafizOrKoordinator,
    handleSubmit,
    handleStartEdit,
    initialName,
    initialPhone,
    initialBio,
    initialSpesialisasi,
    initialNoIjazah,
  };
}
