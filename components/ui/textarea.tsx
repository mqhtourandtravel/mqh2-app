import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-lg border border-input bg-white px-4 py-3 text-[13.5px] text-primary transition-colors outline-none',
        'placeholder:text-muted-foreground',
        'focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'field-sizing-content',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
