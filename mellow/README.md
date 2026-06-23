# 🧠 Mellow (ReelVault) - High-Fidelity Media Downloader

Mellow (ReelVault) is an enterprise-grade full-stack web application designed for downloading Instagram Reels, post images, and carousel updates in high resolution.

Featuring a next-gen dark-mode-first glassmorphic user interface built using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (Authentication, PostgreSQL Database, RLS)**.

---

## 🚀 Core Features

1. **🔒 Secure User Authentication**: Email/Password and Google OAuth integration, with route-guarded panels for user dashboards and admin actions.
2. **⚡ High-Speed Downloader**: Instant client-side validation of Instagram URLs, multi-stage loading animation, and layout preview supporting video playbacks and carousel navigation.
3. **📊 Analytics Dashboard**: User metrics widgets summarizing total downloads, weekly actions, and most-downloaded formats.
4. **💖 Favorites Manager**: Save downloads into collections and toggle bookmark statuses.
5. **🛡️ Admin Moderation Board**: View overall signups, query logs, and ban/unban user nodes.
6. **🌌 Premium Glassmorphism UI**: Dynamic particle background, glowing neon highlights, light/dark modes, and smooth Framer Motion layout transitions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphic panels, glowing overlays, custom CSS theme imports)
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (Email/Password & Google Login)
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## ⚙️ Installation & Local Setup

### Step 1: Clone and Navigate
Ensure you are inside the `mellow` directory:
```bash
cd mellow
```

### Step 2: Install Node Packages
Initialize dependencies:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file by copying `.env.example`:
```bash
cp .env.example .env.local
```
Fill in the credentials from your Supabase Project Settings:
- `NEXT_PUBLIC_SUPABASE_URL`: API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Secret Key (required for Admin actions like banning users and bypassing RLS).

### Step 4: Configure Supabase Database
1. Go to your **Supabase Dashboard > SQL Editor**.
2. Click **New Query**.
3. Copy the contents of the [`supabase/mellow_schema.sql`](./supabase/mellow_schema.sql) file and paste it into the query editor.
4. Click **Run** to set up the `users`, `downloads`, and `favorites` tables, create indexes, register Row Level Security (RLS) policies, and initialize the automated user syncing trigger.

### Step 5: Start Local Server
Run the local next development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🗂️ Project Structure

```text
mellow/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global layout wrapper
│   │   ├── page.tsx              # Home landing page with FAQ & Hero downloader
│   │   ├── login/                # Signup & Login page
│   │   ├── dashboard/            # User space (history list & metrics cards)
│   │   │   ├── page.tsx          
│   │   │   ├── favorites/        # Bookmarked downloads
│   │   │   └── profile/          # Profile credentials updater
│   │   ├── admin/                # Admin Panel (statistics & ban controls)
│   │   └── api/
│   │       ├── download/         # Instagram link extractor api
│   │       └── admin/            # Admin actions router
│   ├── components/
│   │   ├── Navbar.tsx            # Header with glassmorphism layout
│   │   ├── Footer.tsx            # Footer
│   │   ├── DownloaderForm.tsx    # Media fetcher container with slider previews
│   │   ├── DownloadHistory.tsx   # History data table
│   │   ├── AnalyticsCards.tsx    # Dashboard statistics summary
│   │   └── ParticleBackground.tsx # Glowing canvas grid backdrop
│   ├── context/
│   │   ├── AuthContext.tsx       # Supabase session provider
│   │   └── ThemeContext.tsx      # Dark/Light theme manager
│   ├── lib/
│   │   └── supabase.ts           # Supabase instantiations
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── styles/
│       └── globals.css           # Tailwind style declarations
├── supabase/
│   └── mellow_schema.sql         # Database schema setup migration
└── README.md                     # Documentation
```

---

## 🚀 Deployment Instructions (Vercel)

1. Sign up/Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **New Project** and connect your GitHub repository containing the `mellow` project.
3. Set the **Root Directory** to `mellow`.
4. In the **Environment Variables** configuration section, copy over the three environment keys defined in your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Vercel will compile the Next.js bundle and host the application on a secure public domain.
