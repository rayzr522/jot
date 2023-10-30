import { button } from "@/styles"
import { ClerkProvider, SignInButton, UserButton, auth } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Cabin } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import favicon from "../../public/favicon.png"
import "./globals.css"

const font = Cabin({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "jot",
  manifest: "/manifest.json",
  description:
    "jot down your thoughts & discover powerful insights into your mind",
  icons: [
    { rel: "icon", url: "/favicon.png" },
    { rel: "apple-touch-icon", url: "/icons/192.png" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${font.className} min-h-screen bg-slate-900`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

function Navbar() {
  const { userId } = auth()
  return (
    <nav className="flex w-full items-center border-b border-slate-700 px-6 py-4">
      <Link href="/" className="text-xl font-medium text-emerald-400">
        <Image src={favicon} alt="" className="mr-1 inline" height={32} />
        jot
      </Link>
      <div className="mx-auto h-12" />
      {userId ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton>
          <button className={button()}>Sign In</button>
        </SignInButton>
      )}
    </nav>
  )
}
