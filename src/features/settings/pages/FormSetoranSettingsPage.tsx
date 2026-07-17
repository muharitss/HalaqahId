import { ChevronLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormSetoranSettings, FormPreviewCard, AddFieldDialog, CustomFieldsList } from "../modules";

export default function FormSetoranSettingsPage() {
  const {
    navigate,
    fields,
    isAddOpen,
    setIsAddOpen,
    newFieldId,
    setNewFieldId,
    newFieldLabel,
    setNewFieldLabel,
    newFieldType,
    setNewFieldType,
    newFieldRequired,
    setNewFieldRequired,
    newFieldOptionsString,
    setNewFieldOptionsString,
    isLoading,
    isSaving,
    handleAddField,
    handleRemoveField,
    handleSaveConfig,
  } = useFormSetoranSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/kepala-muhafidz/settings")}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Form Setoran</h1>
            <p className="text-sm text-muted-foreground">
              Konfigurasi kolom input kustom tambahan untuk formulir setoran santri
            </p>
          </div>
        </div>
        <Button
          onClick={handleSaveConfig}
          disabled={isSaving || isLoading}
          className="gap-2"
        >
          <Save size={16} />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL KANAN: PREVIEW FORM */}
        <div className="lg:col-span-1 space-y-6">
          <FormPreviewCard fields={fields} />
        </div>

        {/* PANEL KIRI: MANAJEMEN FIELD */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Daftar Field Kustom</CardTitle>
                <CardDescription>
                  Urutan field ini akan ditampilkan di bagian bawah form setoran muhafiz.
                </CardDescription>
              </div>
              <AddFieldDialog
                isAddOpen={isAddOpen}
                setIsAddOpen={setIsAddOpen}
                newFieldLabel={newFieldLabel}
                setNewFieldLabel={setNewFieldLabel}
                newFieldId={newFieldId}
                setNewFieldId={setNewFieldId}
                newFieldType={newFieldType}
                setNewFieldType={setNewFieldType}
                newFieldOptionsString={newFieldOptionsString}
                setNewFieldOptionsString={setNewFieldOptionsString}
                newFieldRequired={newFieldRequired}
                setNewFieldRequired={setNewFieldRequired}
                handleAddField={handleAddField}
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4 py-8 text-center text-muted-foreground text-sm">
                  Memuat konfigurasi...
                </div>
              ) : (
                <CustomFieldsList
                  fields={fields}
                  handleRemoveField={handleRemoveField}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
