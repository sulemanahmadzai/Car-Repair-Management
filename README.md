# My SaaS Starter Project

This is a customized SaaS application starter template using **Next.js** with support for authentication, team management, and a dashboard for logged-in users.

**Based on**: [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) (Stripe functionality currently disabled)

## Features

- 🚀 Marketing landing page (`/`) with animated Terminal element
- 👥 Dashboard pages with CRUD operations on users/teams
- 🔐 Basic RBAC with Owner and Member roles
- 🔑 Email/password authentication with JWTs stored to cookies
- 🛡️ Global middleware to protect logged-in routes
- 📊 Activity logging system for user events
- 💳 **Stripe integration ready** (currently commented out for future use)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Neon/Vercel recommended for production)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Payments**: Stripe (ready to enable when needed)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local Docker or remote)

### Installation

```bash
# Clone your repository
git clone <your-repo-url>
cd saas-starter
pnpm install
```

### Environment Setup

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

This will guide you through:

1. **Database Selection**: Choose between:
   - `L` - Local Postgres with Docker (development)
   - `N` - Neon Database (recommended for production)
   - `V` - Vercel Postgres
   - `R` - Other remote Postgres
2. **AUTH_SECRET Generation**: Automatically generated

### Database Setup

Run the database migrations and seed initial data:

```bash
pnpm db:migrate
pnpm db:seed
```

This creates a default user and team:

- **User**: `test@test.com`
- **Password**: `admin123`

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Production Deployment

### Recommended: Vercel + Neon

1. **Create Neon Database**:

   - Go to [Neon Console](https://console.neon.tech/app/projects)
   - Create a new project
   - Copy the connection string

2. **Deploy to Vercel**:

   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main

   # Deploy with Vercel
   npx vercel --prod
   ```

3. **Set Environment Variables in Vercel**:

   - `POSTGRES_URL`: Your Neon connection string
   - `BASE_URL`: Your production domain (e.g., `https://yourapp.vercel.app`)
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`

4. **Run Migrations on Production**:
   ```bash
   # After first deployment
   vercel env pull .env.production
   POSTGRES_URL="your-production-url" pnpm db:migrate
   ```

## Enabling Stripe Payments (Future)

When you're ready to add payment functionality:

1. **Uncomment Stripe Code**:

   - `lib/payments/stripe.ts`
   - `app/api/stripe/*/route.ts`
   - Database schema Stripe fields in `lib/db/schema.ts`
   - Query functions in `lib/db/queries.ts`

2. **Install Stripe CLI**:

   ```bash
   # Follow: https://docs.stripe.com/stripe-cli
   stripe login
   ```

3. **Add Environment Variables**:

   ```bash
   STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Generate New Migration**:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:setup     # Interactive database setup
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with initial data
pnpm db:studio    # Open Drizzle Studio
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (login)/          # Authentication routes
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/
│   ├── auth/            # Authentication logic
│   ├── db/              # Database schema & queries
│   └── payments/        # Stripe integration (commented out)
└── ...
```

## Database Schema

### Core Tables

- **users**: User accounts and authentication
- **teams**: Team/organization management
- **team_members**: User-team relationships
- **activity_logs**: User activity tracking
- **invitations**: Team invitation management

### Stripe Fields (Ready for Future Use)

When enabled, teams table will include:

- `stripe_customer_id`
- `stripe_subscription_id`
- `stripe_product_id`
- `plan_name`
- `subscription_status`

## Contributing

This is your personal project! Feel free to:

- Add new features
- Customize the UI/UX
- Integrate additional services
- Modify the authentication flow

## License

This project is private and for your own use. The original template was MIT licensed.

---

**Next Steps**: Start building your SaaS features! The authentication, database, and basic structure are ready to go.
