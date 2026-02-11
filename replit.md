# Replit.md

## Overview

This is a **Secure Media Vault** web application ("Vault.io") that allows users to store and manage encrypted photos and videos. It features a dark-themed, security-focused UI with a landing page, separate photo and video vault pages, and Replit-based authentication. The app is a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router) with three main routes: `/` (Home), `/photos`, `/videos`
- **State Management**: TanStack React Query for server state (data fetching, caching, mutations)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Animations**: Framer Motion for page transitions and hover effects
- **Forms**: React Hook Form with Zod resolvers for validation
- **Styling**: Tailwind CSS with CSS variables for theming; dark theme by default with a "vault/security" aesthetic using deep purples and near-black backgrounds
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (monospace) loaded via Google Fonts
- **Build Tool**: Vite with React plugin, path aliases (`@/` → `client/src/`, `@shared/` → `shared/`)

### Backend
- **Framework**: Express.js running on Node.js with TypeScript (tsx for dev, esbuild for production)
- **API Structure**: RESTful API under `/api/` prefix. Routes are defined in `server/routes.ts` and typed route contracts live in `shared/routes.ts` using Zod schemas
- **Current Endpoints**:
  - `GET /api/media` — List all media items
  - `POST /api/media` — Create a new media item
  - `GET /api/auth/user` — Get authenticated user (Replit Auth)
- **Storage Pattern**: Repository/storage pattern (`IStorage` interface in `server/storage.ts`) with `DatabaseStorage` implementation using Drizzle ORM

### Shared Code
- **Location**: `shared/` directory contains schema definitions and route contracts shared between frontend and backend
- **Schema**: Drizzle ORM schemas defined in `shared/schema.ts` and `shared/models/auth.ts`
- **Route Contracts**: `shared/routes.ts` defines typed API route metadata (path, method, input/output schemas) used by both client hooks and server handlers

### Database
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod conversion
- **Schema Push**: `npm run db:push` uses `drizzle-kit push` to sync schema to database
- **Tables**:
  - `media` — id (serial), type (text: 'photo'/'video'), title (text), url (text), thumbnailUrl (text, nullable), createdAt (timestamp)
  - `sessions` — sid (varchar PK), sess (jsonb), expire (timestamp) — required for Replit Auth
  - `users` — id (varchar PK), email, firstName, lastName, profileImageUrl, createdAt, updatedAt — required for Replit Auth

### Authentication
- **Provider**: Replit Auth via OpenID Connect (OIDC)
- **Session Storage**: PostgreSQL-backed sessions using `connect-pg-simple`
- **Implementation**: Located in `server/replit_integrations/auth/` with Passport.js strategy
- **Client Hook**: `useAuth()` hook in `client/src/hooks/use-auth.ts` handles user state and login/logout flows
- **Flow**: Unauthenticated users are redirected to `/api/login`; session persists for 1 week

### Build & Development
- **Dev**: `npm run dev` — runs Express server with Vite dev middleware (HMR enabled)
- **Build**: `npm run build` — Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — serves the built application
- **Type Checking**: `npm run check` — runs TypeScript compiler in noEmit mode

### Key Design Decisions
1. **Shared route contracts** — API routes are defined once in `shared/routes.ts` with Zod schemas, ensuring type safety across the full stack
2. **Storage interface pattern** — The `IStorage` interface allows swapping database implementations without changing route handlers
3. **CSS variables for theming** — All colors are defined as HSL CSS variables, making theme changes easy
4. **Monorepo-style structure** — `client/`, `server/`, and `shared/` directories in one repo with path aliases for clean imports

## External Dependencies

### Required Services
- **PostgreSQL Database**: Connected via `DATABASE_URL` environment variable. Required for media storage, user sessions, and authentication
- **Replit Auth (OIDC)**: Uses `ISSUER_URL` (defaults to `https://replit.com/oidc`) and `REPL_ID` for OpenID Connect authentication

### Required Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (mandatory)
- `SESSION_SECRET` — Secret for express-session (mandatory for auth)
- `REPL_ID` — Replit environment identifier (set automatically on Replit)
- `ISSUER_URL` — OIDC issuer URL (optional, defaults to Replit's)

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI), Tailwind CSS, React Hook Form, Zod
- **Backend**: Express, Drizzle ORM, Passport.js, express-session, connect-pg-simple, pg
- **Shared**: Zod, drizzle-zod
- **Build**: Vite, esbuild, tsx