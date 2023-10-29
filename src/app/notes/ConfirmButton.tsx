"use client";

import { HTMLAttributes } from "react";

export function ConfirmButton({
  confirmText,
  action,
  ...buttonProps
}: {
  confirmText: string;
  action: () => unknown;
} & Omit<HTMLAttributes<HTMLButtonElement>, "onClick">) {
  return (
    <button
      onClick={async () => {
        if (!confirm(confirmText)) return;
        await action();
      }}
      {...buttonProps}
    ></button>
  );
}
