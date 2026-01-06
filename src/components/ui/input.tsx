import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        h-9 w-full min-w-0 rounded-md border
        bg-[var(--input)]
        text-[var(--foreground)]
        border-[var(--border)]
        px-3 py-1 text-base shadow-xs
        transition-[color,box-shadow]
        outline-none

        placeholder:text-[var(--muted)]
        selection:bg-primary
        selection:text-primary-foreground

        focus-visible:border-ring
        focus-visible:ring-ring/50
        focus-visible:ring-[3px]

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        file:inline-flex
        file:h-7
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        `,
        className
      )}
      {...props}
    />
  )
}

export { Input }
