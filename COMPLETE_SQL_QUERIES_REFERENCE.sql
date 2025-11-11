-- ============================================
-- COMPLETE SQL QUERIES REFERENCE
-- Billing Platform Database
-- ============================================

-- ============================================
-- SECTION 1: VIEW ALL CONTENTS OF TABLES
-- ============================================

-- 1.1 View all users
SELECT * FROM users ORDER BY id;

-- 1.2 View all clients
SELECT * FROM clients ORDER BY id;

-- 1.3 View all vendors
SELECT * FROM vendors ORDER BY id;

-- 1.4 View all employees
SELECT * FROM employees ORDER BY id;

-- 1.5 View all billing configurations
SELECT * FROM billing_configurations ORDER BY vendor_id;

-- 1.6 View all trips
SELECT * FROM trips ORDER BY trip_date DESC;

-- 1.7 View all billing records
SELECT * FROM billing_records ORDER BY billing_year DESC, billing_month DESC;

-- 1.8 View all invoices (if exists)
SELECT * FROM invoices ORDER BY created_at DESC;

-- ============================================
-- SECTION 2: TABLE ROW COUNTS
-- ============================================

-- 2.1 Count all records in each table
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'billing_configurations', COUNT(*) FROM billing_configurations
UNION ALL
SELECT 'trips', COUNT(*) FROM trips
UNION ALL
SELECT 'billing_records', COUNT(*) FROM billing_records
ORDER BY table_name;

-- ============================================
-- SECTION 3: USER QUERIES
-- ============================================

-- 3.1 View all active users with their roles
SELECT id, username, email, role, active, employee_id, vendor_id
FROM users
WHERE active = true
ORDER BY role, username;

-- 3.2 Find user by username
SELECT * FROM users WHERE username = 'admin';

-- 3.3 Find user by role
SELECT * FROM users WHERE role = 'ADMIN';
SELECT * FROM users WHERE role = 'VENDOR';
SELECT * FROM users WHERE role = 'EMPLOYEE';

-- 3.4 View inactive users
SELECT * FROM users WHERE active = false;

-- ============================================
-- SECTION 4: CLIENT QUERIES
-- ============================================

-- 4.1 View all active clients with their vendors count
SELECT 
    c.id,
    c.client_code,
    c.name,
    c.email,
    c.phone,
    c.active,
    COUNT(v.id) as vendor_count
FROM clients c
LEFT JOIN vendors v ON c.id = v.client_id
WHERE c.active = true
GROUP BY c.id, c.client_code, c.name, c.email, c.phone, c.active
ORDER BY c.name;

-- 4.2 View client with all their vendors
SELECT 
    c.name as client_name,
    v.vendor_code,
    v.name as vendor_name,
    v.email,
    v.active
FROM clients c
LEFT JOIN vendors v ON c.id = v.client_id
WHERE c.id = 1
ORDER BY v.name;

-- 4.3 Client summary with employees and vendors
SELECT 
    c.id,
    c.name as client_name,
    COUNT(DISTINCT v.id) as total_vendors,
    COUNT(DISTINCT e.id) as total_employees
FROM clients c
LEFT JOIN vendors v ON c.id = v.client_id
LEFT JOIN employees e ON c.id = e.client_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- ============================================
-- SECTION 5: VENDOR QUERIES
-- ============================================

-- 5.1 View all vendors with their clients
SELECT 
    v.id,
    v.vendor_code,
    v.name as vendor_name,
    v.email,
    v.phone,
    v.active,
    c.name as client_name
FROM vendors v
LEFT JOIN clients c ON v.client_id = c.id
ORDER BY v.name;

-- 5.2 View vendor by ID
SELECT * FROM vendors WHERE id = 1;

-- 5.3 View vendor by name
SELECT * FROM vendors WHERE name ILIKE '%Swift%';

-- 5.4 View all active vendors
SELECT * FROM vendors WHERE active = true ORDER BY name;

