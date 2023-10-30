import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  server: {
    TURSO_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },
})
