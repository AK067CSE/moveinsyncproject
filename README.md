# Unified Billing & Reporting Platform

A multi-stakeholder billing and reporting system for multi-client, multi-vendor operations. Backend: Spring Boot (REST, Security, JPA, Caffeine). Database: PostgreSQL (indexes, constraints). Frontend: React (Dashboard, CRUD, Reports).

---

## 1) System Overview
- React UI → Spring Boot REST → PostgreSQL
- Layered backend: Controller → Service (business logic) → Repository (Spring Data JPA)
- JWT stateless authentication + RBAC (ADMIN, VENDOR, EMPLOYEE)
- Caffeine in-memory caching for read-heavy endpoints
- Transactional billing with Strategy Pattern (Package/Trip/Hybrid)

---

## 2) Architecture & Flow
- UI pages call REST endpoints via Axios; responses are DTOs (no JPA entities leaked)
- Controllers are thin; Services encapsulate business logic, `@Transactional` boundaries
- Repositories use derived methods, custom queries, pagination
- HikariCP connection pool; consistent P95 response times on cached reads

Request example (Process Billing):
1. UI calls `POST /api/admin/billing/process/{vendorId}?month=&year=`
2. Security filter validates JWT + ADMIN role
3. Service fetches trips by date range, resolves strategy, computes totals, marks trips processed, persists BillingRecord
4. Returns DTO to UI; Billing Records table updates

---

## 3) Authentication & Roles
- JWT (HS256) with 24h expiry
- BCrypt password hashing (strength 10)
- Spring Security: `/api/auth/**` is public; all other endpoints require auth
- Method-level RBAC with `@PreAuthorize`

Roles:
- ADMIN: Full CRUD, process billing, all reports
- VENDOR: Own trips/billing/reports
- EMPLOYEE: Own trip history/incentives

---

## 4) Multi-Tenancy / Tenant Isolation
This implementation uses tenant-aware scoping at the application layer:
- Data access is scoped by the authenticated user/vendor/client (no cross-tenant reads)
- Role/ownership checks enforced server-side in services/repositories
- Caching keys are entity-ID based and can be extended to include tenant/vendor identifiers if needed (e.g., `tenantId:id`)
- UI reflects isolation via role-based menus and filtered data per user context

Note: No separate schema-per-tenant is created in this codebase; isolation is enforced via access control and query scoping.

---

## 5) API Endpoints (with Roles)
Base URL: `http://localhost:8080/api`

- Auth
  - POST `/auth/login` → issue JWT (PUBLIC)

- Clients (ADMIN)
  - GET `/clients` (ADMIN)
  - GET `/clients/{id}` (ADMIN)
  - POST `/clients` (ADMIN)
  - PUT `/clients/{id}` (ADMIN)
  - DELETE `/clients/{id}` (ADMIN)

- Vendors (ADMIN)
  - GET `/vendors` (ADMIN)
  - GET `/vendors/{id}` (ADMIN)
  - POST `/vendors` (ADMIN)
  - PUT `/vendors/{id}` (ADMIN)
  - DELETE `/vendors/{id}` (ADMIN)

- Employees (ADMIN)
  - GET `/employees` (ADMIN)
  - CRUD (ADMIN)

- Trips
  - GET `/trips` (ADMIN, VENDOR limited to own)
  - GET `/trips?from=&to=&vendorId=` (filters)

- Billing Configurations (ADMIN)
  - GET `/billing-configurations` (ADMIN)
  - PUT `/billing-configurations/{vendorId}` (ADMIN)

- Billing Processing (ADMIN)
  - POST `/admin/billing/process/{vendorId}?month=&year=` (ADMIN)
  - POST `/admin/billing/process-all?month=&year=` (ADMIN)

- Billing Records / Invoices
  - GET `/billing-records` (ADMIN; Vendor sees own)
  - GET `/billing-records/{id}` (by role/ownership)

