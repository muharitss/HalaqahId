import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder={placeholder || "Ketik nama santri..."}
        className="pl-10 h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary bg-card"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}