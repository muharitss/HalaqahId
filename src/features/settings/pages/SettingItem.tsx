import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export function SettingItem({ icon, title, description, onClick, variant = "default" }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full transition-all group px-4"
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg mr-4 shrink-0",
        variant === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
      )}>
        {icon}
      </div>
      <div className="flex flex-col items-start overflow-hidden mr-2">
        <span className={cn("font-medium text-sm sm:text-base", variant === "destructive" && "text-destructive")}>
          {title}
        </span>
        {description && <span className="text-xs text-muted-foreground truncate w-full">{description}</span>}
      </div>
      <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}

