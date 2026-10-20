# Khairpur Dates House Commerce

Full-stack dates e-commerce application built with Next.js, TypeScript, Prisma, PostgreSQL and Tailwind CSS.

The application includes:

- Date products with pack-size variants
- Cart, wishlist and checkout
- Customer accounts and order history
- Cash on Delivery and bank-transfer support
- Inventory, promotions, coupons and reviews
- Admin dashboard
- Wholesale inquiry flow
- Khairpur Dates House content, variety and quality pages

## Requirements

Install these before starting:

- Node.js 20 or newer
- npm
- PostgreSQL
- Git

Redis and Meilisearch are optional. The application falls back to in-memory rate limiting and PostgreSQL search when they are not configured.

## Fast Windows setup

From Windows Explorer, double-click:

```text
start-local.cmd
```

Or run it from CMD:

```cmd
cd /d D:\xampp\htdocs\E-Commerce
start-local.cmd
```

On its first successful run, the launcher:

1. Installs npm dependencies
2. Checks the `.env` file
3. Pushes the Prisma schema to PostgreSQL
4. Prompts for the initial administrator account
5. Seeds the Khairpur date catalog
6. Starts the development server

After the initial setup, the same file starts the application directly. The preferred address is:

```text
http://localhost:3010
```

If port `3010` is occupied, the launcher automatically selects another available port and prints it in CMD.

## Environment configuration

If `.env` does not exist, `start-local.cmd` creates it from `.env.example` and opens it in Notepad. Configure at least:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/khairpur_dates_house"
JWT_SECRET="YOUR_RANDOM_64_CHARACTER_SECRET"
NEXT_PUBLIC_STORE_NAME="Khairpur Dates House"
NEXT_PUBLIC_CURRENCY="Rs."
```

Create a JWT secret with:

```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env`. It is excluded by `.gitignore`.

## Manual setup

Use these commands if you do not want to use the launcher:

```cmd
cd /d D:\xampp\htdocs\E-Commerce
npm install
npm run db:push
set "SEED_ADMIN_EMAIL=admin@khairpurdateshouse.com"
set "SEED_ADMIN_PASSWORD=Choose-A-Strong-Password"
npm run db:seed
npm run dev
```

The seed archives non-Khairpur products instead of deleting historical product and order records.

## Application URLs

Use the actual port printed in CMD:

- Storefront: `http://localhost:3010`
- Shop: `http://localhost:3010/shop`
- Login: `http://localhost:3010/login`
- Admin dashboard: `http://localhost:3010/admin`
- Wholesale page: `http://localhost:3010/buyers`

Sign in with the administrator email and password entered during first-time setup.

## Daily development

Either run:

```cmd
start-local.cmd
```

Or:

```cmd
npm run dev
```

## Production build

```cmd
npm run build
npm run start
```

For production, configure real store contact details, bank instructions, payment providers, file storage and notification providers before launch.

## Database commands

Apply the current Prisma schema:

```cmd
npm run db:push
```

Seed or update the date catalog:

```cmd
set "SEED_ADMIN_EMAIL=admin@khairpurdateshouse.com"
set "SEED_ADMIN_PASSWORD=Choose-A-Strong-Password"
npm run db:seed
```

Do not run the seed as part of every production start because it restores the configured seed stock values.

## Push to Git

Review changed files:

```cmd
git status
```

Create a branch:

```cmd
git checkout -b khairpur-dates-store
```

Commit the application:

```cmd
git add .
git commit -m "Implement Khairpur Dates House ecommerce storefront"
```

Add your remote if it is not configured:

```cmd
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Push the branch:

```cmd
git push -u origin khairpur-dates-store
```

Confirm that `.env` is not included before pushing:

```cmd
git status
git ls-files .env
```

The second command should return no output.
