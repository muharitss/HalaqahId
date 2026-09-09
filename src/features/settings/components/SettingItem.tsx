import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  action?: React.ReactNode;
  actionLabel?: string;
  destructive?: boolean;
}

export function SettingItem({
  icon,
  title,
  badge,
  description,
  onClick,
  action,
  actionLabel,
  destructive = false,
}: SettingItemProps) {
  const isClickable = Boolean(onClick) && !action;

  const content = (
    <div className="flex items-center justify-between p-4 gap-4 w-full">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Ikon monokrom standar shadcn */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            destructive && "bg-destructive/10 text-destructive"
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium leading-none",
                destructive ? "text-destructive" : "text-foreground"
              )}
            >
              {title}
            </span>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground truncate w-full mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {action ? (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {action}
        </div>
      ) : onClick ? (
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          {actionLabel && (
            <span className="text-xs hidden sm:inline">{actionLabel}</span>
          )}
          <ChevronRight className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left transition-colors hover:bg-muted/50 cursor-pointer block focus-visible:outline-none"
      >
        {content}
      </button>
    );
  }

  return <div className="w-full">{content}</div>;
}
