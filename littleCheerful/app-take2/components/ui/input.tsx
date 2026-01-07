import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border-medium bg-parchment-light dark:bg-parchment-dark px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-light/50 dark:placeholder:text-ink-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light dark:focus-visible:ring-gold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-ink-light dark:text-ink-dark",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