-- 5.5 Vendor with billing configuration
SELECT 
    v.id,
    v.vendor_code,
    v.name,
    bc.billing_model_type,
    bc.fixed_monthly_cost,
    bc.included_trips,
    bc.cost_per_trip,
    bc.cost_per_kilometer,
    bc.extra_kilometer_rate,
    bc.extra_hour_rate
FROM vendors v
LEFT JOIN billing_configurations bc ON v.id = bc.vendor_id
WHERE v.id = 1;

-- ============================================
-- SECTION 6: EMPLOYEE QUERIES
-- ============================================

-- 6.1 View all employees with client info
SELECT 
    e.id,
    e.employee_code,
    e.name as employee_name,
    e.email,
    e.phone,
    e.active,
    c.name as client_name
FROM employees e
LEFT JOIN clients c ON e.client_id = c.id
ORDER BY e.name;

-- 6.2 View employee by ID
SELECT * FROM employees WHERE id = 1;

-- 6.3 View employees by client
SELECT * FROM employees WHERE client_id = 1 AND active = true;

-- 6.4 Employee with trip count
SELECT 
    e.id,
    e.employee_code,
    e.name,
    COUNT(t.id) as total_trips
FROM employees e
LEFT JOIN trips t ON e.id = t.employee_id
GROUP BY e.id, e.employee_code, e.name
ORDER BY total_trips DESC;

-- ============================================
-- SECTION 7: BILLING CONFIGURATION QUERIES
-- ============================================

-- 7.1 View all billing configurations with vendor details
SELECT 
    bc.*,
    v.name as vendor_name,
    v.vendor_code
FROM billing_configurations bc
LEFT JOIN vendors v ON bc.vendor_id = v.id
ORDER BY v.name;

-- 7.2 View configuration by billing model type
SELECT * FROM billing_configurations WHERE billing_model_type = 'PACKAGE';
SELECT * FROM billing_configurations WHERE billing_model_type = 'TRIP';
SELECT * FROM billing_configurations WHERE billing_model_type = 'HYBRID';

-- 7.3 View active configurations
SELECT * FROM billing_configurations WHERE active = true;

-- 7.4 Configuration for specific vendor
SELECT * FROM billing_configurations WHERE vendor_id = 1 AND active = true;

-- ============================================
-- SECTION 8: TRIP QUERIES (MOST IMPORTANT FOR DEBUGGING)
-- ============================================

-- 8.1 View all trips with complete details
SELECT 
    t.id,
    t.trip_code,
    t.trip_date,
    v.name as vendor_name,
    e.name as employee_name,
    t.distance_km,
    t.duration_hours,
    t.source,
    t.destination,
    t.vendor_cost,
    t.employee_incentive,
    t.processed
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
LEFT JOIN employees e ON t.employee_id = e.id
ORDER BY t.trip_date DESC;

-- 8.2 View trips for specific vendor
SELECT * FROM trips WHERE vendor_id = 1 ORDER BY trip_date DESC;

-- 8.3 View trips for specific employee
SELECT * FROM trips WHERE employee_id = 1 ORDER BY trip_date DESC;

-- 8.4 View trips by date range
SELECT * FROM trips 
WHERE trip_date BETWEEN '2025-11-01' AND '2025-11-30'
ORDER BY trip_date;

-- 8.5 View trips for specific month and year
SELECT * FROM trips 
WHERE EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025
ORDER BY trip_date;

-- 8.6 View processed trips
SELECT * FROM trips WHERE processed = true ORDER BY trip_date DESC;

-- 8.7 View unprocessed trips
SELECT * FROM trips WHERE processed = false ORDER BY trip_date DESC;

-- 8.8 View trips with zero vendor cost
SELECT 
    t.*,
    v.name as vendor_name,
    e.name as employee_name
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
LEFT JOIN employees e ON t.employee_id = e.id
WHERE t.vendor_cost = 0 OR t.vendor_cost IS NULL
ORDER BY t.trip_date DESC;

