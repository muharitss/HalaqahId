import { useTerminology } from "@/hooks/useTerminology";

export interface TermProps {
  code: string;
  fallback?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function Term({
  code,
  fallback,
  prefix = "",
  suffix = "",
  className,
}: TermProps) {
  const label = useTerminology(code, fallback);

  if (className) {
    return (
      <span className={className}>
        {prefix}
        {label}
        {suffix}
      </span>
    );
  }

  return (
    <>
      {prefix}
      {label}
      {suffix}
    </>
  );
}
