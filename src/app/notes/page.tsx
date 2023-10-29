import { db } from "@/db"
import { notes } from "@/db/schema"
import { button } from "@/styles"
import { auth } from "@clerk/nextjs"
import { InferSelectModel, and, eq } from "drizzle-orm"
import { revalidateTag, unstable_cache } from "next/cache"
import { ConfirmButton } from "./ConfirmButton"

type Note = InferSelectModel<typeof notes>

function fetchAllNotes(userId: string) {
  return unstable_cache(
    () =>
      db.query.notes.findMany({
        where: eq(notes.userId, userId),
      }),
    ["all-notes", userId],
    { tags: ["notes"] }
  )
}

function* getNoteElements(notes: Note[]) {
  let lastSeenDate = 0
  const sortedNotes = [...notes].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  )
  for (const note of sortedNotes) {
    const noteDate = Math.floor(
      note.createdAt.getTime() / (1000 * 60 * 60 * 24)
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

export default async function Page() {
  const { userId } = auth()
  if (!userId) return null

  const allNotes = await db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
  })

  return (
    <div className="p-8 max-w-md lg:max-w-xl mx-auto">
      <form
        className="border rounded-lg border-slate-800 bg-slate-900 focus-within:shadow-inner focus-within:ring-2 ring-emerald-400"
        action={async (data: FormData) => {
          "use server"
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
        <textarea
          className="p-4 bg-transparent border-0 border-b resize-none border-slate-800 focus:border-slate-800 w-full focus:ring-0 block"
          rows={5}
          name="content"
          placeholder="I'm thinking about..."
          key={allNotes.length}
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
              className="w-5 h-5"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Save
          </button>
        </div>
      </form>
      <ul className="space-y-4 p-4">{[...getNoteElements(allNotes)]}</ul>
    </div>
  )
}

function Note({ note }: { note: Note }) {
  return (
    <div className="p-4 rounded-lg bg-slate-800 space-y-4 hover:brightness-105">
      <p className="whitespace-pre-wrap">{note.content.trim()}</p>
      <div className="flex items-center justify-between text-rose-400">
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
            className="w-5 h-5"
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
          className="text-slate-400"
        >
          {note.createdAt.toLocaleString()}
        </time>
      </div>
    </div>
  )
}
