import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function RewardProgramInfo() {
  return (
    <AccordionItem value="reward" className="border-b-0">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Reward Program
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 leading-relaxed">
        <div className="space-y-4">
          <p className="font-bold text-sm">Program Apresiasi Hafalan Al-Qur'an:</p>
          <div className="grid gap-2">
            {[
              { l: "3 Juz (30, 29, 28)", r: "Sertifikat + Traktiran (Rp15.000)", e: "untuk 3 tercepat per angkatan" },
              { l: "1 Juz (Sekali Duduk)", r: "Sertifikat + Traktiran (Rp15.000)" },
              { l: "10 Juz", r: "Sertifikat + Uang Jajan (Rp100.000)" },
              { l: "20 Juz", r: "Sertifikat + Uang Jajan (Rp200.000)" },
              { l: "30 Juz", r: "Sertifikat + Uang Saku (Rp300.000)" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border bg-muted/20 gap-2">
                <span className="font-semibold text-sm">{item.l}</span>
                <div className="flex flex-col items-end w-full sm:w-auto">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">{item.r}</Badge>
                  {item.e && <span className="text-[10px] text-muted-foreground italic mt-1">{item.e}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
