# Unified Billing & Reporting Platform
**Multi-stakeholder billing and reporting system for multi-client, multi-vendor operations**

**Tech Stack:** Spring Boot -  PostgreSQL -  React -  JWT -  Caffeine Cache

***

## 1️⃣ System Overview

### Architecture
- **Frontend:** React Dashboard → Axios HTTP Client
- **Backend:** Spring Boot REST API (Security, JPA, Caching)
- **Database:** PostgreSQL with optimized indexes
- **Auth:** JWT stateless authentication + RBAC
- **Caching:** Caffeine in-memory cache for read-heavy endpoints

### Core Flow
```
React UI → Spring Boot REST → PostgreSQL
         ↓
Controller → Service → Repository (JPA)
```

### Key Features
- **Layered Architecture:** Clean separation of concerns
- **RBAC:** Three roles (ADMIN, VENDOR, EMPLOYEE)
- **Strategy Pattern:** Flexible billing computation (Package/Trip/Hybrid)
- **Transaction Safety:** `@Transactional` boundaries
- **Performance:** HikariCP pooling + Caffeine caching

---

## 2️⃣ Demo Videos

### 📹 Watch the Platform in Action

| Video | Focus Area | Link |
|-------|-----------|------|
| **Demo 1** | System Overview & UI Flow | [Watch on Loom](https://www.loom.com/share/d4521430b7c64797a8c4994c3c372253) |
| **Demo 2** | Billing Processing & Reports | [Watch on Loom](https://www.loom.com/share/a84c34ee84cf4562b54fb65e8afb09d0) |
| **Demo 3** | Multi-tenancy & Security | [Watch on Loom](https://www.loom.com/share/bd68e777aa9849a099153569a18defec) |
| **Demo 4** | Performance & Caching | [Watch on Loom](https://www.loom.com/share/67163804d9ea4c81a16486b8ef2081ff) |

### 🎥 Uploading Videos to GitHub

**File Size Limits:**
- **Standard Git:** 100 MB maximum per file
- **Git LFS (Large File Storage):** Up to 2 GB per file
- **Repository Size:** 5 GB soft limit (not strictly enforced)

**Best Practices for Video Files:**
- Files **< 50 MB:** Upload directly to GitHub
- Files **50-100 MB:** Use with caution (may cause issues)
- Files **> 100 MB:** Use Git LFS or external hosting

**Recommended Approach:**
Keep demo videos on Loom/YouTube and link them (as shown above). This keeps your repo lean and provides better streaming quality.

**Git LFS Setup (if needed):**
```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
git add your-video.mp4
git commit -m "Add demo video"
```

***

## 3️⃣ Authentication & Security

### JWT Implementation
- **Algorithm:** HS256 with 24h expiry
- **Password Hashing:** BCrypt (strength 10)
- **Session:** Stateless (no cookies)

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **ADMIN** | Full CRUD, process billing, all reports |
| **VENDOR** | Own trips/billing/reports only |
| **EMPLOYEE** | Own trip history and incentives |

### Security Configuration
```
Public Routes: /api/auth/**
Protected Routes: All others require valid JWT
Method Security: @PreAuthorize annotations
```

***

## 4️⃣ API Endpoints Reference

**Base URL:** `http://localhost:8080/api`

**Authentication Header:**
```
Authorization: Bearer <your-jwt-token>
```

### Authentication (Public)
- `POST /auth/login` → Returns JWT token

### Clients (ADMIN only)
- `GET /clients` — List all clients
- `GET /clients/{id}` — Get client details
- `POST /clients` — Create new client
- `PUT /clients/{id}` — Update client
- `DELETE /clients/{id}` — Delete client

### Vendors (ADMIN only)
- `GET /vendors` — List all vendors
- `GET /vendors/{id}` — Get vendor details
- `POST /vendors` — Create new vendor
- `PUT /vendors/{id}` — Update vendor
- `DELETE /vendors/{id}` — Delete vendor

### Employees (ADMIN only)
- `GET /employees` — List all employees
- Full CRUD operations available

### Trips (ADMIN + VENDOR)
- `GET /trips?from=&to=&vendorId=` — Filter trips
- Vendors see only their own trips

### Billing Operations (ADMIN only)
- `POST /admin/billing/process/{vendorId}?month=&year=` — Process vendor billing
- `POST /admin/billing/process-all?month=&year=` — Process all vendors

### Reports
- `GET /reports/client?clientId=&month=&year=` — Client reports (ADMIN)
- `GET /reports/vendor?vendorId=&month=&year=` — Vendor reports (ADMIN, own VENDOR)
- `GET /reports/employee?employeeId=&month=&year=` — Employee reports (ADMIN, own EMPLOYEE)

***

## 5️⃣ Database Architecture

### PostgreSQL Schema

**Core Tables:**
```
users → authentication & roles
clients → client organizations
vendors → service providers
employees → staff members
billing_configurations → vendor billing rules
trips → trip records
billing_records → monthly invoices
```

### Performance Indexes

```sql
-- High-performance trip queries
CREATE INDEX idx_trips_vendor_date 
ON trips(vendor_id, trip_date);

-- Covering index for list views
CREATE INDEX idx_trips_cover
ON trips(vendor_id, trip_date) 
INCLUDE (processed, distance_km, duration_hours);

-- Unprocessed work queue optimization
CREATE INDEX idx_trips_unprocessed 
ON trips(vendor_id) WHERE processed = false;

-- Prevent duplicate billing (idempotency)
ALTER TABLE billing_records
ADD CONSTRAINT uniq_vendor_month_year
UNIQUE (vendor_id, billing_month, billing_year);
```

### Query Performance Diagnostics

```sql
-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM trips
WHERE vendor_id = 1 
AND trip_date BETWEEN '2025-11-01' AND '2025-11-30';

-- Monitor scan types
SELECT relname, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE relname IN ('trips','billing_records');

-- Keep statistics fresh
ANALYZE trips;
```

***

## 6️⃣ Caching Strategy

### Caffeine Configuration

**Cache Policies:**
- **Max Size:** 1000 entries per cache
- **Expiration:** 30 minutes after write
- **Statistics:** Enabled for monitoring

**Cached Entities:**
- Clients
- Vendors
- Employees
- Billing Configurations

**Performance Impact:**
- Cold read: ~50-100ms
- Warm read: ~2-5ms
- **~20x speedup** on repeated reads

### Implementation
```java
@Cacheable("clients")
public Client getClient(Long id)

@CacheEvict(value = "clients", key = "#id")
public void updateClient(Long id, Client client)
```

***

## 7️⃣ Billing Engine

### Strategy Pattern Implementation

**Billing Strategies:**
1. **Package-based:** Fixed monthly rate
2. **Trip-based:** Per-trip charges
3. **Hybrid:** Combination of both

**Computation Flow:**
1. Fetch trips for billing period
2. Resolve strategy from configuration
3. Calculate totals using strategy
4. Mark trips as processed
5. Persist billing record

**Complexity:** O(k) where k = number of trips in period

**Idempotency:** Database constraint + service-level check prevents duplicate billing

***

## 8️⃣ Multi-Tenancy & Isolation

### Tenant Isolation Strategy

**Application-Level Scoping:**
- Data access filtered by authenticated user context
- Role-based ownership checks in services
- Query-level vendor/client scoping

**Security Measures:**
- No cross-tenant data leakage
- Server-side authorization on all reads
- UI reflects user's accessible data only

**Cache Isolation:**
- Entity-ID based cache keys
- Extensible to include tenant identifiers

**Note:** This implementation uses shared database with application-layer isolation rather than schema-per-tenant.

---

## 9️⃣ Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 14+
- Node.js 18+

### Database Configuration

**application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/moveinsync
    username: postgres
    password: your-password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: your-256-bit-secret-key
  expiration: 86400000
```

### Installation Steps

**1. Database Setup**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE moveinsync;"

# Optional: Load seed data
psql -U postgres -d moveinsync -f "path/to/seed.sql"
```

**2. Backend Setup**
```bash
cd billing-platform
mvn clean install
mvn spring-boot:run
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Vendor | swiftcabs | vendor |
| Employee | abhikakm | employee |

***

## 🔟 Quick Demo Script

### Testing the Platform

1. **Login Flow**
   - Login with credentials
   - Inspect JWT in Network tab

2. **Dashboard Performance**
   - Observe 4 parallel API calls
   - Note response times

3. **Cache Demonstration**
   - Open Clients page
   - Refresh twice
   - Compare response times (cache speedup visible)

4. **Trip Filtering**
   - Filter by date range and vendor
   - Observe index-backed query performance

5. **Billing Processing**
   - Process billing for a vendor (ADMIN only)
   - Verify new billing record created
   - Retry to demonstrate idempotency

6. **Reports**
   - Generate vendor/client/employee reports
   - Verify aggregated data accuracy

***

## 1️⃣1️⃣ Additional Documentation

### Repository References

| Document | Description |
|----------|-------------|
| `PART1_OVERVIEW_UI_DATABASE.md` | UI design + database schema + data ingestion |
| `PART2_SPRINGBOOT_BACKEND.md` | Spring Boot architecture & implementation details |
| `API_ENDPOINTS_GUIDE.md` | Comprehensive endpoint documentation |
| `ENDPOINTS_QUICK_REFERENCE.md` | Quick API reference card |
| `VIEW_ALL_DATABASE.sql` | Database inspection helper queries |
| `COMPLETE_SQL_QUERIES_REFERENCE.sql` | Complete SQL reference guide |

---

## 1️⃣2️⃣ Production Considerations

### Performance Tuning
- HikariCP connection pool optimization
- Consistent P95 response times under load
- Caffeine cache hit rates monitoring

### Observability
- Application logging with structured output
- SQL query logging (dev environment)
- Standardized error responses via `@RestControllerAdvice`

### Future Enhancements
- Extend cache keys with tenant identifiers
- Implement Redis for distributed caching
- Add metrics collection (Prometheus/Grafana)
- Implement audit logging

***

**© MoveInSync Billing Platform — Enterprise-Grade Billing & Reporting**

---

This restructured documentation is now more visually appealing with:
- Emoji indicators for sections
- Tables for better readability
- Clear visual hierarchy
- Demo videos prominently placed as section 2
- GitHub video upload guidance included
- Consistent formatting throughout
