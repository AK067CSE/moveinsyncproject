# 📋 Billing Platform - API Endpoints Quick Reference

## Base URL
```
http://localhost:8080/api
```

## Authentication
**All endpoints require Bearer Token except `/auth/login`**

Header format:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication (No Token Required)

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Credentials:**
- Admin: `admin` / `admin123`
- Vendor: `swiftcabs` / `vendor123`
- Employee: `abhikakm` / `employee123`

---

## 👥 Client Management (ADMIN only)

```http
GET    /api/admin/clients           # Get all clients
GET    /api/admin/clients/{id}      # Get client by ID
POST   /api/admin/clients           # Create client
PUT    /api/admin/clients/{id}      # Update client
```

**Sample POST/PUT Body:**
```json
{
  "clientCode": "NEW001",
  "name": "New Client",
  "email": "client@example.com",
  "phone": "+91-9876543210",
  "address": "Bangalore, Karnataka",
  "active": true
}
```

---

## 🚗 Vendor Management (ADMIN only)

```http
GET    /api/admin/vendors           # Get all vendors
GET    /api/admin/vendors/{id}      # Get vendor by ID
```

---

## 👨‍💼 Employee Management (ADMIN only)

```http
GET    /api/admin/employees         # Get all employees
GET    /api/admin/employees/{id}    # Get employee by ID
```

---

## 🚕 Trip Management (ADMIN only)

```http
GET    /api/admin/trips             # Get all trips
GET    /api/admin/trips/{id}        # Get trip by ID
```

---

## 💰 Billing Processing (ADMIN only)

```http
POST   /api/admin/billing/process/{vendorId}?month={m}&year={y}
       # Process billing for single vendor
       # Example: /api/admin/billing/process/1?month=11&year=2025

POST   /api/admin/billing/process-all?month={m}&year={y}
       # Process billing for all vendors
       # Example: /api/admin/billing/process-all?month=11&year=2025
```

---

## 📊 Reports

### Admin Reports
```http
GET    /api/reports/client/{id}?month={m}&year={y}
       # Client billing report
       # Example: /api/reports/client/1?month=11&year=2025

GET    /api/reports/vendor/{id}?month={m}&year={y}
       # Vendor billing report
       # Example: /api/reports/vendor/1?month=11&year=2025

GET    /api/reports/employee/{id}?month={m}&year={y}
       # Employee incentive report
       # Example: /api/reports/employee/1?month=11&year=2025
```

### Self Reports (VENDOR/EMPLOYEE roles)
```http
GET    /api/reports/vendor/me?month={m}&year={y}
       # Vendor's own report (VENDOR role)
       # Login as: swiftcabs / vendor123

GET    /api/reports/employee/me?month={m}&year={y}
       # Employee's own report (EMPLOYEE role)
       # Login as: abhikakm / employee123
```

---

## 🔑 Role-Based Access Control

| Endpoint Pattern | ADMIN | VENDOR | EMPLOYEE |
|-----------------|-------|--------|----------|
| `/api/auth/login` | ✅ | ✅ | ✅ |
| `/api/admin/*` | ✅ | ❌ | ❌ |
| `/api/reports/client/*` | ✅ | ❌ | ❌ |
| `/api/reports/vendor/{id}` | ✅ | ❌ | ❌ |
| `/api/reports/vendor/me` | ❌ | ✅ | ❌ |
| `/api/reports/employee/{id}` | ✅ | ❌ | ❌ |
| `/api/reports/employee/me` | ❌ | ❌ | ✅ |

---

## 📝 Sample Data

### IDs for Testing
- **Client ID:** 1 (MoveInSync)
- **Vendor IDs:** 1 (SwiftCabs), 2 (FastWheels), 3 (ProRides)
- **Employee IDs:** 1 (Abhishek), 2 (Priya)
- **Month/Year:** 11/2025 (November 2025)

---

## 🚀 Quick Testing Flow

### 1. Login and Save Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Save the token from response
```

### 2. Use Token in Requests
```bash
curl -X GET http://localhost:8080/api/admin/clients \
  -H "Authorization: Bearer <your_token_here>"
```

### 3. Process Billing
```bash
curl -X POST "http://localhost:8080/api/admin/billing/process/1?month=11&year=2025" \
  -H "Authorization: Bearer <your_token_here>"
```

### 4. Get Reports
```bash
curl -X GET "http://localhost:8080/api/reports/client/1?month=11&year=2025" \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 📦 Postman Files

1. **Collection:** `Billing_Platform_COMPLETE.postman_collection.json`
2. **Environment:** `Billing_Platform_Environment.postman_environment.json`

**Import both files into Postman for automatic Bearer token management!**

---

## ⚠️ Important Notes

1. **Bearer Token is REQUIRED** for all endpoints except login
2. **Token expires** after some time - login again if you get 401 errors
3. **Role restrictions** - Use correct user role for each endpoint
4. **Process billing first** before generating reports for a month
5. **Frontend integration** - React app uses same API endpoints

---

## 🔍 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | - |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request body/parameters |
| 401 | Unauthorized | Login and include Bearer token |
| 403 | Forbidden | Use correct role (ADMIN/VENDOR/EMPLOYEE) |
| 404 | Not Found | Check ID or endpoint URL |
| 500 | Server Error | Check server logs |

---

**Total Endpoints: 20+**  
**Authentication: JWT Bearer Token**  
**Ready to use! 🚀**
