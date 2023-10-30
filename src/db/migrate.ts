import "./local-env"

import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "."

async function main() {
  console.log("migrating")
  await migrate(db, { migrationsFolder: "./migrations" })
  console.log("done")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
