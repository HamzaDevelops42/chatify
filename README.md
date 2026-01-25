# Chat Application (Next.js + Supabase)

This is a real-time chat application built with **Next.js** and
**Supabase** (Auth, Database, Realtime).

------------------------------------------------------------------------

##  Getting Started

Follow these steps to run the project locally.

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/HamzaDevelops42/chatify
cd chatify
```

------------------------------------------------------------------------

### 2️⃣ Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

### 3️⃣ Setup environment variables

Create a `.env.local` file in the root of the project and add the
following variables:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

------------------------------------------------------------------------

### 4️⃣ Run the development server

``` bash
npm run dev
```

The app should now be running at:

    http://localhost:3000

------------------------------------------------------------------------

## Supabase Project Recreation

If you want to recreate the Supabase project (database schema, enums,
triggers, functions, and RLS policies):

**See [`supabase.md`](./supabase.md)**


Follow the steps in `supabase.md` **in order** to fully recreate the
backend.

------------------------------------------------------------------------

## Tech Stack

-   Next.js
-   TypeScript
-   Supabase
    -   Auth
    -   Postgres
    -   Realtime
-   React Hooks

------------------------------------------------------------------------

## 📄 License

MIT
