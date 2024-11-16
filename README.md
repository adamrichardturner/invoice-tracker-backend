# Invoice Tracker - Backend

This is the backend server for an Invoice Tracker App, built with Express and written in TypeScript.

The server handles operations for an invoice management application with a Next.js frontend. You can find the frontend repository [here](https://github.com/adamrichardturner/invoice-tracker-frontend).

## Features

-   **Express Server**: Built with TypeScript for type safety and scalability
-   **JWT Authentication**: Secure token-based authentication for demo login
-   **PostgreSQL Database**: Robust data storage with a clear schema
-   **API Architecture**: RESTful endpoints for invoice management
-   **Error Handling**: Comprehensive error handling and validation
-   **CORS Support**: Configured for secure cross-origin requests
-   **Environment Management**: Separate development and production configs
-   **Type Safety**: Full TypeScript implementation for better reliability

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Database Setup](#database-setup)
-   [Environment Configuration](#environment-configuration)
-   [Contributing](#contributing)

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/adamrichardturner/invoice-tracker-backend.git
    cd invoice-tracker-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create two environment variable files: `.env.development.local` for development and `.env.production.local` for production.

    ### `.env.development.local`

    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=db_admin
    DB_PASSWORD=your_db_admin_password
    DB_NAME=invoice_tracker_test
    JWT_SECRET=your_development_jwt_secret
    PORT=5000
    NODE_ENV=development
    ALLOWED_ORIGINS=http://localhost:3000
    ```

    ### `.env.production.local`

    ```env
    DB_HOST=your_production_db_host
    DB_PORT=5432
    DB_USER=your_production_db_user
    DB_PASSWORD=your_production_db_password
    DB_NAME=invoice_tracker
    JWT_SECRET=your_production_jwt_secret
    PORT=5000
    NODE_ENV=production
    ALLOWED_ORIGINS=https://your-frontend-url.com
    ```

## Database Setup

1. **Create the database**

    ```sql
    CREATE DATABASE invoice_tracker;
    ```

2. **Run the schema**

    Connect to your database and execute the SQL commands in `database.sql`

## Usage

The server will be running at `http://localhost:5000`.

## API Endpoints

### Auth

-   **POST /user/demo-login**: Get demo user access token
-   **POST /user/logout**: Clear authentication

### Invoices

-   **GET /api/invoices**: Get all invoices
-   **GET /api/invoices/:id**: Get invoice by ID
-   **POST /api/invoices**: Create invoice
-   **PUT /api/invoices/:id**: Update invoice
-   **DELETE /api/invoices/:id**: Delete invoice

All invoice endpoints require a valid JWT token in the Authorization header:

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