- Reports
  - GET `/reports/client?clientId=&month=&year=` (ADMIN)
  - GET `/reports/vendor?vendorId=&month=&year=` (ADMIN, VENDOR own)
  - GET `/reports/employee?employeeId=&month=&year=` (ADMIN, EMPLOYEE own)

JWT header on all authenticated calls:
```
Authorization: Bearer <token>
```

---

## 6) Database Schema (PostgreSQL)
Core tables: `users`, `clients`, `vendors`, `employees`, `billing_configurations`, `trips`, `billing_records`.

Key integrity rules:
- Foreign keys between vendor/client/employee/trip/billing_records
- Unique constraint to prevent duplicate monthly billing per vendor:
  - `(vendor_id, billing_month, billing_year)` on `billing_records`

Performance indexes (recommended):
```sql
-- Trips filtered by vendor and date range
CREATE INDEX IF NOT EXISTS idx_trips_vendor_date ON trips(vendor_id, trip_date);

-- Optional covering index for common listing columns
CREATE INDEX IF NOT EXISTS idx_trips_cover
ON trips(vendor_id, trip_date) INCLUDE (processed, distance_km, duration_hours);

-- Speed up unprocessed work queues
CREATE INDEX IF NOT EXISTS idx_trips_unprocessed ON trips(vendor_id) WHERE processed = false;

-- Idempotency (avoid duplicate billing)
ALTER TABLE billing_records
ADD CONSTRAINT IF NOT EXISTS uniq_vendor_month_year
UNIQUE (vendor_id, billing_month, billing_year);
```

Diagnostics:
```sql
-- Confirm index usage for monthly vendor queries
EXPLAIN ANALYZE
SELECT * FROM trips
WHERE vendor_id = 1 AND trip_date BETWEEN '2025-11-01' AND '2025-11-30';

-- Table stats (seq vs idx scans)
SELECT relname, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE relname IN ('trips','billing_records');

-- Keep planner stats fresh
ANALYZE trips;
```

Data inspection helpers: see `VIEW_ALL_DATABASE.sql` and `COMPLETE_SQL_QUERIES_REFERENCE.sql` in the repo.

---

## 7) Query Strategy (JPA + SQL)
- Derived queries (index-friendly): `findByVendorIdAndTripDateBetween(...)`
- Pagination for large lists: `Pageable`, `Page<T>` → `GET /trips?page=&size=`
- DTO projections for reports to reduce payload and serialization cost
- Avoid N+1: fetch joins only where necessary; prefer DTOs on read paths
- Hibernate JDBC batching for bulk updates (`saveAll`) during billing

---

## 8) Billing Engine (Strategy Pattern)
- `BillingStrategy` interface with `Package`, `Trip`, and `Hybrid` implementations
- Factory resolves strategy from `BillingConfiguration`
- Complexity: O(k) over trips for the period; aggregates computed in-service
- Idempotency: service pre-check + DB unique constraint

---

## 9) Caching (Caffeine)
- Spring Cache abstraction with Caffeine backend
- Caches: `clients`, `vendors`, `employees`, `billingConfigs`
- Policy: `maximumSize=1000`, `expireAfterWrite=30m`, `recordStats()`
- `@Cacheable` on read paths; `@CacheEvict` on mutations
- Effect: Cold GET ~tens of ms → warm GET ~2–5 ms

---

## 10) Security
- Stateless JWT auth; `SecurityFilterChain` denies all except `/api/auth/**`
- `JwtAuthenticationFilter` extracts and validates tokens per request
- RBAC via `@PreAuthorize` on controllers (ADMIN/VENDOR/EMPLOYEE)
- BCrypt for password storage; CSRF disabled (no cookie sessions)

---

## 11) Setup & Run
Prerequisites: Java 17+, Maven, PostgreSQL 14+, Node.js 18+

1) Configure DB in `src/main/resources/application.yml`:
```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/moveinsync
    username: postgres
    password: test
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
jwt:
  secret: your-256-bit-secret-key-change-this-in-production
  expiration: 86400000
```

