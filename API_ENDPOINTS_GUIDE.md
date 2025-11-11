# 🚀 Billing Platform - Complete API Endpoints Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication & Bearer Tokens](#authentication--bearer-tokens)
3. [Quick Start](#quick-start)
4. [All API Endpoints](#all-api-endpoints)
5. [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
6. [Request Body Examples](#request-body-examples)
7. [Response Examples](#response-examples)
8. [Testing Workflows](#testing-workflows)

---

## Overview

**Base URL:** `http://localhost:8080/api`  
**Authentication:** JWT Bearer Token (required for all endpoints except login)  
**Database:** PostgreSQL (moveinsync)  
**Backend:** Spring Boot 3.x with Spring Security  
**Frontend:** React (located in `/frontend`)

### Available Roles
- **ADMIN**: Full access to all endpoints
- **VENDOR**: Can access own reports (`/reports/vendor/me`)
- **EMPLOYEE**: Can access own reports (`/reports/employee/me`)

---

## Authentication & Bearer Tokens

### ✅ YES, Bearer Tokens are Required!

All API endpoints (except `/auth/login`) require a **JWT Bearer Token** in the Authorization header.

### How to Get a Bearer Token

1. **Login via `/api/auth/login`** endpoint
2. **Receive JWT token** in the response
3. **Include token** in all subsequent requests

### Request Format

**Header:**
```
Authorization: Bearer <your_jwt_token_here>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:8080/api/admin/clients
```

### In Postman

The collection handles Bearer tokens automatically:
1. Run a **Login** request (Admin/Vendor/Employee)
2. Token is saved to `{{jwt_token}}` environment variable
3. All other requests use `Bearer {{jwt_token}}` automatically

---

## Quick Start

### 1. Import Collection & Environment

1. Import `Billing_Platform_COMPLETE.postman_collection.json`
2. Import `Billing_Platform_Environment.postman_environment.json`
3. Select "Billing Platform - Local" environment in Postman

### 2. Login

Run one of these login requests:
- **Login as Admin** (full access)
- **Login as Vendor** (vendor reports only)
- **Login as Employee** (employee reports only)

### 3. Test Any Endpoint

After login, the Bearer token is automatically applied to all requests.

---

## All API Endpoints

### 1. 🔐 Authentication (No Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Login and get JWT token |

### 2. 👥 Client Management (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/clients` | ADMIN | Get all clients |
| GET | `/api/admin/clients/{id}` | ADMIN | Get client by ID |
| POST | `/api/admin/clients` | ADMIN | Create new client |
| PUT | `/api/admin/clients/{id}` | ADMIN | Update client |

### 3. 🚗 Vendor Management (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/vendors` | ADMIN | Get all vendors |
| GET | `/api/admin/vendors/{id}` | ADMIN | Get vendor by ID |

### 4. 👨‍💼 Employee Management (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/employees` | ADMIN | Get all employees |
| GET | `/api/admin/employees/{id}` | ADMIN | Get employee by ID |

### 5. 🚕 Trip Management (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/trips` | ADMIN | Get all trips |
| GET | `/api/admin/trips/{id}` | ADMIN | Get trip by ID |

### 6. 💰 Billing Processing (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/billing/process/{vendorId}?month={m}&year={y}` | ADMIN | Process billing for one vendor |
| POST | `/api/admin/billing/process-all?month={m}&year={y}` | ADMIN | Process billing for all vendors |

### 7. 📊 Reports (Bearer Token Required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/reports/client/{id}?month={m}&year={y}` | ADMIN | Get client report |
| GET | `/api/reports/vendor/{id}?month={m}&year={y}` | ADMIN | Get vendor report (by ID) |
| GET | `/api/reports/vendor/me?month={m}&year={y}` | VENDOR | Get own vendor report |
| GET | `/api/reports/employee/{id}?month={m}&year={y}` | ADMIN | Get employee report (by ID) |
| GET | `/api/reports/employee/me?month={m}&year={y}` | EMPLOYEE | Get own employee report |

**Total Endpoints: 20+**

---

## Detailed Endpoint Documentation

### 🔐 1. Authentication

#### POST `/api/auth/login`
**Description:** Authenticate user and receive JWT token  
**Authorization:** None (public endpoint)  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "role": "ADMIN",
  "userId": 1,
  "email": "admin@moveinsync.com"
}
```

**Available Users:**
- Admin: `admin` / `admin123`
- Vendor: `swiftcabs` / `vendor123`
- Employee: `abhikakm` / `employee123`

---

### 👥 2. Client Management

#### GET `/api/admin/clients`
**Description:** Get all clients  
**Authorization:** Bearer Token (ADMIN only)  
**Response:** Array of ClientDTO objects

**Response Example:**
```json
[
  {
    "id": 1,
    "clientCode": "MIS001",
    "name": "MoveInSync",
    "email": "billing@moveinsync.com",
    "phone": "+91-9876543210",
    "address": "Bangalore, Karnataka",
    "active": true
  }
]
```

---

#### GET `/api/admin/clients/{id}`
**Description:** Get specific client by ID  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Client ID (e.g., 1)

**Example:** `GET /api/admin/clients/1`

---

#### POST `/api/admin/clients`
**Description:** Create new client  
**Authorization:** Bearer Token (ADMIN only)  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "clientCode": "NEW001",
  "name": "New Test Client",
  "email": "newclient@example.com",
  "phone": "+91-9876543210",
  "address": "123 Test Street, Bangalore",
  "active": true
}
```

**Required Fields:**
- `clientCode` (unique)
- `name`
- `email` (valid email format)

**Optional Fields:**
- `phone`
- `address`
- `active` (default: true)

---

#### PUT `/api/admin/clients/{id}`
**Description:** Update existing client  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Client ID  
**Content-Type:** `application/json`

**Request Body:** Same as POST (all fields)

---

### 🚗 3. Vendor Management

#### GET `/api/admin/vendors`
**Description:** Get all vendors with billing configurations  
**Authorization:** Bearer Token (ADMIN only)

**Response Example:**
```json
[
  {
    "id": 1,
    "vendorCode": "SWIFT001",
    "name": "SwiftCabs",
    "email": "ops@swiftcabs.com",
    "phone": "+91-9876543210",
    "address": "Mumbai, Maharashtra",
    "active": true,
    "client": {
      "id": 1,
      "clientCode": "MIS001",
      "name": "MoveInSync"
    },
    "billingConfiguration": {
      "id": 1,
      "billingModelType": "PACKAGE",
      "fixedMonthlyCost": 50000.00,
      "includedTrips": 100,
      "includedKilometers": 2000
    }
  }
]
```

---

#### GET `/api/admin/vendors/{id}`
**Description:** Get specific vendor by ID  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Vendor ID (e.g., 1)

**Example:** `GET /api/admin/vendors/1`

---

### 👨‍💼 4. Employee Management

#### GET `/api/admin/employees`
**Description:** Get all employees  
**Authorization:** Bearer Token (ADMIN only)

**Response Example:**
```json
[
  {
    "id": 1,
    "employeeCode": "EMP001",
    "name": "Abhishek Kumar",
    "email": "abhishek@moveinsync.com",
    "phone": "+91-9876543210",
    "active": true,
    "client": {
      "id": 1,
      "name": "MoveInSync"
    }
  }
]
```

---

#### GET `/api/admin/employees/{id}`
**Description:** Get specific employee by ID  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Employee ID

**Example:** `GET /api/admin/employees/1`

---

### 🚕 5. Trip Management

#### GET `/api/admin/trips`
**Description:** Get all trips  
**Authorization:** Bearer Token (ADMIN only)

**Response Example:**
```json
[
  {
    "id": 1,
    "tripCode": "TRIP001",
    "tripDate": "2025-11-01T08:30:00",
    "source": "HSR Layout",
    "destination": "Electronic City",
    "distanceKm": 15.5,
    "durationHours": 1.5,
    "vendorCost": 310.00,
    "employeeIncentive": 0.00,
    "processed": false,
    "vendor": {
      "id": 1,
      "name": "SwiftCabs"
    },
    "employee": {
      "id": 1,
      "name": "Abhishek Kumar"
    }
  }
]
```

---

#### GET `/api/admin/trips/{id}`
**Description:** Get specific trip by ID  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Trip ID

**Example:** `GET /api/admin/trips/1`

---

### 💰 6. Billing Processing

#### POST `/api/admin/billing/process/{vendorId}?month={m}&year={y}`
**Description:** Process billing for a single vendor  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `vendorId` - Vendor ID (e.g., 1)  
**Query Parameters:**
- `month` - Month (1-12, e.g., 11)
- `year` - Year (e.g., 2025)

**Example:** `POST /api/admin/billing/process/1?month=11&year=2025`

**Process:**
1. Fetches unprocessed trips for the vendor
2. Applies billing configuration (PACKAGE/TRIP/HYBRID model)
3. Calculates total amount
4. Marks trips as processed
5. Creates billing record

**Response Example:**
```json
{
  "id": 1,
  "vendor": {
    "id": 1,
    "name": "SwiftCabs"
  },
  "billingMonth": 11,
  "billingYear": 2025,
  "totalTrips": 20,
  "totalAmount": 52400.00,
  "createdAt": "2025-11-10T10:30:00"
}
```

---

#### POST `/api/admin/billing/process-all?month={m}&year={y}`
**Description:** Process billing for ALL vendors  
**Authorization:** Bearer Token (ADMIN only)  
**Query Parameters:**
- `month` - Month (1-12)
- `year` - Year (e.g., 2025)

**Example:** `POST /api/admin/billing/process-all?month=11&year=2025`

**Response:**
```json
"Billing processed for all vendors"
```

---

### 📊 7. Reports

#### GET `/api/reports/client/{id}?month={m}&year={y}`
**Description:** Get comprehensive billing report for a client  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Client ID  
**Query Parameters:** `month`, `year`

**Example:** `GET /api/reports/client/1?month=11&year=2025`

**Response Example:**
```json
{
  "clientId": 1,
  "month": 11,
  "year": 2025,
  "totalTrips": 50,
  "totalAmount": 124800.00,
  "vendorReports": [
    {
      "vendorId": 1,
      "vendorName": "SwiftCabs",
      "totalTrips": 20,
      "totalDistance": 310.00,
      "totalDuration": 30.00,
      "baseBilling": 50000.00,
      "totalIncentives": 2400.00,
      "totalAmount": 52400.00
    }
  ]
}
```

---

#### GET `/api/reports/vendor/{id}?month={m}&year={y}`
**Description:** Get billing report for a specific vendor (Admin view)  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Vendor ID  
**Query Parameters:** `month`, `year`

**Example:** `GET /api/reports/vendor/1?month=11&year=2025`

**Response Example:**
```json
{
  "vendorId": 1,
  "vendorName": "SwiftCabs",
  "month": 11,
  "year": 2025,
  "totalTrips": 20,
  "totalDistance": 310.00,
  "totalDuration": 30.00,
  "baseBilling": 50000.00,
  "totalIncentives": 2400.00,
  "totalAmount": 52400.00
}
```

---

#### GET `/api/reports/vendor/me?month={m}&year={y}`
**Description:** Get billing report for currently logged-in vendor  
**Authorization:** Bearer Token (VENDOR role)  
**Query Parameters:** `month`, `year`

**Usage:**
1. Login as Vendor: `swiftcabs` / `vendor123`
2. Call this endpoint

**Example:** `GET /api/reports/vendor/me?month=11&year=2025`

**Response:** Same as vendor report above

---

#### GET `/api/reports/employee/{id}?month={m}&year={y}`
**Description:** Get incentive report for a specific employee (Admin view)  
**Authorization:** Bearer Token (ADMIN only)  
**Path Parameter:** `id` - Employee ID  
**Query Parameters:** `month`, `year`

**Example:** `GET /api/reports/employee/1?month=11&year=2025`

**Response Example:**
```json
{
  "employeeId": 1,
  "employeeName": "Abhishek Kumar",
  "month": 11,
  "year": 2025,
  "totalTrips": 15,
  "totalExtraHours": 5.5,
  "totalIncentive": 825.00
}
```

---

#### GET `/api/reports/employee/me?month={m}&year={y}`
**Description:** Get incentive report for currently logged-in employee  
**Authorization:** Bearer Token (EMPLOYEE role)  
**Query Parameters:** `month`, `year`

**Usage:**
1. Login as Employee: `abhikakm` / `employee123`
2. Call this endpoint

**Example:** `GET /api/reports/employee/me?month=11&year=2025`

**Response:** Same as employee report above

---

## Testing Workflows

### Workflow 1: Admin - Complete Billing Cycle

```
1. Login as Admin
   POST /api/auth/login
   Body: {"username": "admin", "password": "admin123"}
   → Save token

2. View all clients
   GET /api/admin/clients
   Authorization: Bearer {token}

3. View all vendors
   GET /api/admin/vendors
   Authorization: Bearer {token}

4. View all trips (before billing)
   GET /api/admin/trips
   Authorization: Bearer {token}

5. Process billing for vendor #1
   POST /api/admin/billing/process/1?month=11&year=2025
   Authorization: Bearer {token}

6. Generate client report
   GET /api/reports/client/1?month=11&year=2025
   Authorization: Bearer {token}

7. Generate vendor report
   GET /api/reports/vendor/1?month=11&year=2025
   Authorization: Bearer {token}
```

---

### Workflow 2: Vendor - View Own Report

```
1. Login as Vendor
   POST /api/auth/login
   Body: {"username": "swiftcabs", "password": "vendor123"}
   → Save token

2. View own billing report
   GET /api/reports/vendor/me?month=11&year=2025
   Authorization: Bearer {token}
```

---

### Workflow 3: Employee - View Own Incentives

```
1. Login as Employee
   POST /api/auth/login
   Body: {"username": "abhikakm", "password": "employee123"}
   → Save token

2. View own incentive report
   GET /api/reports/employee/me?month=11&year=2025
   Authorization: Bearer {token}
```

---

## Sample Data Reference

### Users & Credentials

| Username | Password | Role | User ID |
|----------|----------|------|---------|
| admin | admin123 | ADMIN | 1 |
| swiftcabs | vendor123 | VENDOR | 2 |
| abhikakm | employee123 | EMPLOYEE | 3 |

### Clients

| ID | Client Code | Name |
|----|-------------|------|
| 1 | MIS001 | MoveInSync |

### Vendors

| ID | Vendor Code | Name | Billing Model |
|----|-------------|------|---------------|
| 1 | SWIFT001 | SwiftCabs | PACKAGE |
| 2 | FAST002 | FastWheels | TRIP |
| 3 | PRO003 | ProRides | HYBRID |

### Employees

| ID | Employee Code | Name |
|----|---------------|------|
| 1 | EMP001 | Abhishek Kumar |
| 2 | EMP002 | Priya Singh |

### Sample Trips
- Month: November 2025 (month=11, year=2025)
- Total trips: 50+
- Vendors: SwiftCabs, FastWheels, ProRides

---

## Common Errors & Solutions

### 401 Unauthorized
**Error:** `Unauthorized` or `Access is denied`  
**Cause:** Missing or invalid Bearer token  
**Solution:**
1. Login first using `/api/auth/login`
2. Ensure token is included: `Authorization: Bearer {token}`
3. Check if token has expired (login again)

### 403 Forbidden
**Error:** `Access Denied` or `Forbidden`  
**Cause:** User role doesn't have permission  
**Solution:**
- Use ADMIN account for admin endpoints
- Vendors can only access `/reports/vendor/me`
- Employees can only access `/reports/employee/me`

### 404 Not Found
**Error:** `Not Found`  
**Cause:** Invalid ID or endpoint  
**Solution:**
- Verify the ID exists (get list first)
- Check endpoint URL spelling

### 400 Bad Request
**Error:** `Bad Request` or validation errors  
**Cause:** Invalid request body or parameters  
**Solution:**
- Check required fields
- Verify email format
- Ensure unique values (clientCode)

---

## Summary

✅ **Total Endpoints:** 20+  
✅ **Authentication:** JWT Bearer Token required (except login)  
✅ **Roles:** ADMIN, VENDOR, EMPLOYEE  
✅ **Base URL:** `http://localhost:8080/api`  
✅ **Postman Collection:** Ready to import and use  
✅ **Token Management:** Automatic in Postman  

**Ready to test!** 🚀
