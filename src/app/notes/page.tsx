import { db } from "@/db"
import { notes } from "@/db/schema"
import { button } from "@/styles"
import { auth } from "@clerk/nextjs"
import { InferSelectModel, and, desc, eq } from "drizzle-orm"
import { revalidateTag, unstable_cache } from "next/cache"
import { Suspense } from "react"
import { ConfirmButton } from "./ConfirmButton"
import { DisableWhileSubmitting } from "./DisableWhileSubmitting"
import { ResettingForm } from "./ResettingForm"
import { Spinner } from "./Spinner"

type Note = InferSelectModel<typeof notes>

function fetchAllNotes(userId: string) {
  return unstable_cache(
    () =>
      db.query.notes.findMany({
        where: eq(notes.userId, userId),
      }),
    ["all-notes", userId],
    { tags: ["notes"] },
  )()
}

export default function Page() {
  const { userId } = auth()
  if (!userId) return null

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 p-8 lg:max-w-xl">
      <ResettingForm
        className="ring-primary-400 w-full rounded-lg border border-neutral-700 bg-neutral-900 focus-within:shadow-inner focus-within:ring-2"
        action={async (data: FormData) => {
          "use server"

          await new Promise((r) => setTimeout(r, 2000))
          const content = data.get("content")
          if (!content || typeof content !== "string") return null

          await db.insert(notes).values({
            id: crypto.randomUUID(),
            content,
            userId,
            createdAt: new Date(),
          })
          revalidateTag("notes")
        }}
      >
        <DisableWhileSubmitting>
          <textarea
            className="block w-full resize-none border-0 border-b border-neutral-700 bg-transparent p-4 focus:border-neutral-700 focus:ring-0"
            rows={5}
            name="content"
            placeholder="I'm thinking about..."
            autoFocus
          />
          <div className="p-2">
            <button
              type="submit"
              className={`${button({ layout: "row", style: "text" })} ml-auto`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Save
            </button>
          </div>
        </DisableWhileSubmitting>
      </ResettingForm>
      <Suspense fallback={<Spinner />}>
        <NoteList />
      </Suspense>
    </div>
  )
}

function* getNoteElements(notes: Note[]) {
  let lastSeenDate = 0
  for (const note of notes) {
    const noteDate = Math.floor(
      note.createdAt.getTime() / (1000 * 60 * 60 * 24),
    )
    if (lastSeenDate !== noteDate) {
      lastSeenDate = noteDate
      yield <li key={noteDate}>{note.createdAt.toLocaleDateString()}</li>
    }
    yield (
      <li key={note.id}>
        <Note note={note} />
      </li>
    )
  }
}

async function NoteList() {
  const { userId } = auth()
  if (!userId) return null

  const allNotes = await db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
  })

  return (
    <ul className="w-full space-y-4 p-4">{[...getNoteElements(allNotes)]}</ul>
  )
}

function Note({ note }: { note: Note }) {
  return (
    <div className="space-y-4 rounded-lg bg-neutral-700 p-4 hover:brightness-105">
      <p className="whitespace-pre-wrap">{note.content.trim()}</p>
      <div className="text-secondary-400 flex items-center justify-between">
        <ConfirmButton
          confirmText="Are you sure you want to delete this note?"
          action={async () => {
            "use server"
            const { userId } = auth()
            if (!userId) return null
            await db
              .delete(notes)
              .where(and(eq(notes.id, note.id), eq(notes.userId, userId)))
            revalidateTag("notes")
          }}
          aria-label="Delete note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </ConfirmButton>
        <time
          dateTime={note.createdAt.toISOString()}
          className="text-neutral-400"
        >
          {note.createdAt.toLocaleString()}
        </time>
      </div>
    </div>
  )
}