-- 8.9 Trip statistics by vendor
SELECT 
    v.name as vendor_name,
    COUNT(t.id) as total_trips,
    SUM(t.distance_km) as total_distance,
    SUM(t.duration_hours) as total_hours,
    SUM(t.vendor_cost) as total_cost,
    COUNT(CASE WHEN t.processed = true THEN 1 END) as processed_trips,
    COUNT(CASE WHEN t.processed = false THEN 1 END) as unprocessed_trips
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
GROUP BY v.id, v.name
ORDER BY v.name;

-- 8.10 Trip statistics by employee
SELECT 
    e.name as employee_name,
    COUNT(t.id) as total_trips,
    SUM(t.distance_km) as total_distance,
    SUM(t.duration_hours) as total_hours,
    SUM(t.employee_incentive) as total_incentive
FROM trips t
LEFT JOIN employees e ON t.employee_id = e.id
GROUP BY e.id, e.name
ORDER BY total_trips DESC;

-- 8.11 Monthly trip summary
SELECT 
    EXTRACT(YEAR FROM trip_date) as year,
    EXTRACT(MONTH FROM trip_date) as month,
    COUNT(*) as total_trips,
    SUM(distance_km) as total_distance,
    SUM(duration_hours) as total_hours,
    SUM(vendor_cost) as total_vendor_cost,
    SUM(employee_incentive) as total_employee_incentive
FROM trips
GROUP BY EXTRACT(YEAR FROM trip_date), EXTRACT(MONTH FROM trip_date)
ORDER BY year DESC, month DESC;

-- ============================================
-- SECTION 9: BILLING RECORDS QUERIES
-- ============================================

-- 9.1 View all billing records with vendor details
SELECT 
    br.*,
    v.name as vendor_name,
    v.vendor_code
FROM billing_records br
LEFT JOIN vendors v ON br.vendor_id = v.id
ORDER BY br.billing_year DESC, br.billing_month DESC;

-- 9.2 View billing record for specific vendor and period
SELECT * FROM billing_records 
WHERE vendor_id = 1 
  AND billing_month = 11 
  AND billing_year = 2025;

-- 9.3 View billing records for specific month/year
SELECT 
    br.id,
    v.name as vendor_name,
    br.billing_month,
    br.billing_year,
    br.total_trips,
    br.total_distance,
    br.total_duration,
    br.base_billing,
    br.extra_kilometer_cost,
    br.extra_hour_cost,
    br.total_amount
FROM billing_records br
LEFT JOIN vendors v ON br.vendor_id = v.id
WHERE br.billing_month = 11 AND br.billing_year = 2025
ORDER BY v.name;

-- 9.4 View billing summary by vendor
SELECT 
    v.name as vendor_name,
    COUNT(br.id) as billing_periods,
    SUM(br.total_trips) as all_time_trips,
    SUM(br.total_amount) as all_time_billing
FROM billing_records br
LEFT JOIN vendors v ON br.vendor_id = v.id
GROUP BY v.id, v.name
ORDER BY all_time_billing DESC;

-- ============================================
-- SECTION 10: DIAGNOSTIC QUERIES FOR SWIFT CABS ISSUE
-- ============================================

-- 10.1 Check Swift Cabs vendor details
SELECT * FROM vendors WHERE name = 'Swift Cabs';

-- 10.2 Check Swift Cabs billing configuration
SELECT 
    bc.*,
    v.name as vendor_name
FROM billing_configurations bc
JOIN vendors v ON bc.vendor_id = v.id
WHERE v.name = 'Swift Cabs';

-- 10.3 Check Swift Cabs trips for November 2025
SELECT 
    t.id,
    t.trip_code,
    t.trip_date,
    t.distance_km,
    t.duration_hours,
    t.vendor_cost,
    t.employee_incentive,
    t.processed,
    e.name as employee_name
FROM trips t
LEFT JOIN employees e ON t.employee_id = e.id
WHERE t.vendor_id = (SELECT id FROM vendors WHERE name = 'Swift Cabs')
  AND EXTRACT(MONTH FROM t.trip_date) = 11
  AND EXTRACT(YEAR FROM t.trip_date) = 2025
