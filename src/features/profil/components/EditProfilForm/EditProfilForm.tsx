import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/types/domain/auth";
import type { UserProfileData, ProfilFormValues } from "../../types";
import { EditProfilHeader } from "./components/EditProfilHeader";
import { PersonalProfileFields } from "./components/PersonalProfileFields";
import { MuhafizProfileFields } from "./components/MuhafizProfileFields";
import { useEditProfilForm } from "./hooks/useEditProfilForm";

interface EditProfilFormProps {
  user: AuthUser | UserProfileData;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (values: ProfilFormValues) => void;
}

export function EditProfilForm({
  user,
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
}: EditProfilFormProps) {
  const {
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
  } = useEditProfilForm({ user, onSave, onEdit });

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden transition-all duration-300">
      {/* 1. Header with Edit / Cancel toggle */}
      <EditProfilHeader
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onStartEdit={handleStartEdit}
        onCancel={onCancel}
      />

      {/* 2. Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <PersonalProfileFields
          email={user.email}
          isEditing={isEditing}
          name={name}
          onNameChange={setName}
          initialName={initialName}
          nomorTelepon={nomorTelepon}
          onNomorTeleponChange={setNomorTelepon}
          initialPhone={initialPhone}
          bio={bio}
          onBioChange={setBio}
          initialBio={initialBio}
        />

        {isMuhafizOrKoordinator && (
          <MuhafizProfileFields
            isEditing={isEditing}
            spesialisasi={spesialisasi}
            onSpesialisasiChange={setSpesialisasi}
            initialSpesialisasi={initialSpesialisasi}
            noIjazah={noIjazah}
            onNoIjazahChange={setNoIjazah}
            initialNoIjazah={initialNoIjazah}
          />
        )}

        {/* 3. Action Buttons */}
        {isEditing && (
          <div className="pt-3 flex justify-end gap-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-9 px-4 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || name.trim().length < 2}
              className="gap-2 h-9 px-6 text-xs font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditProfilForm;
