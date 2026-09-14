# EstateDesk – Real Estate CRM

EstateDesk is a full-stack real estate CRM built as a portfolio project for a junior Java developer.

It helps a small agency manage a shared property inventory and contacts through a Spring Boot REST API and a lightweight HTML/CSS/JavaScript frontend.

## Project Overview

EstateDesk models the daily workflow of a brokerage office: create listings, inspect property details, update or remove records, search the inventory, and keep owner/contact information in one place.

The goal is to demonstrate practical backend skills (REST, JPA, PostgreSQL, validation, API docs) together with a usable CRM-style UI, without introducing extra frameworks on the frontend.

## Features

- Property CRUD (create, read, update, delete)
- Property details page with type-aware fields (housing, land, commercial)
- Property editing and deletion from the details view
- Advanced search over the property inventory
- Contacts CRUD
- Contact search
- Transaction type: sale / rent (`Πώληση` / `Ενοικίαση`)
- REST API for properties and contacts
- Swagger / OpenAPI documentation

## Tech Stack

- Java 24
- Spring Boot
- Spring Web
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven Wrapper
- Swagger / OpenAPI (springdoc)
- HTML, CSS, Vanilla JavaScript

## Project Structure

```text
real-estate-api/          # workspace root
├── frontend/             # static CRM UI
├── real-estate-api/      # Spring Boot backend
└── README.md
```

- `frontend/` — pages and scripts for the CRM (property list, details, new/edit property, advanced search, contacts). Talks to the API at `http://localhost:8080`.
- `real-estate-api/src/main/java/...` — application entry point, controllers, services, repositories, entities, DTOs, and exception handling.
- `real-estate-api/src/main/resources/` — `application.properties` and local profile configuration.

## Backend Setup

Requirements:

- JDK 24
- PostgreSQL listening on port `5432`
- Database name: `real_estate_db`
- Maven Wrapper (`mvnw` / `mvnw.cmd`) — no global Maven install required

The API runs on port **8080**.

Hibernate is configured with `ddl-auto=update`, so the schema is created/updated on startup.

## Database Configuration

`application.properties` does not store the database password in plain text. It uses:

```properties
spring.datasource.password=${DB_PASSWORD}
```

For local development, the password is supplied by `application-local.properties`, which is listed in `.gitignore` and **must not** be committed.

Do not put a real password in this README or in any tracked file.

## How to Run Backend

From the backend folder:

```bash
cd real-estate-api
```

**Windows**

```bash
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

**macOS / Linux**

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The `local` profile loads `application-local.properties` so Spring can resolve `DB_PASSWORD` without exporting it in the shell.

Alternatively, set the `DB_PASSWORD` environment variable and start without the `local` profile.

The API is ready when the log shows that `RealEstateApiApplication` has started. Base URL: `http://localhost:8080`.

## How to Run Frontend

The frontend is static files (no Node build step).

1. Start the backend on port 8080.
2. Serve the `frontend/` folder with Live Server, VS Code/Cursor Live Preview, or:

    ```bash
    cd frontend
    python -m http.server 5500
    ```

3. Open the UI in the browser (for example `http://localhost:5500`).

The pages call `http://localhost:8080/api/...`. Keep the API running while you use the CRM.

## API Documentation

Swagger UI:

[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

OpenAPI JSON is available at `/v3/api-docs` when the backend is running.

## Example API Endpoints

**Properties**

| Method | Path |
| ------ | ---- |
| GET | `/api/properties` |
| GET | `/api/properties/{id}` |
| POST | `/api/properties` |
| PUT | `/api/properties/{id}` |
| DELETE | `/api/properties/{id}` |

**Contacts**

| Method | Path |
| ------ | ---- |
| GET | `/api/contacts` |
| POST | `/api/contacts` |
| PUT | `/api/contacts/{id}` |
| DELETE | `/api/contacts/{id}` |

Request and response bodies are JSON. Explore schemas and try requests in Swagger.

## Future Improvements

- Authentication and authorization for agents
- Property image upload
- Map-based search
- Deployment of API and frontend to a hosted environment