ORDER BY t.trip_date;

-- 10.4 Check Swift Cabs billing record
SELECT * FROM billing_records 
WHERE vendor_id = (SELECT id FROM vendors WHERE name = 'Swift Cabs')
  AND billing_month = 11 
  AND billing_year = 2025;

-- 10.5 Check processed status for Swift Cabs trips
SELECT 
    COUNT(*) as total_trips,
    SUM(CASE WHEN processed = true THEN 1 ELSE 0 END) as processed_trips,
    SUM(CASE WHEN processed = false THEN 1 ELSE 0 END) as unprocessed_trips,
    SUM(CASE WHEN vendor_cost IS NULL OR vendor_cost = 0 THEN 1 ELSE 0 END) as zero_cost_trips,
    SUM(vendor_cost) as total_vendor_cost
FROM trips
WHERE vendor_id = (SELECT id FROM vendors WHERE name = 'Swift Cabs')
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- 10.6 Detailed trip analysis for Swift Cabs
SELECT 
    t.trip_code,
    t.trip_date,
    t.distance_km,
    t.duration_hours,
    t.vendor_cost,
    t.processed,
    bc.billing_model_type,
    bc.cost_per_trip,
    bc.cost_per_kilometer,
    CASE 
        WHEN t.vendor_cost IS NULL THEN 'NULL'
        WHEN t.vendor_cost = 0 THEN 'ZERO'
        ELSE 'HAS VALUE'
    END as cost_status
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
LEFT JOIN billing_configurations bc ON v.id = bc.vendor_id
WHERE v.name = 'Swift Cabs'
  AND EXTRACT(MONTH FROM t.trip_date) = 11
  AND EXTRACT(YEAR FROM t.trip_date) = 2025;

-- ============================================
-- SECTION 11: DATA CLEANUP AND RESET QUERIES
-- ============================================

-- 11.1 Reset billing for Swift Cabs November 2025
BEGIN;
DELETE FROM billing_records 
WHERE vendor_id = 1 
  AND billing_month = 11 
  AND billing_year = 2025;

UPDATE trips 
SET processed = false, 
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE vendor_id = 1
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;
COMMIT;

-- 11.2 Reset all billing for November 2025
BEGIN;
DELETE FROM billing_records 
WHERE billing_month = 11 AND billing_year = 2025;

UPDATE trips 
SET processed = false, 
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;
COMMIT;

-- 11.3 Reset billing for specific vendor (all periods)
BEGIN;
DELETE FROM billing_records WHERE vendor_id = 1;
UPDATE trips SET processed = false, vendor_cost = NULL, employee_incentive = NULL WHERE vendor_id = 1;
COMMIT;

-- 11.4 Complete database reset (DANGEROUS!)
BEGIN;
DELETE FROM billing_records;
UPDATE trips SET processed = false, vendor_cost = NULL, employee_incentive = NULL;
COMMIT;

-- ============================================
-- SECTION 12: REPORTING QUERIES
-- ============================================

-- 12.1 Monthly vendor billing summary
SELECT 
    v.name as vendor_name,
    br.billing_month,
    br.billing_year,
    br.total_trips,
    br.total_distance,
    br.total_duration,
    br.base_billing,
    br.extra_kilometer_cost,
    br.extra_hour_cost,
    br.total_amount
FROM billing_records br
JOIN vendors v ON br.vendor_id = v.id
WHERE br.billing_month = 11 AND br.billing_year = 2025
ORDER BY br.total_amount DESC;

-- 12.2 Employee incentive report
SELECT 
    e.employee_code,
    e.name as employee_name,
    COUNT(t.id) as total_trips,
    SUM(t.duration_hours) as total_hours,
    SUM(t.employee_incentive) as total_incentive
FROM employees e
LEFT JOIN trips t ON e.id = t.employee_id
WHERE EXTRACT(MONTH FROM t.trip_date) = 11
  AND EXTRACT(YEAR FROM t.trip_date) = 2025
