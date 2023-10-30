"use client"

import { FormHTMLAttributes, useRef } from "react"

export function ResettingForm({
  action,
  ...otherProps
}: FormHTMLAttributes<HTMLFormElement>) {
  const ref = useRef<HTMLFormElement>(null)
  return (
    <form
      ref={ref}
      {...otherProps}
      action={
        typeof action === "function"
          ? async (formData) => {
              await action(formData)
              ref.current?.reset()
            }
          : action
      }
    />
  )
}
