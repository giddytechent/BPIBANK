<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Setup this admin page and route. 
1. Route the page and give it permission to "johndoe123@gmail.com" in the db as admin. 
2. The admin should be able to edit users (create, read, update and delete users), edit transaction history (edit transacation date and time, amount and description), Top up acoount balance and able to edit transaction state like ( completed, pending and failed during transfer). 
3Randomly stimulate transfer delay  (from 30sec to 90sec) during transfer process.