GROUP BY e.id, e.employee_code, e.name
ORDER BY total_incentive DESC;

-- 12.3 Client billing summary
SELECT 
    c.name as client_name,
    COUNT(DISTINCT v.id) as vendors_count,
    COUNT(t.id) as total_trips,
    SUM(br.total_amount) as total_billing
FROM clients c
LEFT JOIN vendors v ON c.id = v.client_id
LEFT JOIN trips t ON v.id = t.vendor_id
LEFT JOIN billing_records br ON v.id = br.vendor_id
WHERE br.billing_month = 11 AND br.billing_year = 2025
GROUP BY c.id, c.name
ORDER BY total_billing DESC;

-- 12.4 Vendor performance comparison
SELECT 
    v.name as vendor_name,
    v.vendor_code,
    COUNT(t.id) as trips_this_month,
    SUM(t.distance_km) as distance_km,
    SUM(t.duration_hours) as duration_hours,
    br.total_amount as billing_amount,
    ROUND(br.total_amount / NULLIF(COUNT(t.id), 0), 2) as cost_per_trip
FROM vendors v
LEFT JOIN trips t ON v.id = t.vendor_id 
    AND EXTRACT(MONTH FROM t.trip_date) = 11
    AND EXTRACT(YEAR FROM t.trip_date) = 2025
LEFT JOIN billing_records br ON v.id = br.vendor_id 
    AND br.billing_month = 11 
    AND br.billing_year = 2025
GROUP BY v.id, v.name, v.vendor_code, br.total_amount
ORDER BY billing_amount DESC;

-- ============================================
-- SECTION 13: DATABASE MAINTENANCE QUERIES
-- ============================================

-- 13.1 Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 13.2 Check sequence values
SELECT 
    'clients_id_seq' as sequence_name, 
    last_value, 
    (SELECT MAX(id) FROM clients) as max_id
FROM clients_id_seq
UNION ALL
SELECT 
    'vendors_id_seq', 
    last_value, 
    (SELECT MAX(id) FROM vendors)
FROM vendors_id_seq
UNION ALL
SELECT 
    'employees_id_seq', 
    last_value, 
    (SELECT MAX(id) FROM employees)
FROM employees_id_seq
UNION ALL
SELECT 
    'trips_id_seq', 
    last_value, 
    (SELECT MAX(id) FROM trips)
FROM trips_id_seq;

-- 13.3 Reset all sequences
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
SELECT setval('vendors_id_seq', (SELECT MAX(id) FROM vendors));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('billing_configurations_id_seq', (SELECT MAX(id) FROM billing_configurations));
SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));
SELECT setval('billing_records_id_seq', (SELECT MAX(id) FROM billing_records));

-- 13.4 Vacuum and analyze tables
VACUUM ANALYZE users;
VACUUM ANALYZE clients;
VACUUM ANALYZE vendors;
VACUUM ANALYZE employees;
VACUUM ANALYZE billing_configurations;
VACUUM ANALYZE trips;
VACUUM ANALYZE billing_records;

-- ============================================
-- SECTION 14: ADVANCED QUERIES
-- ============================================

-- 14.1 Find trips with unusual duration (outliers)
SELECT 
    t.*,
    v.name as vendor_name,
    e.name as employee_name
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
LEFT JOIN employees e ON t.employee_id = e.id
WHERE t.duration_hours > 5 OR t.duration_hours < 0.5
ORDER BY t.duration_hours DESC;

-- 14.2 Find trips with unusual distance (outliers)
SELECT 
    t.*,
    v.name as vendor_name,
    e.name as employee_name
FROM trips t
LEFT JOIN vendors v ON t.vendor_id = v.id
LEFT JOIN employees e ON t.employee_id = e.id
WHERE t.distance_km > 100 OR t.distance_km < 1
ORDER BY t.distance_km DESC;

