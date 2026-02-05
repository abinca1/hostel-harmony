# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Admin panel guide

The Admin Panel lets you configure buildings, rooms, bedspaces, and warden assignments.

![Admin panel overview](public/placeholder.svg)

### Quick start

1. Open **Admin Panel** from the sidebar.
2. Add one or more buildings with floor counts and addresses.
3. Create rooms under each building and set bedspace pricing.
4. Configure bedspaces to fine-tune pricing and features.
5. Assign wardens to buildings (one building per warden).

### Example data (copy/paste)

- Building: Green Valley Tower, 6 floors, capacity 240
- Room: A-101, Double, 2 bedspaces, price 6200
- Bedspace: A-101-B1, price 6200, feature "Near Window"
- Warden: Anita Rao, +91 98989 76543

### Suggested database schema

```sql
create table buildings (
  id uuid primary key,
  name text not null,
  address text not null,
  total_floors int not null,
  total_rooms int not null,
  capacity int,
  notes text,
  created_at timestamp not null default now()
);

create table rooms (
  id uuid primary key,
  building_id uuid not null references buildings(id),
  number text not null,
  type text not null,
  floor_number int not null,
  total_bedspaces int not null,
  base_price int not null,
  has_attached_bathroom boolean not null default false,
  features text[],
  created_at timestamp not null default now(),
  unique (building_id, number)
);

create table bedspaces (
  id uuid primary key,
  room_id uuid not null references rooms(id),
  label text not null,
  price int not null,
  features text[],
  created_at timestamp not null default now(),
  unique (room_id, label)
);

create table wardens (
  id uuid primary key,
  name text not null,
  contact text not null unique,
  building_id uuid not null references buildings(id),
  created_at timestamp not null default now()
);
```

### Validation rules

- Room numbers must be unique within a building.
- Bedspace labels must be unique within a room.
- Pricing must be a positive number.
- Each warden can be assigned to only one building.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
