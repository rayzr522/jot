import { tv } from "tailwind-variants"

export const button = tv({
  base: "px-3 py-2 border rounded active:opacity-80 hover:scale-105 active:scale-95 transition-transform focus:outline-primary-400 focus:outline-offset-4 disabled:opacity-80",
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
