# Forma Project - Fitness Coaching App

## Overview

Forma is a modern, coach-centric fitness coaching platform designed to streamline client management and progress tracking. It provides coaches with the tools to create and manage client profiles, set personalized goals, and track key metrics. Clients, in turn, get a straightforward interface to log their progress based on the permissions set by their coach.

## Technical Stack

This project is built as a **monorepo** using **Nx Workspace** to manage all applications and shared libraries.

- **Frontend**: An **Angular 20** application, deployed to **Azure Static Web Apps**.
- **Backend**: A **NestJS** API server, deployed to **Azure App Service**.
- **Database**: **PostgreSQL**, managed by **Prisma** for schema management and migrations.
- **ORM**: **Prisma**, which provides type-safe database access and is configured with a `schema.prisma` file.

## Features

### Coach Features

- **Client Management**: Create, view, and delete client profiles.
- **Client Profile**: Set up complete client profiles with personal details, medical conditions, and fitness experience.
- **Permission System**: Toggle client tracking permissions for exercise, sleep, nutrition, and water intake.
- **Goal Setting**: Assign various goal types (e.g., weight loss, muscle gain) and automatically generate calorie and macro targets.
- **Analytics**: A basic dashboard to monitor client progress trends.
- **Check-ins**: Schedule weekly weigh-ins and check-ins with clients.

### Client Features

- **Secure Access**: Log in with a one-time password and set a permanent password on the first login.
- **Permission-Based Tracking**: Log details for exercise, sleep, nutrition, and water intake based on coach-enabled permissions.
- **Progress Viewing**: View goals, calorie targets, and macro goals assigned by the coach.
- **Weigh-ins**: Track weekly weight and optional body composition data.

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- A running PostgreSQL instance (either local or cloud-based)

### Installation

1.  **Clone the repository**:

    ```bash
    git clone [repository-url]
    cd forma-project
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create `.env` files for the frontend and backend based on the examples in the `/env` folder. Be sure to configure your `DATABASE_URL` to point to your PostgreSQL instance.

4.  **Run Prisma migrations**:

    ```bash
    # Apply the initial database schema from prisma/schema.prisma
    npx nx prisma migrate dev --name init
    ```

5.  **Start the applications**:

    ```bash
    # To run all applications (frontend and backend)
    npx nx serve

    # Or, to run a specific application
    npx nx serve frontend
    npx nx serve backend
    ```

## Project Structure

- `/apps/web`: The Angular application.
- `/apps/api`: The NestJS API.
- `/apps/libs`: Shared libraries and data models.
- `/apps/api/prisma`: The Prisma schema and migration files.

## Future Enhancements (MVP Exclusions)

The following features were intentionally excluded from the initial release but are planned for future development:

- **Messaging system** between coaches and clients.
- **Photo uploads** for progress tracking.
- **Workout plan templates** and assignment.
- **Certificate verification** for coaches.
