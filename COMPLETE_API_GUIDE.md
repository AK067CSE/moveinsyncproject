# 🚀 Complete API Guide - Billing Platform

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [All API Endpoints](#all-api-endpoints)
4. [Request Body Examples](#request-body-examples)
5. [Step-by-Step Testing Guide](#step-by-step-testing-guide)

---

## 🎯 Quick Start

### Import Files into Postman:
1. **Billing_Platform_API.postman_collection.json** - Main collection
2. **Billing_Platform_Environment.postman_environment.json** - Environment variables

### First Steps:
1. Select **"Billing Platform - Local"** environment (top-right)
2. Run **"Login as Admin"** request
3. JWT token auto-saved - ready to test all endpoints!

---

## 🔐 Authentication

### Login Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | `admin` | `admin123` | Full access to all endpoints |
| **Employee** | `abhikakm` | `employee123` | View own incentive reports |
| **Vendor** | `swiftcabs` | `vendor123` | View own billing reports |

### Login Request Body:
```json
{
    "username": "admin",
    "password": "admin123"
}
```

### Login Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "username": "admin",
    "role": "ADMIN",
    "userId": 1,
    "email": "admin@billing.com"
}
```

**Note:** Token automatically saved to environment variable `jwt_token`

---

## 📡 All API Endpoints

### Base URL: `http://localhost:8080`

---

## 1. Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |

---

## 2. Client Management APIs (Admin Only)

| Method | Endpoint | Description | Sample ID |
|--------|----------|-------------|-----------|
| GET | `/api/admin/clients` | Get all clients | - |
| GET | `/api/admin/clients/{id}` | Get client by ID | `1` |
| POST | `/api/admin/clients` | Create new client | - |
| PUT | `/api/admin/clients/{id}` | Update client | `1` |

---

## 3. Vendor Management APIs (Admin Only)

| Method | Endpoint | Description | Sample ID |
|--------|----------|-------------|-----------|
| GET | `/api/admin/vendors` | Get all vendors | - |
| GET | `/api/admin/vendors/{id}` | Get vendor by ID | `1`, `2`, `3` |

**Sample Vendors:**
- **ID 1:** Swift Cabs (Package Model)
- **ID 2:** Metro Transport (Trip Model)
- **ID 3:** City Rides (Hybrid Model)

---

## 4. Employee Management APIs (Admin Only)

| Method | Endpoint | Description | Sample ID |
|--------|----------|-------------|-----------|
| GET | `/api/admin/employees` | Get all employees | - |
| GET | `/api/admin/employees/{id}` | Get employee by ID | `1`, `2`, `3` |

**Sample Employees:**
- **ID 1:** Abhishek Kumar (EMP001)
- **ID 2:** Priya Sharma (EMP002)
- **ID 3:** Amit Patel (EMP003)

---

## 5. Trip Management APIs (Admin Only)

| Method | Endpoint | Description | Sample ID |
|--------|----------|-------------|-----------|
| GET | `/api/admin/trips` | Get all trips | - |
| GET | `/api/admin/trips/{id}` | Get trip by ID | `1` to `8` |

---

## 6. Billing Processing APIs (Admin Only) ⭐

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/api/admin/billing/process/{vendorId}` | Process billing for specific vendor | `month=11&year=2025` |
| POST | `/api/admin/billing/process-all` | Process billing for all vendors | `month=11&year=2025` |

**Important:** 
- Run this BEFORE viewing reports
- Can only process once per vendor per month
- Marks trips as `processed=true`

**Sample Request:**
```
POST http://localhost:8080/api/admin/billing/process/1?month=11&year=2025
```

---

## 7. Report APIs

### Admin Reports

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| GET | `/api/reports/client/{clientId}` | Client billing report | `month=11&year=2025` |
| GET | `/api/reports/vendor/{vendorId}` | Vendor billing report | `month=11&year=2025` |
| GET | `/api/reports/employee/{employeeId}` | Employee incentive report | `month=11&year=2025` |

### Self-Service Reports

| Method | Endpoint | Description | Role | Params |
|--------|----------|-------------|------|--------|
| GET | `/api/reports/vendor/me` | My vendor report | VENDOR | `month=11&year=2025` |
| GET | `/api/reports/employee/me` | My employee report | EMPLOYEE | `month=11&year=2025` |

---

## 📝 Request Body Examples

### 1. Create Client

**Endpoint:** `POST /api/admin/clients`

**Request Body:**
```json
{
    "clientCode": "CLT004",
    "name": "New Tech Corporation",
    "email": "contact@newtech.com",
    "phone": "9876543299",
    "address": "Electronic City, Bangalore, Karnataka",
    "active": true
}
```

**Field Descriptions:**
- `clientCode` (required): Unique client code (e.g., CLT001, CLT002)
- `name` (required): Company name
- `email` (required): Valid email address
- `phone`: Contact phone number
- `address`: Full address
- `active`: true/false - is client active

---

### 2. Update Client

**Endpoint:** `PUT /api/admin/clients/1`

**Request Body:**
```json
{
    "clientCode": "CLT001",
    "name": "Tech Corp - Updated Name",
    "email": "contact@techcorp.com",
    "phone": "9876543210",
    "address": "Whitefield, Bangalore, Karnataka",
    "active": true
}
```

---

### 3. Process Billing for Vendor

**Endpoint:** `POST /api/admin/billing/process/1?month=11&year=2025`

**No Request Body Required**

**Query Parameters:**
- `month`: 1-12 (billing month)
- `year`: 2025 (billing year)

**Response Example:**
```json
{
    "id": 1,
    "vendor": {
        "id": 1,
        "vendorCode": "VND001",
        "name": "Swift Cabs"
    },
    "billingMonth": 11,
    "billingYear": 2025,
    "totalTrips": 4,
    "totalDistance": 87.00,
    "totalDuration": 7.50,
    "baseBilling": 50000.00,
    "totalIncentives": 435.00,
    "totalAmount": 50435.00,
    "createdAt": "2025-11-10T15:30:00"
}
```

---

## 🧪 Step-by-Step Testing Guide

### Scenario 1: Complete Billing Workflow (Admin)

#### Step 1: Login as Admin
```
POST http://localhost:8080/api/auth/login

Body:
{
    "username": "admin",
    "password": "admin123"
}
```
✅ Token auto-saved to environment

---

#### Step 2: View All Trips
```
GET http://localhost:8080/api/admin/trips
```
✅ See 8 unprocessed trips

---

#### Step 3: View Vendor Details
```
GET http://localhost:8080/api/admin/vendors/1
```
✅ See Swift Cabs with Package billing configuration

---

#### Step 4: Process Billing for Vendor 1
```
POST http://localhost:8080/api/admin/billing/process/1?month=11&year=2025
```
✅ Billing record created
✅ Trips marked as processed

---

#### Step 5: View Vendor Report
```
GET http://localhost:8080/api/reports/vendor/1?month=11&year=2025
```
✅ See calculated billing with breakdown

---

#### Step 6: Process All Vendors
```
POST http://localhost:8080/api/admin/billing/process-all?month=11&year=2025
```
✅ All 3 vendors processed

---

#### Step 7: View Client Report
```
GET http://localhost:8080/api/reports/client/1?month=11&year=2025
```
✅ See consolidated billing for Tech Corp

---

### Scenario 2: Vendor Self-Service

#### Step 1: Login as Vendor
```
POST http://localhost:8080/api/auth/login

Body:
{
    "username": "swiftcabs",
    "password": "vendor123"
}
```

#### Step 2: View My Billing Report
```
GET http://localhost:8080/api/reports/vendor/me?month=11&year=2025
```
✅ Vendor can only see their own report

---

### Scenario 3: Employee Self-Service

#### Step 1: Login as Employee
```
POST http://localhost:8080/api/auth/login

Body:
{
    "username": "abhikakm",
    "password": "employee123"
}
```

#### Step 2: View My Incentive Report
```
GET http://localhost:8080/api/reports/employee/me?month=11&year=2025
```
✅ Employee sees their trip incentives

---

## 🎯 Sample Data Reference

### Clients
| ID | Code | Name | Email |
|----|------|------|-------|
| 1 | CLT001 | Tech Corp | contact@techcorp.com |
| 2 | CLT002 | Finance Solutions | info@finance.com |

### Vendors
| ID | Code | Name | Model | Client |
|----|------|------|-------|--------|
| 1 | VND001 | Swift Cabs | PACKAGE | Tech Corp |
| 2 | VND002 | Metro Transport | TRIP | Tech Corp |
| 3 | VND003 | City Rides | HYBRID | Finance Solutions |

### Employees
| ID | Code | Name | Email | Client |
|----|------|------|-------|--------|
| 1 | EMP001 | Abhishek Kumar | abhik@techcorp.com | Tech Corp |
| 2 | EMP002 | Priya Sharma | priya@techcorp.com | Tech Corp |
| 3 | EMP003 | Amit Patel | amit@finance.com | Finance Solutions |

### Trips (November 2025)
| ID | Code | Vendor | Employee | Date | Distance | Duration | Processed |
|----|------|--------|----------|------|----------|----------|-----------|
| 1 | TRP001 | Swift Cabs | Abhishek | Nov 1, 09:00 | 25.50 km | 2.5 hrs | false |
| 2 | TRP002 | Swift Cabs | Abhishek | Nov 1, 18:00 | 25.50 km | 2.0 hrs | false |
| 3 | TRP003 | Swift Cabs | Priya | Nov 2, 09:00 | 18.00 km | 1.5 hrs | false |
| 4 | TRP004 | Swift Cabs | Priya | Nov 2, 18:00 | 18.00 km | 1.5 hrs | false |
| 5 | TRP005 | Metro Transport | Abhishek | Nov 3, 10:00 | 35.00 km | 3.0 hrs | false |
| 6 | TRP006 | Metro Transport | Priya | Nov 3, 14:00 | 22.00 km | 2.0 hrs | false |
| 7 | TRP007 | City Rides | Amit | Nov 4, 09:00 | 15.00 km | 1.0 hrs | false |
| 8 | TRP008 | City Rides | Amit | Nov 4, 19:00 | 15.00 km | 1.0 hrs | false |

### Billing Configurations

#### Vendor 1 (Swift Cabs) - Package Model
```json
{
    "billingModelType": "PACKAGE",
    "fixedMonthlyCost": 50000.00,
    "includedTrips": 100,
    "includedKilometers": 2000.00,
    "extraKilometerRate": 15.00,
    "extraHourRate": 200.00,
    "standardKilometersPerTrip": 20.00,
    "standardHoursPerTrip": 2.00
}
```

#### Vendor 2 (Metro Transport) - Trip Model
```json
{
    "billingModelType": "TRIP",
    "costPerTrip": 200.00,
    "costPerKilometer": 12.00,
    "extraKilometerRate": 15.00,
    "extraHourRate": 200.00,
    "standardKilometersPerTrip": 20.00,
    "standardHoursPerTrip": 2.00
}
```

#### Vendor 3 (City Rides) - Hybrid Model
```json
{
    "billingModelType": "HYBRID",
    "fixedMonthlyCost": 30000.00,
    "includedTrips": 50,
    "costPerTrip": 150.00,
    "costPerKilometer": 10.00,
    "extraKilometerRate": 15.00,
    "extraHourRate": 200.00,
    "standardKilometersPerTrip": 20.00,
    "standardHoursPerTrip": 2.00
}
```

---

## 🔥 Advanced Features

### Auto-Token Management
- Login requests automatically save JWT token
- Token used in all protected endpoints
- No manual copy-paste needed!

### Environment Variables
```
base_url = http://localhost:8080
jwt_token = (auto-saved on login)
username = (auto-saved on login)
user_role = (auto-saved on login)
billing_month = 11
billing_year = 2025
```

### Pre-filled Values
- All request bodies have sample data
- All path parameters pre-configured
- All query parameters ready to use

---

## ❌ Common Errors & Solutions

### 401 Unauthorized
**Error:** `"message": "Unauthorized"`  
**Solution:** Login again to get fresh JWT token

### 403 Forbidden
**Error:** `"message": "Access Denied"`  
**Solution:** Use correct role (e.g., Admin for billing processing)

### 409 Conflict
**Error:** `"Billing already processed for vendor X in month Y"`  
**Solution:** Use different month/year OR delete existing billing record

### 404 Not Found
**Error:** `"Vendor not found: X"`  
**Solution:** Check vendor ID exists (1, 2, or 3)

### 400 Bad Request
**Error:** `"No trips found"`  
**Solution:** Ensure trips exist for that month/year

---

## 💡 Pro Tips

1. **Always Login First** - Start every testing session with login
2. **Process Billing Before Reports** - Reports need billing records
3. **Check Processed Flag** - Trips can only be billed once
4. **Use Different Months** - Avoid "already processed" errors
5. **Test All 3 Billing Models** - Each vendor has different calculation
6. **Test Role-Based Access** - Login as different users

---

## 📊 Expected Billing Calculations

### Vendor 1 (Package Model) - November 2025
- **Base Cost:** ₹50,000 (fixed monthly)
- **Total Trips:** 4 (under 100 included)
- **Total Distance:** 87 km (under 2000 included)
- **Extra Charges:** ₹0 (within limits)
- **Incentives:** ~₹435
- **Total:** ~₹50,435

### Vendor 2 (Trip Model) - November 2025
- **Base Cost:** ₹0 (no fixed cost)
- **Trip Charges:** 2 trips × ₹200 = ₹400
- **Distance Charges:** 57 km × ₹12 = ₹684
- **Extra Charges:** (calculated based on excess)
- **Total:** ~₹1,500-₹2,000

### Vendor 3 (Hybrid Model) - November 2025
- **Base Cost:** ₹30,000 (fixed)
- **Total Trips:** 2 (under 50 included)
- **Extra Trip Charges:** ₹0
- **Distance Charges:** 30 km × ₹10 = ₹300
- **Total:** ~₹30,500-₹31,000

---

## 🎓 Testing Checklist

- [ ] Import collection into Postman
- [ ] Import environment file
- [ ] Select "Billing Platform - Local" environment
- [ ] Login as Admin (get JWT token)
- [ ] View all clients
- [ ] View all vendors
- [ ] View all employees
- [ ] View all trips
- [ ] Process billing for Vendor 1
- [ ] View vendor report
- [ ] Process billing for all vendors
- [ ] View client report
- [ ] Login as Vendor (swiftcabs)
- [ ] View my vendor report
- [ ] Login as Employee (abhikakm)
- [ ] View my employee report
- [ ] Create new client
- [ ] Update existing client

---

**🎉 You're all set! Start testing the Billing Platform APIs.**

Need help? Check the specific request descriptions in the Postman collection.
