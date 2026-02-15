# Tool for brainstorming CRC cards

This is a SvelteKit application for brainstorming and managing CRC (Class-Responsibility-Collaboration) cards.

## Quick Start with Docker

The easiest way to run the application is using Docker Compose.

1. Ensure you have Docker and Docker Compose installed.
2. Run the following command:
   ```bash
   docker compose up --build
   ```
3. Open your browser to `http://localhost:3000`.

## Local Development Setup

### Prerequisites
- Node.js (v20 or later recommended)
- MySQL Database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=crc_cards
VITE_PUBLIC_URL=http://localhost:5173
```

### Database Setup

Use the provided initialization script to set up your MySQL database:

```bash
mysql -u your_db_user -p < database/init.sql
```

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

## Architecture Notes
- **Dockerized:** The application and database are containerized for easy deployment and local development.
- **Repository Pattern:** All database access is abstracted through repositories located in `src/lib/server/repositories/`.
- **API Routes:** Frontend components communicate with the database via server-side API routes in `src/routes/api/`.
- **Authentication:** Authentication is handled via external redirect with JWT token processing in `src/lib/login.js`.
- **Real-time:** Real-time updates (previously via Supabase) are currently disabled.
