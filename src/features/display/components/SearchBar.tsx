import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ value, onChange, placeholder, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative max-w-lg mx-auto group">
        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-focus-within:opacity-100 -m-1 transition-opacity duration-300" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-200" />
        <Input
          placeholder={placeholder || "Cari nama santri..."}
          className="pl-12 pr-10 h-12 text-base rounded-xl border-border/60 bg-card shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all duration-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {value && typeof resultCount === "number" && (
        <p className="text-center text-xs text-muted-foreground animate-in fade-in duration-200">
          {resultCount} dari {totalCount} santri ditemukan
        </p>
      )}
    </div>
  );
}
