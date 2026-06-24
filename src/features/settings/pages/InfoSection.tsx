import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";

import { SupervisorInfo } from "../components/SupervisorInfo";
import { MuhafizHafalanInfo } from "../components/MuhafizHafalanInfo";
import { MuhafizBacaanInfo } from "../components/MuhafizBacaanInfo";
import { MuhafizKhususInfo } from "../components/MuhafizKhususInfo";
import { AlurKerjaInfo } from "../components/AlurKerjaInfo";
import { RewardProgramInfo } from "../components/RewardProgramInfo";

export default function InfoSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Informasi & SOP</h1>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <SupervisorInfo />
        <MuhafizHafalanInfo />
        <MuhafizBacaanInfo />
        <MuhafizKhususInfo />
        <AlurKerjaInfo />
        <RewardProgramInfo />
      </Accordion>

      <div className="text-center pt-6 border-t border-dashed">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">HalaqahId Information System</p>
      </div>
    </div>
  );
}
