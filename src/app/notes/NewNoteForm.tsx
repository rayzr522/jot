"use client"

import { auth } from "@clerk/nextjs"
import { useRef } from "react"

export function NewNoteForm(props: {
  createNote(content: string, userId: string): Promise<void>
}) {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <form
      action={async (formData) => {
        const content = formData.get("content")
        if (!content || typeof content !== "string") return null

        const { userId } = auth()
        if (!userId) return null

        await props.createNote(content, userId)
        formRef.current?.reset()
      }}
      ref={formRef}
    ></form>
  )
}
