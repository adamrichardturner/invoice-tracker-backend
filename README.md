# Invoice Tracker - Backend

This is the backend server for an Invoice Tracker App, built with Express and written in TypeScript.

The server handles operations for an invoice management application with a Next.js frontend. You can find the frontend repository [here](https://github.com/adamrichardturner/invoice-tracker-frontend).

## Features

-   **Express Server**: Built with TypeScript for type safety and scalability.
-   **Authentication**: Uses Passport.js for email sign-in and session management.
-   **Email Confirmation**: Integrates with Resend for email confirmation.
-   **MVC Structure**: Organized into models and controllers for clean code separation.
-   **Database**: Includes a `database.sql` file for setting up the basic schema.
-   **Testing**: Comprehensive tests using Jest and Supertest to ensure code quality and functionality.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Database Setup](#database-setup)
-   [Testing](#testing)
-   [Environment Configuration](#environment-configuration)
-   [Resend API Setup](#resend-api-setup)
-   [Contributing](#contributing)

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/adamrichardturner/invoice-tracker-API
    cd invoice-tracker-API
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
    RESEND_API_KEY=your_development_resend_api_key
    SESSION_SECRET=your_development_session_secret
    PORT=3000
    NODE_ENV=development
    ALLOWED_ORIGINS=http://localhost:5000
    FRONTEND_URL=http://localhost:3000
    ```

    ### `.env.production.local`

    ```env
    DB_HOST=your_production_db_host
    DB_PORT=5432
    DB_USER=your_production_db_user
    DB_PASSWORD=your_production_db_password
    DB_NAME=invoice_tracker
    RESEND_API_KEY=your_production_resend_api_key
    SESSION_SECRET=your_production_session_secret
    PORT=3000
    NODE_ENV=production
    ALLOWED_ORIGINS=https://your-production-url.com
    FRONTEND_URL=https://your-frontend-url.com
    ```

    - **DB_HOST**: The database host.
    - **DB_PORT**: The database port (default is 5432 for PostgreSQL).
    - **DB_USER**: The database user.
    - **DB_PASSWORD**: The password for the database user.
    - **DB_NAME**: The name of the database.
    - **RESEND_API_KEY**: Your API key from Resend for sending email confirmations.
    - **SESSION_SECRET**: A secret key used for signing session cookies.
    - **PORT**: The port on which the server will run.
    - **NODE_ENV**: Set to `development` for development and `production` for production.
    - **ALLOWED_ORIGINS**: The allowed origins for CORS.
    - **FRONTEND_URL**: The URL of the frontend application.

## Database Setup

You need to set up two databases: one for production and one for running tests.

### 1. **Create the Production Database**

-   **Database Name**: `invoice_tracker`
-   **Setup**: Run the following SQL commands to create the production database and set up the schema:

    ```sql
    CREATE DATABASE invoice_tracker;
    ```

-   Connect to the `invoice_tracker` database and execute the SQL commands in the `database.sql` file to set up the necessary tables.

### 2. **Create the Test Database**

-   **Database Name**: `invoice_tracker_test`
-   **Setup**: Run the following SQL commands to create the test database and set up the schema:

    ```sql
    CREATE DATABASE invoice_tracker_test;
    ```

-   Connect to the `invoice_tracker_test` database and execute the SQL commands in the `database.sql` file to set up the necessary tables.

### Database Connection

-   Ensure that both databases are running and accessible via the credentials specified in the `.env.development.local` and `.env.production.local` files.

## Usage

-   The server will be running at `http://localhost:3000` (or your specified port).
-   You can use Postman, cURL, or a similar tool to interact with the API endpoints.

## API Endpoints

### Auth

-   **POST /user/register**: Register a new user
-   **POST /user/login**: Log in a user
-   **GET /user/logout**: Log out the current user
-   **POST /user/confirm**: Confirm email address

### Invoices

-   **GET /invoices**: Get all invoices
-   **GET /invoices/:id**: Get a single invoice by ID
-   **POST /invoices**: Create a new invoice
-   **PUT /invoices/:id**: Update an invoice by ID
-   **DELETE /invoices/:id**: Delete an invoice by ID

## Testing

This project uses Jest and Supertest for testing.

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```
