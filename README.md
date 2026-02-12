# SafeGuard Insurance Management System

Comprehensive insurance platform with Customer and Admin portals.

## Project Structure

- **frontend/**: React-based frontend with a modern glassmorphism design. Built with Vite, Axios, and Lucide-React.
- **backend/**: Spring Boot REST API with MySQL persistence. Handles authentication (JWT), user profiles, policies, and claims.

## Features

### Customer Features
- **Dashboard**: Personal financial overview with premium and claim charts.
- **Policies**: Browse and apply for insurance plans.
- **Claims**: File new claims and track history.
- **Settings**: Manage profile information (Full Name, DOB, Address, etc.).

### Administrator Features (Role-Based)
- **Command Center**: Global financial analytics (Total Revenue, Payouts, Users).
- **Master Policy Manager**: Full CRUD operations for all user policies.
- **Claims Approval Hub**: Approve or Reject pending claims from across the system.

## Setup Instructions

### Backend
1. Configure MySQL in `src/main/resources/application.properties`.
2. Run `./mvnw spring-boot:run` from the `backend/` directory.

### Frontend
1. Run `npm install` in the `frontend/` directory.
2. Run `npm run dev` to start the development server.

## License
MIT
