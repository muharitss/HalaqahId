import { useTerminology } from "@/lib/hooks/useTerminology";

interface TermProps {
  code: string;
}

export function Term({ code }: TermProps) {
  const label = useTerminology(code);
  return <>{label}</>;
}
