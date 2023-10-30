"use client"

import { ReactNode } from "react"
import { useFormStatus } from "react-dom"

export function FormPending(props: { children: ReactNode }) {
  const { pending } = useFormStatus()

  return pending ? props.children : null
}
