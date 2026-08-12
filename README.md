# Reachly 🚀

<div align="center">

[![codecov](https://codecov.io/gh/mrizalbasri/reachly/graph/badge.svg)](https://codecov.io/gh/mrizalbasri/reachly)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Framework](https://img.shields.io/badge/Framework-TanStack%20Start-FF4154.svg)](https://tanstack.com/start)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38BDF8.svg)](https://tailwindcss.com/)
[![ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F.svg)](https://orm.drizzle.team/)
[![Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Platform Manajemen Kerja Sama Influencer/KOL (Key Opinion Leaders) & Campaign ROI Analytics**

[Fitur Utama](#-fitur-utama) • [Arsitektur Sistem](#-arsitektur-sistem) • [Struktur Proyek](#-struktur-proyek) • [Skema Database](#-skema-database-drizzle) • [Panduan Penggunaan](#-panduan-penggunaan-lokal) • [Dokumentasi](#-dokumentasi-internal)

</div>

---

## 📖 Ringkasan Produk

**Reachly** adalah aplikasi web *end-to-end* yang memusatkan seluruh siklus kerja sama *influencer marketing* bagi brand internal maupun agency. 

Dengan **Reachly**, tim marketing dapat beralih dari proses manual (*spreadsheet*, *chat Messenger/WhatsApp* yang tercecer, dan *scrolling* media sosial) menuju alur kerja digital yang terstruktur — dari pencarian kandidat KOL, pelacakan status negosiasi lewat papan Kanban, alokasi anggaran kampanye *real-time*, hingga kalkulasi efisiensi **ROI (CPM, CPE, CPV)**.

---

## 🌟 Masalah & Solusi

| Masalah Operasional | Solusi Reachly |
| --- | --- |
| 🔍 **Riset KOL lambat & manual** | Database terpusat dengan filter cepat berdasarkan *Niche*, *Followers*, *Engagement Rate*, dan *Rate Card IDR*. |
| 📋 **Status negosiasi tercecer** | Papan **Kanban Pipeline** interaktif (*drag-and-drop*) dari Prospek hingga Selesai. |
| 💰 **Sulit memantau sisa anggaran** | Tracker anggaran kampanye *real-time* dengan indikator visual *over-budget*. |
| 📊 **Kalkulasi ROI terpisah-pisah** | Penghitungan otomatis metrik **CPM**, **CPE**, dan **CPV** beserta papan peringkat efisiensi KOL. |
| 📄 **Pelaporan ke klien/atasan rumit** | Fitur ekspor laporan sekali klik ke format **PDF**, **Excel (.xlsx)**, dan **CSV**. |

---

## 🏗️ Arsitektur Sistem

```mermaid
graph TD
    User[Client Browser / Desktop / Mobile] -->|HTTPS Requests| Router[TanStack Router + TanStack Start]
    
    subgraph Frontend Layer
        Router --> Layout[iOS/macOS Clean Glassmorphic Theme]
        Layout --> Components[React 19 + Tailwind CSS v4 + Lucide Icons]
    end
    
    subgraph Server Layer
        Router --> Auth[Clerk Auth Middleware & Multi-Tenant Orgs]
        Router --> ServerFn[TanStack Start Server Functions]
        ServerFn --> Zod[Zod Schema Validation]
    end

    subgraph Data & Storage Layer
        ServerFn --> Drizzle[Drizzle ORM]
        Drizzle --> Database[(PostgreSQL Database)]
    end
    
    subgraph Reporting & Export
        Components --> Export[CSV / XLSX / PDF Exporters]
    end
```

---

## ✨ Fitur Utama

### 1. 📇 Direktori KOL & Database Terpusat
* Katalog lengkap KOL (Instagram, TikTok, YouTube) dengan metrik *Followers*, *Engagement Rate (E.R)*, *Niche*, dan kontak.
* Filter cepat berdasarkan tier *Followers* (Nano, Micro, Mid-Tier, Macro, Mega), rentang harga (*Rate Card*), dan kata kunci.
* Riwayat kerja sama kampanye terdahulu per KOL.

### 2. 🎛️ Pipeline Prospek (Kanban Board)
* Tracking alur negosiasi 6 tahap: **Prospek $\rightarrow$ Outreach $\rightarrow$ Nego $\rightarrow$ Deal $\rightarrow$ Posting $\rightarrow$ Selesai**.
* Fitur *Drag-and-Drop* interaktif untuk pemindahan status KOL secara cepat.
* Catatan/notes khusus per KOL untuk menyimpan histori negosiasi terakhir.

### 3. 🎯 Manajemen Kampanye & Alokasi Anggaran
* Pembuatan kampanye baru dengan target periode (*Start/End Date*) dan total anggaran.
* Alokasi KOL ke kampanye tertentu dengan budget individual.
* Penghitungan sisa anggaran secara *real-time*.

### 4. 📈 Analisis Performa & Kalkulator ROI
* Input data performa pasca-posting (Views, Likes, Comments, Shares, Konversi).
* Kalkulasi otomatis metrik efisiensi biaya:
  * **CPM** *(Cost per Mille / 1.000 Tayangan)* $= \frac{\text{Budget}}{\text{Views}} \times 1.000$
  * **CPE** *(Cost per Engagement)* $= \frac{\text{Budget}}{\text{Likes + Comments + Shares}}$
  * **CPV** *(Cost per View)* $= \frac{\text{Budget}}{\text{Views}}$
* Papan peringkat KOL paling efisien berdasarkan data faktual.

### 5. 📑 Ekspor Laporan Lanjutan
* Ekspor data direktori, campaign, dan kalkulasi performa ke format **Excel (.xlsx)**, **CSV**, serta cetak dokumen **PDF**.

---

## 🛠️ Teknologi Utama (Tech Stack)

| Layer | Teknologi | Kegunaan |
| --- | --- | --- |
| **Core Framework** | [TanStack Start](https://tanstack.com/start) & [React 19](https://react.dev/) | Fullstack React SSR framework berbasis Vite + Nitro |
| **Routing** | [TanStack Router](https://tanstack.com/router) | Type-safe file-based routing |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Lucide React | Custom iOS/macOS clean glassmorphism design system |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team/) & PostgreSQL (`pg`) | Schema declaration type-safe & query builder |
| **Autentikasi** | [Clerk](https://clerk.com/) (`@clerk/tanstack-react-start`) | Session management, auth middleware, & multi-tenant orgs |
| **Form Validation** | [Zod](https://zod.dev/) | Validasi skema input KOL, Campaign, & Performance |
| **Testing & CI/CD** | [Vitest](https://vitest.dev/) & [Codecov](https://codecov.io/) | Unit testing dengan 100% coverage pada fungsi utilitas |

---

## 📁 Struktur Proyek

```
reachly/
├── .github/
│   └── workflows/
│       └── codecov.yml          # GitHub Actions CI workflow dengan Vitest & Codecov
├── docs/                        # Obsidian Vault Hub & Dokumentasi Teknis
│   ├── Index.md                 # Hub Navigasi Utama
│   ├── Prd.md                   # Product Requirements Document & Roadmap
│   ├── Architecture.md          # Spesifikasi Arsitektur & Skema Database
│   └── Design.md                # Design System & Token Warna iOS/macOS
├── src/
│   ├── components/              # Reusable Component Library
│   │   ├── landing/             # Komponen Animasi & Section Landing Page
│   │   ├── layout/              # Collapsible Sidebar & Top Header
│   │   ├── pipeline/            # Kanban Board Components
│   │   └── ui/                  # Cards, Buttons, Dialogs, Toasts, Badges
│   ├── db/                      # Skema Database & Instansi Drizzle
│   │   ├── index.ts             # Koneksi Database Client
│   │   └── schema.ts            # Skema Tabel & Relasi Drizzle PostgreSQL
│   ├── routes/                  # File-based Routes (TanStack Router)
│   │   ├── __root.tsx           # Shell Document Root
│   │   ├── index.tsx            # Halaman Landing Page
│   │   ├── dashboard/           # Dasbor Ringkasan
│   │   ├── kol-directory/       # Direktori & Katalog KOL
│   │   ├── pipeline/            # Kanban Board Pipeline
│   │   ├── campaigns/           # Manajemen Kampanye & Anggaran
│   │   └── analytics/           # Analisis Performa & ROI
│   ├── server/                  # TanStack Start Server Functions
│   │   ├── analytics.ts
│   │   ├── campaigns.ts
│   │   ├── kol.ts
│   │   └── pipeline.ts
│   ├── tests/                   # Vitest Suite (Unit Tests)
│   │   ├── filter.test.ts
│   │   ├── roi.test.ts
│   │   └── validations.test.ts
│   └── utils/                   # Formatters & Zod Validations
├── drizzle.config.ts            # Konfigurasi Migrasi Drizzle Kit
├── vite.config.ts               # Konfigurasi Vite & Plugins
├── vitest.config.ts             # Konfigurasi Testing Vitest & V8 Coverage
└── package.json
```

---

## 🗄️ Skema Database (Drizzle)

```typescript
// src/db/schema.ts
export const pipelineStatusEnum = pgEnum("pipeline_status", [
  "prospek", "outreach", "nego", "deal", "posting", "selesai",
]);

export const kols = pgTable("kols", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // Instagram / TikTok / YouTube
  username: text("username"),
  niche: text("niche"),
  followers: integer("followers"),
  engagementRate: numeric("engagement_rate"),
  ratePerPost: numeric("rate_per_post"), // IDR
  contact: text("contact"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  totalBudget: numeric("total_budget"), // IDR
});

export const campaignKols = pgTable("campaign_kols", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => campaigns.id).notNull(),
  kolId: uuid("kol_id").references(() => kols.id).notNull(),
  allocatedBudget: numeric("allocated_budget"),
  status: pipelineStatusEnum("status").default("prospek"),
});
```

---

## 🚀 Panduan Penggunaan Lokal

### 1. Prasyarat
* Node.js v20+ atau v24+
* pnpm v10+

### 2. Instalasi & Setup Environment
Cloning repository dan install dependensi:

```bash
git clone git@github.com:mrizalbasri/reachly.git
cd reachly
pnpm install
```

Salin file sampel environment dan sesuaikan kredensial:

```bash
cp .env.example .env.local
```

Isi kredensial berikut di `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reachly_db"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 3. Menjalankan Server Pengembang

```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### 4. Menjalankan Unit Testing & Coverage Report

```bash
# Jalankan unit test
pnpm test

# Jalankan test dengan pelaporan coverage
pnpm test -- --coverage
```

---

## 📚 Dokumentasi Internal

Seluruh dokumen spesifikasi arsitektur dan panduan desain tersimpan dalam vault markdown di folder `docs/`:

* 📌 [Vault Index](file:///d:/Coding/reachly/docs/Index.md) — Peta navigasi dokumentasi internal
* 📜 [Product Requirements Document (PRD)](file:///d:/Coding/reachly/docs/Prd.md) — Detail roadmap & fitur
* 🏗️ [Architecture Map](file:///d:/Coding/reachly/docs/Architecture.md) — Arsitektur teknis & skema database
* 🎨 [Design System Spec](file:///d:/Coding/reachly/docs/Design.md) — Token warna & panduan UX iOS/macOS

---

## 📄 Lisensi

Hak Cipta © 2026 M. Rizal Basri. Proyek ini dilindungi di bawah **[MIT License](LICENSE)**.
