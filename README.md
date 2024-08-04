# Invoice Tracker - Backend

This is the backend server for an Invoice Tracker App, built with Express and written in TypeScript.

The server handles operations for an invoice management application with a Next.js frontend. You can find the frontend repository [here](https://github.com/adamrichardturner/invoice-tracker-frontend).

## Features

-   **Express Server**: Built with TypeScript for type safety and scalability.
-   **Authentication**: Uses Passport.js for email sign-in and session management.
-   **Email Confirmation**: Integrates with Resend for email confirmation.
-   **MVC Structure**: Organized into models and controllers for clean code separation.
-   **Database**: Includes a `database.sql` file for setting up the basic schema.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Database](#database)
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

    Create a `.env` file in the root of the project and add the following variables:

    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=invoice_admin
    DB_PASSWORD=password
    DB_NAME=invoice_tracker
    RESEND_API_KEY=api_key
    NODE_ENV=development
    FRONTEND_URL=frontend_url
    ```

4. **Set up the database**

    Ensure your Postgres database is running and execute the SQL commands in `database.sql` to set up the necessary tables.

5. **Start the server**

    ```bash
    npm run dev
    ```

## Usage

-   The server will be running at `http://localhost:3000`.
-   You can use Postman or a similar tool to interact with the API endpoints.

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

## Database

Ensure your database is set up correctly by running the SQL commands in `database.sql`. This file contains the basic schema used for the tables.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.
