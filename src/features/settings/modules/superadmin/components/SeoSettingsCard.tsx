import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SeoSettingsCardProps {
  formData: Record<string, string>;
  saving: boolean;
  handleInputChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function SeoSettingsCard({
  formData,
  saving,
  handleInputChange,
  handleSubmit,
}: SeoSettingsCardProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SEO & Meta Tags Default</CardTitle>
          <CardDescription>Digunakan untuk fallback meta tags landing page utama dan sekolah.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={formData.seo_meta_title || ""}
                onChange={(e) => handleInputChange("seo_meta_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Keywords (dipisah koma)</Label>
              <Input
                value={formData.seo_meta_keywords || ""}
                onChange={(e) => handleInputChange("seo_meta_keywords", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <textarea
              value={formData.seo_meta_description || ""}
              onChange={(e) => handleInputChange("seo_meta_description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-primary bg-white dark:bg-slate-900"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input
                value={formData.seo_google_analytics_id || ""}
                onChange={(e) => handleInputChange("seo_google_analytics_id", e.target.value)}
                placeholder="G-XXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Favicon URL</Label>
              <Input
                value={formData.seo_favicons || ""}
                onChange={(e) => handleInputChange("seo_favicons", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={formData.seo_logo || ""}
                onChange={(e) => handleInputChange("seo_logo", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default OG Image URL</Label>
              <Input
                value={formData.seo_og_image_default || ""}
                onChange={(e) => handleInputChange("seo_og_image_default", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Default Twitter Image URL</Label>
              <Input
                value={formData.seo_twitter_image_default || ""}
                onChange={(e) => handleInputChange("seo_twitter_image_default", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Robots.txt Content</Label>
            <textarea
              value={formData.seo_robots || ""}
              onChange={(e) => handleInputChange("seo_robots", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary resize-none bg-white dark:bg-slate-900"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization Schema (JSON-LD)</Label>
              <textarea
                value={formData.seo_organization_schema || ""}
                onChange={(e) => handleInputChange("seo_organization_schema", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary bg-white dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label>Social Links (JSON Array)</Label>
              <textarea
                value={formData.seo_social_links || ""}
                onChange={(e) => handleInputChange("seo_social_links", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary bg-white dark:bg-slate-900"
              />
            </div>
          </div>
          <Button type="submit" className="font-bold text-xs" disabled={saving}>
            Simpan Perubahan SEO
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
