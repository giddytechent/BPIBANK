<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Workspace review

The admin route at [admin/page.tsx](C:/Users/HomePC/Documents/Bank/mybank/src/app/(admin)/admin/page.tsx) is currently a client-side accounts list. The database already models users, accounts, and transactions, including transaction amounts, timestamps, and `PENDING`, `COMPLETED`, and `FAILED` statuses.

The main gap is authorization: the tRPC layer has a signed-in-user check, but no admin role or admin-only procedure. Also, `user.getAll` is available to any signed-in user, and `user.getById` is public. Those need to be addressed before building administrative controls.

## Suggested admin UI

Make `/admin` a user and account overview, with navigation to separate screens:

- **Users:** searchable and paginated table with name, email, account count, balance summary, and created date.
- **User details:** editable profile fields and linked accounts.
- **Account details:** balance, owner, recent transactions, and an “Add money” action.
- **Transactions:** searchable table with type, account/user, amount, date and time, and status. An edit form can update amount, timestamp, and status.

Use confirmation dialogs for money and account deletion actions, plus success/error feedback after each save.

## Implementation plan

1. **Add real admin authorization.** Persist a role on `User`, include it in the session, and create an admin-only tRPC procedure. Protect the admin route on the server as well as every admin query and mutation; hiding links in the UI is not access control.
2. **Add admin read APIs.** Return paginated users and transactions with only the fields the UI needs. Remove public access to user records and restrict `getAll` to admins.
3. **Add user and account actions.** Admin-only profile update, deposit, and account deletion mutations. Deletion should clearly explain its impact: the current schema cascades account deletion when a user is deleted, while transactions reference accounts without cascade deletion, so deletion behavior needs a deliberate policy.
4. **Add transaction editing.** Support amount, date/time, and status updates. Since transactions currently have no audit history, record who made each change and the prior/new values. Also define how edits affect balances: changing a transaction record alone would make the ledger disagree with account balances.
5. **Build the UI and connect mutations.** Add admin layouts and detail routes, then connect forms and tables with loading, empty, error, and confirmation states.
6. **Verify authorization and balance behavior.** Check that regular users cannot call admin APIs and that deposits, edits, and deletions leave transaction records and balances consistent.

I reviewed the installed Next.js docs before planning route work, as required by the repository’s `AGENTS.md`. I haven’t changed any files.