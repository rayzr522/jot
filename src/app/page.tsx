import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function Home() {
  const { userId } = auth()
  if (userId) return redirect("/notes")
  return (
    <main className="min-h-screen space-y-4 p-24">
      <h1 className="text-2xl font-semibold text-emerald-400">
        Welcome to Jot
      </h1>
      <p>
        Your one-stop shop to jot down any thoughts you have and build a better
        understanding of your brain.
      </p>
    </main>
  )
}
