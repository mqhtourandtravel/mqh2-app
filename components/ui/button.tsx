import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Varian tombol MQH: base rounded-full mengikuti bahasa visual "Majestic
// Voyage" di seluruh situs (semua CTA situs berbentuk pill, bukan kotak).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        // Solid espresso -- CTA utama di atas background terang
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Solid gold -- CTA utama sekunder (WhatsApp, booking, dst.)
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-primary-foreground',
        // Outline terang -- dipakai di atas background gelap (hero image/overlay)
        outlineLight:
          'border border-white/30 text-primary-foreground bg-transparent hover:border-secondary hover:text-secondary',
        // Outline standar -- dipakai di atas background terang
        outline:
          'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline font-medium',
      },
      size: {
        default: 'h-10 px-6 py-2.5 text-[13px]',
        sm: 'h-9 px-4 text-[12.5px] gap-1.5',
        lg: 'h-12 px-8 text-[13.5px]',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