2) Start the frontend (React)
- Windows (your paths):
```
cd C:\Users\abhik\Downloads\billing-platform
npm install
npm run dev   # Vite (dev on http://localhost:5173)
# or if the project uses CRA:
# npm start   # (dev on http://localhost:3000)
```
- General (macOS/Linux):
```
cd /path/to/billing-platform
npm install
npm run dev   # or: npm start (if CRA)
```

3) Build & start the backend (Spring Boot)
- Windows (your paths):
```
cd C:\Users\abhik\Downloads\billing-platform\billing-platform
mvn clean install
mvn spring-boot:run
```
- General (macOS/Linux):
```
cd /path/to/billing-platform/billing-platform
mvn clean install
mvn spring-boot:run
```

4) Load or inspect data (PostgreSQL)

Option A — Non-interactive (one-liners):
```
psql -U postgres -c "CREATE DATABASE moveinsync;"
psql -U postgres -d moveinsync -f "C:\\Users\\abhik\\Downloads\\billing-platform\\billing-platform\\COMPLETE_SQL_QUERIES_REFERENCE.sql"  # example: run a script
```

Option B — Interactive psql session:
```
psql -U postgres
postgres=# CREATE DATABASE moveinsync;
postgres=# \c moveinsync
moveinsync=# -- Run any SQL file using \i
moveinsync=# \i 'C:\\Users\\abhik\\Downloads\\billing-platform\\billing-platform\\VIEW_ALL_DATABASE.sql'       -- view helpers
moveinsync=# \i 'C:\\path\\to\\your\\seed.sql'                                                -- if you have seed data
moveinsync=# \dt                                                                                     -- list tables
```

General (macOS/Linux paths):
```
psql -U postgres -c "CREATE DATABASE moveinsync;"
psql -U postgres -d moveinsync -f "/path/to/seed.sql"
# or interactively:
psql -U postgres
postgres=# CREATE DATABASE moveinsync;
postgres=# \c moveinsync
moveinsync=# \i '/path/to/VIEW_ALL_DATABASE.sql'
```

Notes:
- Schema is auto-managed by Hibernate (`ddl-auto: update`).
- If you add a `src/main/resources/data.sql`, Spring Boot will auto-load it on startup.
- Use `VIEW_ALL_DATABASE.sql` to inspect contents and `COMPLETE_SQL_QUERIES_REFERENCE.sql` for handy queries.

Credentials (sample):
- Admin: `admin` / `admin`
- Vendor: `swiftcabs` / `vendor`
- Employee: `abhikakm` / `employee`

---

## 12) Demo Script (Quick)
- Login → inspect token in Network response
- Dashboard loads 4 parallel calls (Clients/Vendors/Employees/Trips)
- Open Clients → refresh twice to show cache speedup
- Trips → filter by month/vendor (index-backed)
- Process Billing (ADMIN) → new Billing Record → retry to show idempotency
- Reports → vendor/client/employee aggregates

---

## 13) Operational Notes
- HikariCP pool: tuned min/max, timeouts for consistent latency
- Logs: app logs + SQL (dev) for traceability
- Errors: standardized JSON from `@RestControllerAdvice`
- Optional: extend cache keys to include tenant/vendor for stricter isolation

---

## 14) Demo Videos
- Loom 1: https://www.loom.com/share/d4521430b7c64797a8c4994c3c372253
- Loom 2: https://www.loom.com/share/a84c34ee84cf4562b54fb65e8afb09d0
- Loom 3: https://www.loom.com/share/bd68e777aa9849a099153569a18defec

---

## 15) References in Repo
- `PART1_OVERVIEW_UI_DATABASE.md` – UI + DB design + ingestion
- `PART2_SPRINGBOOT_BACKEND.md` – Spring Boot architecture & internals
- `API_ENDPOINTS_GUIDE.md` / `ENDPOINTS_QUICK_REFERENCE.md` – endpoint details
- `VIEW_ALL_DATABASE.sql` / `COMPLETE_SQL_QUERIES_REFERENCE.sql` – SQL helpers

---

© MoveInSync Billing Platform – Technical Documentation
