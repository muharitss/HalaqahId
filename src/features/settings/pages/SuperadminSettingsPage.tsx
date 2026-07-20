import {
  Loader2,
  ChevronLeft,
  Trash2,
  Settings,
  Bot,
  Globe,
  Shuffle,
  LayoutTemplate,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSuperadminSettings,
  PlatformSettingsCard,
  IntegrasiSettingsCard,
  SeoSettingsCard,
  RedirectsCard,
  LandingSectionsCard,
  KeamananSettingsCard,
  TestimonialsCard,
} from "../modules";

export default function SuperadminSettingsPage() {
  const {
    navigate,
    loading,
    saving,
    formData,
    showOpenaiKey,
    setShowOpenaiKey,
    showWaKey,
    setShowWaKey,
    fromPath,
    setFromPath,
    toPath,
    setToPath,
    statusCode,
    setStatusCode,
    editingRedirectId,
    setEditingRedirectId,
    redirects,
    landingSections,
    editingSectionKey,
    setEditingSectionKey,
    sectTitle,
    setSectTitle,
    sectSubtitle,
    setSectSubtitle,
    sectOrder,
    setSectOrder,
    sectActive,
    setSectActive,
    handleInputChange,
    handleSubmit,
    handleSaveRedirect,
    handleDeleteRedirect,
    handleSaveSection,
    handleEditRedirectClick,
    handleEditSection,
  } = useSuperadminSettings();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate("/superadmin")}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Platform</h1>
            <p className="text-muted-foreground text-sm">
              Kelola konfigurasi sistem global, SEO defaults, redirect paths, dan section landing page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/superadmin/settings/trash")}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            <span>Tempat Sampah</span>
          </Button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8 h-11 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="platform" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Settings size={14} />
            <span>Platform</span>
          </TabsTrigger>
          <TabsTrigger value="integrasi" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Bot size={14} />
            <span>Integrasi</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Globe size={14} />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="redirects" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Shuffle size={14} />
            <span>Redirect</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center gap-1.5 text-[11px] font-bold">
            <LayoutTemplate size={14} />
            <span>Landing</span>
          </TabsTrigger>
          <TabsTrigger value="testimoni" className="flex items-center gap-1.5 text-[11px] font-bold">
            <MessageSquare size={14} />
            <span>Testimoni</span>
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Shield size={14} />
            <span>Keamanan</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB CONTENT: PLATFORM */}
        <TabsContent value="platform">
          <PlatformSettingsCard
            formData={formData}
            saving={saving}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </TabsContent>

        {/* TAB CONTENT: INTEGRASI */}
        <TabsContent value="integrasi">
          <IntegrasiSettingsCard
            formData={formData}
            saving={saving}
            showOpenaiKey={showOpenaiKey}
            setShowOpenaiKey={setShowOpenaiKey}
            showWaKey={showWaKey}
            setShowWaKey={setShowWaKey}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </TabsContent>

        {/* TAB CONTENT: SEO */}
        <TabsContent value="seo">
          <SeoSettingsCard
            formData={formData}
            saving={saving}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </TabsContent>

        {/* TAB CONTENT: REDIRECT PATHS */}
        <TabsContent value="redirects" className="space-y-6">
          <RedirectsCard
            redirects={redirects}
            fromPath={fromPath}
            setFromPath={setFromPath}
            toPath={toPath}
            setToPath={setToPath}
            statusCode={statusCode}
            setStatusCode={setStatusCode}
            editingRedirectId={editingRedirectId}
            setEditingRedirectId={setEditingRedirectId}
            handleSaveRedirect={handleSaveRedirect}
            handleEditRedirectClick={handleEditRedirectClick}
            handleDeleteRedirect={handleDeleteRedirect}
          />
        </TabsContent>

        {/* TAB CONTENT: LANDING PAGE EDITOR */}
        <TabsContent value="landing" className="space-y-6">
          <LandingSectionsCard
            landingSections={landingSections}
            editingSectionKey={editingSectionKey}
            setEditingSectionKey={setEditingSectionKey}
            sectTitle={sectTitle}
            setSectTitle={setSectTitle}
            sectSubtitle={sectSubtitle}
            setSectSubtitle={setSectSubtitle}
            sectOrder={sectOrder}
            setSectOrder={setSectOrder}
            sectActive={sectActive}
            setSectActive={setSectActive}
            handleSaveSection={handleSaveSection}
            handleEditSection={handleEditSection}
          />
        </TabsContent>

        {/* TAB CONTENT: TESTIMONI */}
        <TabsContent value="testimoni">
          <TestimonialsCard />
        </TabsContent>

        {/* TAB CONTENT: KEAMANAN */}
        <TabsContent value="keamanan">
          <KeamananSettingsCard
            formData={formData}
            saving={saving}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
