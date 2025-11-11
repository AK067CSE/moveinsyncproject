# 🚀 Unified Billing & Reporting Platform

A production-grade multi-stakeholder billing system for managing multi-client, multi-vendor operations with comprehensive reporting capabilities.

[![Java](https://img.shields.ps://img.shields.io/badge/Spring//img.shields.io(https://img.shields.ioshields.io/badge/License-MIT-yellow

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security & Authentication](#security--authentication)
- [Demo Videos](#demo-videos)

***

## 🎯 Overview

A comprehensive billing and reporting platform designed to handle complex multi-tenant operations with vendor management, employee tracking, and automated billing workflows. Built with enterprise-grade architecture featuring JWT authentication, role-based access control, and optimized performance through intelligent caching.

**Architecture**: React → Spring Boot REST API → PostgreSQL

***

## ✨ Key Features

### Core Capabilities
- **Multi-Tenant Operations** - Isolated data access for clients, vendors, and employees
- **Automated Billing Engine** - Strategy pattern implementation (Package/Trip/Hybrid billing)
- **Role-Based Access Control** - ADMIN, VENDOR, and EMPLOYEE roles with granular permissions
- **Real-Time Reporting** - Client, vendor, and employee analytics with PDF export
- **High Performance** - Caffeine caching layer (2-5ms cached response times)
- **Secure Authentication** - Stateless JWT with BCrypt password hashing

### Stakeholder Modules

#### Vendor Management
- Track trips and billing records
- View monthly invoices and payment history
- Access vendor-specific performance reports
- Manage vendor profiles and billing configurations

#### Employee Portal
- Personal trip history and incentive tracking
- Monthly performance reports
- Individual earnings and metrics
- Secure access to personal data

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT (HS256)
- **ORM**: Spring Data JPA + Hibernate
- **Caching**: Caffeine (in-memory)
- **Database**: PostgreSQL 14+
- **Connection Pool**: HikariCP

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **UI Components**: Custom component library
- **Routing**: React Router

### DevOps
- **Build Tool**: Maven
- **Package Manager**: npm
- **Database Migration**: Hibernate DDL

***

## 🏗️ System Architecture

```
┌─────────────┐
│  React UI   │
└──────┬──────┘
       │ REST API (Axios)
       ↓
┌─────────────────────────────┐
│   Spring Boot Backend       │
│                             │
│  ┌──────────────────────┐  │
│  │   Controllers        │  │
│  │   (JWT Filter)       │  │
│  └──────────┬───────────┘  │
│             ↓               │
│  ┌──────────────────────┐  │
│  │   Service Layer      │  │
│  │   (Business Logic)   │  │
│  └──────────┬───────────┘  │
│             ↓               │
│  ┌──────────────────────┐  │
│  │   Repository Layer   │  │
│  │   (Spring Data JPA)  │  │
│  └──────────┬───────────┘  │
└─────────────┼───────────────┘
              ↓
       ┌──────────────┐
       │  PostgreSQL  │
       └──────────────┘
```

### Request Flow
1. UI calls REST endpoint via Axios
2. JWT filter validates token and role
3. Controller delegates to Service layer
4. Service executes business logic with `@Transactional` boundaries
5. Repository performs database operations
6. DTO response returned to UI (no entity leakage)

***

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://github.com/user-attachments/assets/1bb8184b-a532-4882-9056-13 Management
![Client Management](https://github.com/user-attachments/assets/e337d9df-91cf-4ad2-b7d6-06 Configuration
![Billing Configuration](https://github.com/user-attachments/assets/40e26b91-26da-4af Management
![Trip Management](https://github.com/user-attachments/assets/e157a99f-c3ba-42a2-a2cb-800 Records
![Billing Records](https://github.com/user-attachments/assets/6c4a7458-cdc Dashboard
![Reports](https://github.com/user-attachments/assets/d6e22660-62c9-4b0f-921b-ae
![Vendor Portal](https://github.com/user-attachments/assets/b5e73742-ecde-4661d
![Employee Dashboard](https://github.com/user-attachments/assets/4814d6a6-728f-46a6-9d53-f4 Invoice Export
![PDF Export](https://github.com/user-attachments/assets/90ef7d13-f3b1-4739-b372-35ffcba31 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

### Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE moveinsync;"

# Run schema scripts (optional)
psql -U postgres -d moveinsync -f VIEW_ALL_DATABASE.sql
```

### Backend Setup

```bash
# Navigate to backend directory
cd billing-platform

# Install dependencies and build
mvn clean install

# Run application
mvn spring-boot:run
```

**Configuration** (`src/main/resources/application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/moveinsync
    username: postgres
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: your-256-bit-secret-key-change-in-production
  expiration: 86400000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Access the application at `http://localhost:3000`

### Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Vendor | swiftcabs | vendor |
| Employee | abhikakm | employee |

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Login and receive JWT token |

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin"
}
```

### Client Management (ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | List all clients |
| GET | `/clients/{id}` | Get client by ID |
| POST | `/clients` | Create new client |
| PUT | `/clients/{id}` | Update client |
| DELETE | `/clients/{id}` | Delete client |

### Vendor Management (ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors` | List all vendors |
| GET | `/vendors/{id}` | Get vendor by ID |
| POST | `/vendors` | Create new vendor |
| PUT | `/vendors/{id}` | Update vendor |
| DELETE | `/vendors/{id}` | Delete vendor |

### Employee Management (ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees |
| GET | `/employees/{id}` | Get employee by ID |
| POST | `/employees` | Create new employee |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Delete employee |

### Trip Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/trips` | ADMIN, VENDOR | List trips (filtered by role) |
| GET | `/trips?from=&to=&vendorId=` | ADMIN, VENDOR | Filter trips by date and vendor |

### Billing Operations (ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/billing-configurations` | List all billing configs |
| PUT | `/billing-configurations/{vendorId}` | Update billing configuration |
| POST | `/admin/billing/process/{vendorId}?month=&year=` | Process billing for vendor |
| POST | `/admin/billing/process-all?month=&year=` | Process billing for all vendors |
| GET | `/billing-records` | List billing records |
| GET | `/billing-records/{id}` | Get billing record by ID |

### Reports

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/reports/client?clientId=&month=&year=` | ADMIN | Client report |
| GET | `/reports/vendor?vendorId=&month=&year=` | ADMIN, VENDOR | Vendor report |
| GET | `/reports/employee?employeeId=&month=&year=` | ADMIN, EMPLOYEE | Employee report |

**Authentication Header**:
```
Authorization: Bearer <your-jwt-token>
```

***

## 🗄️ Database Schema

### Core Tables
- `users` - System users with authentication credentials
- `clients` - Client organizations
- `vendors` - Vendor companies with billing configurations
- `employees` - Employee records linked to vendors
- `billing_configurations` - Strategy and rate configurations per vendor
- `trips` - Individual trip records with distance, duration, and cost
- `billing_records` - Monthly billing summaries per vendor

### Key Indexes

```sql
-- Optimize trip queries by vendor and date range
CREATE INDEX idx_trips_vendor_date ON trips(vendor_id, trip_date);

-- Speed up unprocessed trip lookups
CREATE INDEX idx_trips_unprocessed ON trips(vendor_id) WHERE processed = false;

-- Ensure idempotent billing
ALTER TABLE billing_records
ADD CONSTRAINT uniq_vendor_month_year
UNIQUE (vendor_id, billing_month, billing_year);
```

### Performance Tuning

```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM trips
WHERE vendor_id = 1 AND trip_date BETWEEN '2025-11-01' AND '2025-11-30';

-- Check index usage
SELECT relname, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE relname IN ('trips', 'billing_records');

-- Update statistics
ANALYZE trips;
```

***

## 🔐 Security & Authentication

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials using BCrypt
3. JWT token generated with user details and role
4. Token returned to client with 24-hour expiry
5. Client includes token in `Authorization` header for subsequent requests

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access: manage all entities, process billing, view all reports |
| **VENDOR** | View own trips, billing records, and reports; manage vendor profile |
| **EMPLOYEE** | View personal trip history, incentives, and performance reports |

### Security Features
- Stateless JWT authentication (HS256 algorithm)
- BCrypt password hashing (strength: 10)
- Method-level security with `@PreAuthorize`
- CSRF protection disabled (stateless architecture)
- Tenant isolation enforced at application layer

***

## 🎥 Demo Videos

- [System Overview & Dashboard](https://www.loom.com/share/d4521430b7c64797a8c4994c3c372253)
- [Billing Processing Workflow](https://www.loom.com/share/a84c34ee84cf4562b54fb65e8afb09d0)
- [Vendor & Employee Portals](https://www.loom.com/share/bd68e777aa9849a099153569a18defec)
- [Reports & Analytics](https://www.loom.com/share/67163804d9ea4c81a16486b8ef2081ff)

***

## 📚 Additional Documentation

- `PART1_OVERVIEW_UI_DATABASE.md` - UI design and database architecture
- `PART2_SPRINGBOOT_BACKEND.md` - Backend implementation details
- `API_ENDPOINTS_GUIDE.md` - Comprehensive API reference
- `VIEW_ALL_DATABASE.sql` - Database inspection queries
- `COMPLETE_SQL_QUERIES_REFERENCE.sql` - SQL query examples

***

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

***

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

***

## 📧 Contact

For questions or support, please open an issue in the repository.

***

**Built with ❤️ by the MoveInSync Team**
