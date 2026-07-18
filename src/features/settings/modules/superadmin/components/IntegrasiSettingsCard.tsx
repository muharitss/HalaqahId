import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IntegrasiSettingsCardProps {
  formData: Record<string, string>;
  saving: boolean;
  showOpenaiKey: boolean;
  setShowOpenaiKey: (show: boolean) => void;
  showWaKey: boolean;
  setShowWaKey: (show: boolean) => void;
  handleInputChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function IntegrasiSettingsCard({
  formData,
  saving,
  showOpenaiKey,
  setShowOpenaiKey,
  showWaKey,
  setShowWaKey,
  handleInputChange,
  handleSubmit,
}: IntegrasiSettingsCardProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">OpenAI API (Tahfidz AI)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai_api_key">API Key</Label>
            <div className="relative">
              <Input
                id="openai_api_key"
                type={showOpenaiKey ? "text" : "password"}
                value={formData.openai_api_key || ""}
                onChange={(e) => handleInputChange("openai_api_key", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
              >
                {showOpenaiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model AI</Label>
              <Input
                value={formData.openai_model || ""}
                onChange={(e) => handleInputChange("openai_model", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Budget Token Bulanan / Sekolah</Label>
              <Input
                type="number"
                value={formData.openai_token_budget_per_school || ""}
                onChange={(e) => handleInputChange("openai_token_budget_per_school", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gateway WhatsApp & SMTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp Provider</Label>
              <Input
                value={formData.wa_gateway_provider || ""}
                onChange={(e) => handleInputChange("wa_gateway_provider", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp API Key</Label>
              <div className="relative">
                <Input
                  type={showWaKey ? "text" : "password"}
                  value={formData.wa_gateway_key || ""}
                  onChange={(e) => handleInputChange("wa_gateway_key", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setShowWaKey(!showWaKey)}
                >
                  {showWaKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>
            </div>
          </div>
          <Button type="submit" className="font-bold text-xs" disabled={saving}>
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
