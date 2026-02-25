import { useAuth } from "@/features/auth/context/AuthContext";
import { CardContent } from "@/components/ui/card";
import { MuhafizManagement } from "@/components/typed-text";

import { useMuhafiz } from "./hooks/useMuhafiz";
import { BuatAkun } from "./components/BuatAkun";
import { DaftarAkun } from "./components/DaftarAkun";
import { EditAkun } from "./components/EditAkun";
import { DeleteAkun } from "./components/DeleteAkun";
import { AccessDenied } from "./components/AccessDenied";

export default function KelolaMuhafizPage() {
  const { user } = useAuth();
  const {
    muhafizList,
    activeMuhafizIds,
    isLoading,
    editingMuhafiz,
    deletingMuhafiz,
    isEditOpen,
    isDeleteOpen,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleImpersonate,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
  } = useMuhafiz();

  if (user?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 md:px-0">
        <div>
          <MuhafizManagement/>
          <p className="text-sm md:text-base text-muted-foreground">
            Manajemen hak akses dan profil pengampu halaqah
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BuatAkun onSuccess={handleCreateSuccess} />
        </div>
      </div>

      <CardContent className="p-0">
        <DaftarAkun
          muhafizList={muhafizList}
          activeMuhafizIds={activeMuhafizIds}
          isLoading={isLoading}
          onEditClick={openEditModal}
          onDeleteClick={openDeleteModal}
          onImpersonateClick={handleImpersonate}
          onCreateClick={handleCreateSuccess}
        />
      </CardContent>

      <EditAkun
        muhafiz={editingMuhafiz}
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
      />

      <DeleteAkun
        muhafiz={deletingMuhafiz}
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}