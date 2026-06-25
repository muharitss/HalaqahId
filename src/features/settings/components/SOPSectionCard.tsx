import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SOPSection, SOPItem } from "@/types/domain/sekolah";

function RenderItem({ item }: { item: SOPItem }) {
  return (
    <div className="space-y-1.5">
      {item.subtitle && (
        <h4 className="font-bold underline italic mb-1 uppercase text-xs">
          {item.subtitle}
        </h4>
      )}
      {item.type === "text" ? (
        <p className="text-sm leading-relaxed text-balance">
          {item.content.join(" ")}
        </p>
      ) : (
        <ul
          className={`ml-5 space-y-1 text-sm ${
            item.type === "numbered_list" ? "list-decimal" : "list-disc"
          }`}
        >
          {item.content.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface SOPSectionCardProps {
  section: SOPSection;
}

export function SOPSectionCard({ section }: SOPSectionCardProps) {
  return (
    <AccordionItem value={section.id}>
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        {section.title || <span className="italic text-muted-foreground text-sm font-normal">Tanpa Judul</span>}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed">
        {section.items.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Belum ada konten di section ini.</p>
        ) : (
          <div className="space-y-4">
            {section.items.map((item) => (
              <RenderItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
