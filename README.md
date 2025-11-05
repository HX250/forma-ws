# Forma - Fitness Coaching Platform

> A modern, coach-centric fitness coaching platform with permission-based client tracking and goal management.

[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.dev)
[![NestJS](https://img.shields.io/badge/NestJS-10-ea2845)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)](https://tailwindcss.com)

## 🎯 Overview

**Forma** is a comprehensive fitness coaching platform where coaches have complete control over client management and tracking permissions. The platform emphasizes:

- **Coach-Controlled Access**: Only coaches can create client accounts
- **Permission-Based Tracking**: Coaches decide what clients can log
- **Goal-Driven Approach**: Automatic calorie and macro calculations
- **One-to-One Relationships**: Permanent coach-client partnerships

## 🛠 Technical Stack

### Monorepo Architecture

- **Framework**: Nx workspace
- **Structure**: Shared libraries and multiple applications

### Frontend

- **Framework**: Angular 20 (standalone components)
- **Styling**: TailwindCSS with custom design system
- **State**: Angular Signals
- **i18n**: ngx-translate (English & Slovak)
- **Deployment**: Azure Static Web Apps

### Backend

- **Framework**: NestJS
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Azure App Service

### Database

- **Type**: PostgreSQL (Prisma Postgres)
- **ORM**: Prisma with migrations
- **Schema**: Complete type-safe models

## ✨ Features

### 🎓 Coach Features

- **Client Management**
  - Create complete client profiles with personal, physical, and medical information
  - Delete clients (cascade deletes all related data)
  - Dashboard view of all clients
- **Permission System**
  - Toggle tracking permissions per client:
    - ✅ Exercise tracking
    - ✅ Sleep schedule tracking
    - ✅ Nutrition/food tracking
    - ✅ Water intake tracking
- **Goal Setting**
  - Multiple goal types (weight loss, muscle building, etc.)
  - Auto-generate calorie targets and macros (protein, carbs, fat)
  - Track client progress toward goals
- **Analytics & Monitoring**
  - Progress trend dashboards
  - Weekly weigh-in scheduling
  - Client check-in management

### 👤 Client Features

- **Secure Access**
  - First login with one-time password (sent by coach)
  - Set permanent password after first login
  - No profile setup required (coach handles everything)
- **Permission-Based Tracking** (only if enabled by coach)
  - **Exercise**: Sets, reps, weight, duration, notes
  - **Sleep**: Bed time, wake time, quality rating
  - **Nutrition**: Food, calories, macros, meal type
  - **Water**: Daily intake tracking
  - **Weigh-ins**: Weight, body fat %, muscle mass
- **Goal Viewing**
  - See assigned coach information
  - View goals, calorie targets, and macro goals

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** or **yarn**
- **PostgreSQL** instance (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd forma-ws
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env` files in:

   - `apps/web/env/.env.development`
   - `apps/api/env/.env.development`

   Required variables:

   ```env
   # API
   DATABASE_URL="postgresql://user:password@localhost:5432/forma"
   JWT_SECRET="your-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret"

   # Web
   API_URL="http://localhost:3000"
   ```

4. **Run Prisma migrations**

   ```bash
   cd apps/api
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the applications**

   ```bash
   # Start frontend (http://localhost:4200)
   npx nx serve web

   # Start backend (http://localhost:3000)
   npx nx serve api

   # Or start both
   npx nx run-many --target=serve --all
   ```

### Key Commands

```bash
# Development
npx nx serve web              # Start Angular app
npx nx serve api              # Start NestJS API

# Database
npx prisma migrate dev        # Run migrations
npx prisma studio            # Open Prisma Studio
npx prisma generate          # Generate Prisma Client

# Build
npx nx build web --prod      # Build frontend
npx nx build api --prod      # Build backend

# Testing
npx nx test web              # Run frontend tests
npx nx test api              # Run backend tests
```

## 📁 Project Structure

```
forma-ws/
├── apps/
│   ├── web/                  # Angular frontend
│   │   ├── src/app/
│   │   │   ├── core/        # Auth, guards, interceptors
│   │   │   ├── features/    # Feature modules
│   │   │   └── layout/      # Headers, navigation
│   │   └── public/assets/   # Static assets, translations
│   │
│   ├── api/                  # NestJS backend
│   │   ├── src/app/modules/ # Feature modules
│   │   └── prisma/          # Database schema
│   │
│   └── libs/                 # Shared libraries
│       ├── domain/          # Types, DTOs, enums
│       ├── frontend-shared/ # Angular components
│       └── backend-shared/  # NestJS modules
│
├── tailwind.config.js        # Global Tailwind config
└── nx.json                   # Nx workspace config
```

## 📚 Documentation

- **[PROJECT_REFERENCE.md](./PROJECT_REFERENCE.md)** - Comprehensive guide for AI assistants and developers
- **Database Schema** - See `apps/api/prisma/schema.prisma`
- **API Endpoints** - See controller files in `apps/api/src/app/modules/`

## 🔐 Authentication Flow

1. User logs in with email, password, and user type (COACH/CLIENT)
2. Backend validates and generates JWT tokens (access + refresh)
3. Tokens stored in HTTP-only cookies
4. Frontend receives AuthPayload and fetches full user data
5. User data stored in SecurityService (Angular signals)

**Client First Login:**

- Coach creates client → one-time password generated
- Client logs in → forced to set permanent password
- `isFirstLogin` flag updated

## 🎨 Design System

### Color Palette

- **Primary**: Light (#FAFAFA) / Dark (#282828)
- **Secondary**: Gray (#52525B) / Light Gray (#D4D4D8)
- **Accent**: Green (#33A52F) / Bright Green (#5DDB59)
- **Utils**: Success, Error, Info, Warning

### Components

- Custom button component (primary/secondary variants)
- Form components with validation
- Alert system
- Theme switcher (light/dark)
- Language switcher (EN/SK)

## 🌍 Internationalization

Supported languages:

- 🇺🇸 English (EN)
- 🇸🇰 Slovak (SK)

Translation files located in `apps/web/public/assets/lang/`

## 📄 License

This project is proprietary and confidential.

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with** ❤️ **using Angular, NestJS, and Prisma**
