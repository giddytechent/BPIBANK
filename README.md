# BPI Bank Learning Project

A full-stack banking interface built to practise modern web development patterns: authentication, protected routes, database-backed account data, transactions, responsive UI, and accessible form handling.

## Learning-only notice

This project is a **portfolio and learning exercise only**. It is not affiliated with, endorsed by, or operated by Bank of the Philippine Islands (BPI) or any other financial institution.

It is not a real banking service. Do not use real personal, financial, card, account, or credential information. The application does not provide financial services, process real payments, or support real money transfers.

## Features

- Account registration and credentials-based sign-in
- Protected dashboard routes and session sign-out
- Account overview, balances, transaction history, and transfers
- Account, card, profile, and transaction-PIN management screens
- Responsive dashboard navigation for desktop and mobile
- Marketing and auth pages using a shared BPI-inspired visual system
- PostgreSQL persistence through Prisma ORM

## Tech stack

- Next.js 16 with React 19 and TypeScript
- Tailwind CSS 4
- NextAuth credentials authentication
- tRPC and TanStack React Query
- Prisma ORM with PostgreSQL
- React Hook Form, Zod, and Lucide icons

## Getting started

### Prerequisites

- Node.js 20 or later
- A PostgreSQL database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root with your local values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="replace-with-a-long-random-secret"
```

`NEXTAUTH_SECRET` may be used instead of `AUTH_SECRET` if preferred.

### 3. Generate the Prisma client and apply migrations

```bash
npm run db:generate
npm run db:deploy
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run db:generate` | Generate the Prisma client. |
| `npm run db:deploy` | Apply Prisma migrations. |
| `npm run build` | Generate Prisma artifacts, apply migrations, and create a production build. |
| `npm run start` | Start the production server after a successful build. |

## Project structure

```text
src/
  app/                 # App Router routes, layouts, API routes, and page UI
  components/          # Shared marketing, auth, and dashboard components
  server/trpc/         # tRPC routers and protected procedures
  lib/                 # Prisma client and server utilities
  utils/               # Formatting and navigation helpers
prisma/                # Database schema and migrations
```

## Security note

Authentication, password hashing, route protection, and transaction flows are included to support learning. They have not been independently security audited and must not be treated as production-ready financial software.

Before deploying any application that handles real users or sensitive data, conduct a security review, use a dedicated secrets-management process, comply with applicable laws and regulations, and implement appropriate monitoring, recovery, and incident-response controls.