-- 14.3 Calculate extra kilometers for trips
SELECT 
    t.trip_code,
    t.distance_km,
    bc.standard_kilometers_per_trip,
    CASE 
        WHEN t.distance_km > bc.standard_kilometers_per_trip 
        THEN t.distance_km - bc.standard_kilometers_per_trip 
        ELSE 0 
    END as extra_kilometers,
    bc.extra_kilometer_rate,
    CASE 
        WHEN t.distance_km > bc.standard_kilometers_per_trip 
        THEN (t.distance_km - bc.standard_kilometers_per_trip) * bc.extra_kilometer_rate
        ELSE 0 
    END as extra_km_cost
FROM trips t
JOIN billing_configurations bc ON t.vendor_id = bc.vendor_id
WHERE t.vendor_id = 1;

-- 14.4 Calculate extra hours for trips
SELECT 
    t.trip_code,
    t.duration_hours,
    bc.standard_hours_per_trip,
    CASE 
        WHEN t.duration_hours > bc.standard_hours_per_trip 
        THEN t.duration_hours - bc.standard_hours_per_trip 
        ELSE 0 
    END as extra_hours,
    bc.extra_hour_rate,
    CASE 
        WHEN t.duration_hours > bc.standard_hours_per_trip 
        THEN (t.duration_hours - bc.standard_hours_per_trip) * bc.extra_hour_rate
        ELSE 0 
    END as extra_hour_cost
FROM trips t
JOIN billing_configurations bc ON t.vendor_id = bc.vendor_id
WHERE t.vendor_id = 1;

-- 14.5 Trips needing attention (processed but no cost)
SELECT 
    t.*,
    v.name as vendor_name
FROM trips t
JOIN vendors v ON t.vendor_id = v.id
WHERE t.processed = true 
  AND (t.vendor_cost IS NULL OR t.vendor_cost = 0);

-- ============================================
-- SECTION 15: EXPORT COMMANDS
-- ============================================

-- 15.1 Export all data to CSV (run in psql)
-- \copy users TO 'users.csv' CSV HEADER;
-- \copy clients TO 'clients.csv' CSV HEADER;
-- \copy vendors TO 'vendors.csv' CSV HEADER;
-- \copy employees TO 'employees.csv' CSV HEADER;
-- \copy billing_configurations TO 'billing_configurations.csv' CSV HEADER;
-- \copy trips TO 'trips.csv' CSV HEADER;
-- \copy billing_records TO 'billing_records.csv' CSV HEADER;

-- ============================================
-- SECTION 16: QUICK COMMAND TO VIEW ALL TABLES
-- ============================================

-- This shows a quick overview of all data
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        RAISE NOTICE '=== TABLE: % ===', r.table_name;
        EXECUTE 'SELECT COUNT(*) FROM ' || r.table_name;
    END LOOP;
END $$;

-- ============================================
-- QUICK REFERENCE SUMMARY
-- ============================================

/*
MOST USEFUL QUERIES FOR YOUR SWIFT CABS ISSUE:

1. View Swift Cabs trips:
   SELECT * FROM trips WHERE vendor_id = 1 
   AND EXTRACT(MONTH FROM trip_date) = 11 
   AND EXTRACT(YEAR FROM trip_date) = 2025;

2. Check billing config:
   SELECT * FROM billing_configurations WHERE vendor_id = 1;

3. Check billing record:
   SELECT * FROM billing_records 
   WHERE vendor_id = 1 AND billing_month = 11 AND billing_year = 2025;

4. Reset and reprocess:
   DELETE FROM billing_records WHERE vendor_id = 1 AND billing_month = 11 AND billing_year = 2025;
   UPDATE trips SET processed = false, vendor_cost = NULL 
   WHERE vendor_id = 1 AND EXTRACT(MONTH FROM trip_date) = 11 AND EXTRACT(YEAR FROM trip_date) = 2025;

5. View all table contents in one go:
   psql -U postgres -d moveinsync -c "\dt" 
   -- Then for each table: SELECT * FROM table_name;
*/
