import { tv } from "tailwind-variants";

export const button = tv({
  base: "px-3 py-2 border rounded active:opacity-80 hover:sclae-105 active:scale-95 transition-transform focus:outline-emerald-400 focus:outline-offset-4",
  variants: {
    layout: {
      row: "flex items-center gap-2",
      none: "block",
    },
    style: {
      filled: "border-emerald-400 bg-emerald-400 text-slate-900",
      outline: "border-emerald-400 bg-transparent text-emerald-400",
      text: "border-transparent bg-transparent text-emerald-400",
    },
  },
  defaultVariants: {
    layout: "block",
    style: "filled",
  },
});
