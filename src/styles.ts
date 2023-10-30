import { tv } from "tailwind-variants"

export const button = tv({
  base: "px-3 py-2 border rounded active:opacity-80 hover:scale-105 active:scale-95 transition-transform focus:outline-primary-400 focus:outline-offset-4 disabled:opacity-60",
  variants: {
    layout: {
      row: "flex items-center gap-2",
      none: "block",
    },
    style: {
      filled: "border-primary-400 bg-primary-400 text-neutral-900",
      outline: "border-primary-400 bg-transparent text-primary-400",
      text: "border-transparent bg-transparent text-primary-400",
    },
  },
  defaultVariants: {
    layout: "none",
    style: "filled",
  },
})

export const spinner = tv({
  base: "border-4 border-primary-400 border-r-primary-600 inline-block animate-spin rounded-full",
  variants: {
    size: {
      small: "w-4 h-4 border-2",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "medium",
  },
})
