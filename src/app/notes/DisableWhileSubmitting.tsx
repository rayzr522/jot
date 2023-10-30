"use client"
import { ReactNode } from "react"
import { useFormStatus } from "react-dom"

export function DisableWhileSubmitting(props: { children: ReactNode }) {
  const { pending } = useFormStatus()
  return <fieldset disabled={pending}>{props.children}</fieldset>
}
