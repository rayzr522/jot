import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) return redirect("/notes");
  return (
    <main className="min-h-screen p-24 space-y-4">
      <h1 className="text-emerald-400 text-2xl font-semibold">
        Welcome to Jot
      </h1>
      <p>
        Your one-stop shop to jot down any thoughts you have and build a better
        understanding of your brain.
      </p>
    </main>
  );
}
