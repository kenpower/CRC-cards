# Tool for brainstorming CRC cards

This is a SvelteKit application for brainstorming and managing CRC (Class-Responsibility-Collaboration) cards.

## Local Development Setup

### Prerequisites
- Node.js (v18 or later recommended)
- A Supabase project

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PUBLIC_URL=http://localhost:5173
```

*Note: `VITE_` prefixed variables are required for the client-side Realtime subscriptions, while the unprefixed ones are used by the server-side API.*

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`.

## Supabase Configuration

The project uses Supabase for database and realtime functionality.

### Initial Setup
```bash
npx supabase login
npx supabase init
npx supabase link
```

### Database Migrations
To create and apply migrations:
```bash
npx supabase migration new your_migration_name
npx supabase db push
```

## Architecture Notes
- All CRUD operations are performed via server-side API routes in `src/routes/api/`.
- Client-side Supabase client is used only for Realtime Postgres changes.
- Authentication is handled via external redirect with JWT token processing in `src/lib/login.js`.
