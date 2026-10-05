# 🎓 StudPro &mdash; IEEE Young Professionals Sri Lanka

[![Next.js](https://img.shields.io/badge/Next.js-16.2.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![UploadThing](https://img.shields.io/badge/UploadThing-Storage-red?style=flat-square&logo=uploadthing)](https://uploadthing.com/)

**StudPro** is the flagship student-to-professional transition initiative organized by **IEEE Young Professionals Sri Lanka (YPSL)**. This platform powers the public-facing promotional website alongside a **Serverless Admin Dashboard** designed for managing annual editions, technical sessions, guest speakers, corporate partnerships, executive team directories, and RBAC access control.

---

## 🌟 Key Features

### 🌐 Public Website (`/`)
- **Dynamic Homepage**: High-performance landing page featuring GSAP scroll triggers, smooth Lenis scrolling, dynamic event highlights, and corporate partner carousels.
- **Events & Series Catalog (`/events`)**: Category-filtered timelines for *Workshops*, *CV Clinics*, *Industry Visits*, *Career Fairs*, and *Webinars*.
- **Event Detail Pages (`/events/[category]/[title]`)**: Dedicated showcase pages with guest speaker profiles, multi-image galleries, agenda breakdowns, and venue info.
- **Corporate Partners Directory (`/partners`)**: Filterable sponsor directories categorized by annual cycle and sponsorship tier (*Platinum, Gold, Silver, Bronze, Partner*).
- **Executive Team Showcase (`/about-us`)**: Organizing Committee showcase highlighting student leads and YPSL leadership for the active StudPro edition.
- **Incremental Static Regeneration (ISR)**: 1-hour automatic page caching (`revalidate = 3600`) with on-demand instant cache revalidation whenever content is modified via the dashboard.

### 🔐 Serverless Admin Dashboard (`/admin`)
- **Edge Route Protection & RBAC**: Guarded at the edge (`src/proxy.ts`) using cryptographic JWT metadata verification (`super_admin` vs `editor`).
- **Live Analytics Overview**: KPI metric cards, event track distribution bars, recent schedule feeds, and real-time database connection diagnostics.
- **Events & Speakers Module (`/admin/events`)**:
  - Full CRUD operations for technical sessions, topics, dates, and venues.
  - Optional Guest Speaker linkage (*Name, Title, Company/Affiliation*).
  - Drag-and-drop event photo upload via **UploadThing** with interactive thumbnail galleries.
- **Corporate Partners Module (`/admin/partners`)**:
  - Master Company Registry management with logo uploads.
  - Annual cycle tier assignments and quick inline tier adjustments.
- **Executive Team Module (`/admin/team`)**:
  - Organizing Committee roster management with photo avatars, roles, emails, phone numbers, and LinkedIn profiles.
  - Automatic association with the active edition (`StudPro 9.0`).
- **Annual Editions Module (`/admin/cycles`)**:
  - Create new cycles (e.g. `StudPro 10.0 (2027)`).
  - Single-click platform default cycle switching.
- **Administrator Access Control (`/admin/admins`)**:
  - In-app Super Admin provisioning panel with secure password generation.
  - Role management and access revocation with anti-lockout protection.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) (`@supabase/ssr` + RLS)
- **Asset Storage**: [UploadThing](https://uploadthing.com/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **Animations & Scrolling**: [GSAP](https://gsap.com/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis](https://lenis.darkroom.engineering/)

---

## 🗄️ Relational Database Schema

```
┌──────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ studpro_cycles   │───<   │  event_series   │───<   │     events      │
├──────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)    │       │ id (PK, UUID)   │       │ id (PK, UUID)   │
│ version (TEXT)   │       │ cycle_id (FK)   │       │ cycle_id (FK)   │
│ year (INT)       │       │ title (TEXT)    │       │ series_id (FK)  │
│ is_active (BOOL) │       └─────────────────┘       │ category (ENUM) │
└─────────┬────────┘                                 │ title (TEXT)    │
          │                                          └────────┬────────┘
          ├──────────────────────────┐                        │ 1:N
          ▼ 1:N                      ▼ 1:N                    ▼
┌──────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  cycle_partners  │       │  team_members   │       │    speakers     │
├──────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)    │       │ id (PK, UUID)   │       │ id (PK, UUID)   │
│ cycle_id (FK)    │       │ cycle_id (FK)   │       │ event_id (FK)   │
│ company_id (FK)  │       │ name (TEXT)     │       │ name (TEXT)     │
│ tier (ENUM)      │       │ role (TEXT)     │       │ title (TEXT)    │
└─────────┬────────┘       │ email (TEXT)    │       │ company (TEXT)  │
          │                │ linkedin_url    │       └─────────────────┘
          ▼                │ image_url       │
┌──────────────────┐       └─────────────────┘
│   companies      │
├──────────────────┤
│ id (PK, TEXT)    │
│ name (TEXT)      │
│ logo_url (TEXT)  │
│ web_link (TEXT)  │
└──────────────────┘
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or later
- **npm** or **pnpm**
- **Supabase Project**: (Free tier at [supabase.com](https://supabase.com))
- **UploadThing Account**: (Free token at [uploadthing.com](https://uploadthing.com))

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/Manusha-Sathsara/studpro.ieeeyp.lk.git
cd studpro.ieeeyp.lk
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Server-Side Secret Key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# UploadThing API Token
UPLOADTHING_TOKEN=eyJhcGlLZXkiOi...

# Optional Direct PostgreSQL URI for migration scripts
DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

### 4. Initialize Database & Seed Data
Execute the SQL migration schema in the Supabase SQL Editor from [`supabase/migrations/01_init_studpro_schema.sql`](supabase/migrations/01_init_studpro_schema.sql).

Then run the data seeding and admin provisioning utility:

```bash
# Seed all 114 events, 72 partners, and 16 team members
npx tsx scripts/seed-supabase.ts

# Provision a Super Admin user
npm run create-admin
```

### 5. Start Local Development Server
```bash
npm run dev
```
- Public Website: **[http://localhost:3000](http://localhost:3000)**
- Admin Dashboard: **[http://localhost:3000/admin](http://localhost:3000/admin)**
- Admin Login Portal: **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**

---

## 📂 Project Directory Structure

```
studpro.ieeeyp.lk/
├── public/
│   ├── images/
│   │   ├── events/       # Event photos and promotional banners
│   │   ├── hero/         # Homepage visual elements
│   │   ├── partners/     # Corporate partner logo assets
│   │   └── team/         # Organizing committee member headshots
├── scripts/
│   ├── clean-data.ts     # Database sanitization & cycle configuration
│   ├── create-admin.ts   # CLI admin account provisioning utility
│   ├── fix-rls.js        # PostgreSQL RLS policy verification
│   └── seed-supabase.ts  # Static datasets to PostgreSQL migration script
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── admins/    # Admin user management & RBAC panel
│   │   │   │   ├── cycles/    # Annual cycles & edition manager
│   │   │   │   ├── events/    # Events & talks CRUD
│   │   │   │   ├── login/     # Admin authentication portal
│   │   │   │   ├── partners/  # Corporate partners & tier assignments
│   │   │   │   ├── team/      # Executive team directory manager
│   │   │   │   └── page.tsx   # Overview analytics dashboard
│   │   ├── about-us/          # Public About Us & Team page (ISR)
│   │   ├── actions/           # Server Actions (Events, Partners, Team, Cycles, Auth)
│   │   ├── api/
│   │   │   └── uploadthing/   # UploadThing file upload router
│   │   ├── events/            # Public Events catalog & details (ISR)
│   │   ├── partners/          # Public Corporate Partners catalog (ISR)
│   │   ├── globals.css        # Global CSS & theme tokens
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Public Homepage
│   │   └── proxy.ts           # Next.js 16 edge route guard
│   ├── components/
│   │   ├── admin/             # Modular admin layouts, modals, and managers
│   │   ├── events/            # Public event cards, carousels, and timelines
│   │   ├── home/              # Public landing page sections
│   │   ├── layout/            # Headers, Footers, and smooth scroll wrappers
│   │   ├── partners/          # Partner cards and tier tabs
│   │   └── ui/                # Reusable UI primitives (Buttons, Modals, Tabs)
│   ├── lib/
│   │   ├── data/              # Public cached data access layer (Events, Partners, Team)
│   │   ├── supabase/          # Supabase Client, Server, and Middleware helpers
│   │   └── utils.ts           # Utility helpers
│   └── types/
│       └── database.types.ts  # Auto-generated Supabase PostgreSQL TypeScript types
└── supabase/
    └── migrations/            # Version-controlled SQL migration files
```

---

## 🌐 Deploying to Vercel

1. Push your changes to GitHub:
   ```bash
   git push origin release/development
   ```
2. Link your repository in [Vercel Dashboard](https://vercel.com).
3. Under **Project Settings &rarr; Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UPLOADTHING_TOKEN`
4. Deploy! Next.js will automatically build all static pages with Incremental Static Regeneration (ISR) and serverless action handlers.

---

## 📄 License & Attribution

Developed for **IEEE Young Professionals Sri Lanka**.  
All rights reserved &copy; 2026 IEEE YP Sri Lanka.
