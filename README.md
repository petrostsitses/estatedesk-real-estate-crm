# EstateDesk – Real Estate CRM

EstateDesk is a full-stack real estate CRM built as a portfolio project for a junior Java developer.

It helps a small agency manage a shared property inventory and contacts through a Spring Boot REST API and a lightweight HTML/CSS/JavaScript frontend.

## Project Overview

EstateDesk models the daily workflow of a brokerage office: create listings, inspect property details, update or remove records, search the inventory, and keep owner/contact information in one place.

The goal is to demonstrate practical backend skills (REST, JPA, PostgreSQL, validation, API documentation) together with a usable CRM-style UI, without introducing extra frameworks on the frontend.

## Features

* Property CRUD (create, read, update, delete)
* Property details page with type-aware fields (housing, land, commercial)
* Property editing and deletion from the details view
* Advanced search over the property inventory
* Contacts CRUD
* Contact search
* Transaction type: sale / rent (`Πώληση` / `Ενοικίαση`)
* REST API for properties and contacts
* Swagger / OpenAPI documentation

## Tech Stack

* Java 24
* Spring Boot
* Spring Web
* Spring Data JPA / Hibernate
* PostgreSQL
* Maven Wrapper
* Swagger / OpenAPI (springdoc)
* HTML, CSS, Vanilla JavaScript

## Project Structure

```text
real-estate-api/
├── frontend/             # Static CRM UI
├── real-estate-api/      # Spring Boot backend
└── README.md
```

* `frontend/` — pages and scripts for the CRM.
* `real-estate-api/src/main/java/...` — controllers, services, repositories, entities, DTOs, and exception handling.
* `real-estate-api/src/main/resources/` — application configuration.

## Backend Setup

Requirements:

* JDK 24
* PostgreSQL running on port `5432`
* Database: `real_estate_db`
* Maven Wrapper (`mvnw` / `mvnw.cmd`)

The API runs on port **8080**.

Hibernate is configured with `ddl-auto=update`, so the database schema is created or updated automatically on startup.

## Database Configuration

The database password is not stored directly in the tracked configuration.

```properties
spring.datasource.password=${DB_PASSWORD}
```

For local development, the password is supplied through `application-local.properties`, which is ignored by Git and must not be committed.

## How to Run Backend

From the backend folder:

```bash
cd real-estate-api
```

### Windows

```bash
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

### macOS / Linux

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The API will be available at:

`http://localhost:8080`

## How to Run Frontend

The frontend is made with HTML, CSS and Vanilla JavaScript and does not require a Node.js build step.

1. Start the backend on port `8080`.
2. Serve the `frontend/` folder using Live Server or another local HTTP server.
3. Open the frontend in your browser.

The frontend communicates with the backend through the REST API.

## API Documentation

Swagger UI:

`http://localhost:8080/swagger-ui/index.html`

OpenAPI JSON:

`http://localhost:8080/v3/api-docs`

## API Endpoints

### Properties

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/properties`      |
| GET    | `/api/properties/{id}` |
| POST   | `/api/properties`      |
| PUT    | `/api/properties/{id}` |
| DELETE | `/api/properties/{id}` |

### Contacts

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/api/contacts`      |
| POST   | `/api/contacts`      |
| PUT    | `/api/contacts/{id}` |
| DELETE | `/api/contacts/{id}` |

## Future Improvements

* Authentication and authorization for agents
* Property image upload
* Map-based search
* Deployment of the API and frontend to a hosted environment
