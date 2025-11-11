-- ============================================
-- BILLING PLATFORM - CLEANUP SQL COMMANDS
-- ============================================
-- Use these commands to delete billing records and reset processed trips
-- This allows you to reprocess billing for testing purposes
-- ============================================

-- ============================================
-- 1. DELETE BILLING RECORDS
-- ============================================

-- Delete billing record for specific vendor and month/year
DELETE FROM billing_records 
WHERE vendor_id = 1 
  AND billing_month = 11 
  AND billing_year = 2025;

-- Delete ALL billing records for a specific vendor
DELETE FROM billing_records 
WHERE vendor_id = 1;

-- Delete ALL billing records for November 2025 (all vendors)
DELETE FROM billing_records 
WHERE billing_month = 11 
  AND billing_year = 2025;

-- Delete ALL billing records (complete cleanup)
DELETE FROM billing_records;

-- ============================================
-- 2. RESET TRIP PROCESSED FLAGS
-- ============================================

-- Reset processed flag for specific vendor and month/year
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE vendor_id = 1 
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- Reset ALL trips for a specific vendor
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE vendor_id = 1;

-- Reset ALL trips for November 2025 (all vendors)
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- Reset ALL trips (complete reset)
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL;

-- ============================================
-- 3. DELETE INVOICES (if applicable)
-- ============================================

-- Delete invoices for specific vendor and month/year
DELETE FROM invoices 
WHERE vendor_id = 1 
  AND EXTRACT(MONTH FROM billing_period_start) = 11
  AND EXTRACT(YEAR FROM billing_period_start) = 2025;

-- Delete ALL invoices for a vendor
DELETE FROM invoices 
WHERE vendor_id = 1;

-- Delete ALL invoices
DELETE FROM invoices;

-- ============================================
-- 4. QUICK CLEANUP SCRIPT FOR VENDOR 1, NOV 2025
-- ============================================

-- Run this as a single transaction for vendor 1 in Nov 2025
BEGIN;

-- Step 1: Delete billing records
DELETE FROM billing_records 
WHERE vendor_id = 1 
  AND billing_month = 11 
  AND billing_year = 2025;

-- Step 2: Reset trips
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE vendor_id = 1 
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- Step 3: Delete related invoices (if exists)
DELETE FROM invoices 
WHERE vendor_id = 1 
  AND EXTRACT(MONTH FROM billing_period_start) = 11
  AND EXTRACT(YEAR FROM billing_period_start) = 2025;

COMMIT;

-- ============================================
-- 5. CLEANUP FOR ALL VENDORS IN NOV 2025
-- ============================================

BEGIN;

-- Delete all billing records for Nov 2025
DELETE FROM billing_records 
WHERE billing_month = 11 
  AND billing_year = 2025;

-- Reset all trips for Nov 2025
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- Delete all invoices for Nov 2025
DELETE FROM invoices 
WHERE EXTRACT(MONTH FROM billing_period_start) = 11
  AND EXTRACT(YEAR FROM billing_period_start) = 2025;

COMMIT;

-- ============================================
-- 6. COMPLETE DATABASE RESET (ALL DATA)
-- ============================================

BEGIN;

-- Delete all billing records
DELETE FROM billing_records;

-- Reset all trips
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL;

-- Delete all invoices
DELETE FROM invoices;

COMMIT;

-- ============================================
-- 7. CHECK STATUS QUERIES
-- ============================================

-- Check billing records for vendor 1
SELECT * FROM billing_records 
WHERE vendor_id = 1 
  AND billing_month = 11 
  AND billing_year = 2025;

-- Check processed trips for vendor 1 in Nov 2025
SELECT COUNT(*) as processed_trips 
FROM trips 
WHERE vendor_id = 1 
  AND processed = true
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;

-- Check all billing records
SELECT 
    br.id,
    v.name as vendor_name,
    br.billing_month,
    br.billing_year,
    br.total_trips,
    br.total_amount,
    br.created_at
FROM billing_records br
JOIN vendors v ON br.vendor_id = v.id
ORDER BY br.created_at DESC;

-- ============================================
-- 8. VENDOR-SPECIFIC CLEANUP COMMANDS
-- ============================================

-- Vendor 1 (SwiftCabs)
DELETE FROM billing_records WHERE vendor_id = 1;
UPDATE trips SET processed = false, vendor_cost = NULL, employee_incentive = NULL WHERE vendor_id = 1;

-- Vendor 2 (FastWheels)
DELETE FROM billing_records WHERE vendor_id = 2;
UPDATE trips SET processed = false, vendor_cost = NULL, employee_incentive = NULL WHERE vendor_id = 2;

-- Vendor 3 (ProRides)
DELETE FROM billing_records WHERE vendor_id = 3;
UPDATE trips SET processed = false, vendor_cost = NULL, employee_incentive = NULL WHERE vendor_id = 3;

-- ============================================
-- 9. EMPLOYEE INCENTIVE CLEANUP (if separate table exists)
-- ============================================

-- If there's a separate employee_incentives table:
DELETE FROM employee_incentives 
WHERE EXTRACT(MONTH FROM period_start) = 11
  AND EXTRACT(YEAR FROM period_start) = 2025;

-- ============================================
-- 10. SAFE TESTING: DELETE ONLY SPECIFIC RECORD
-- ============================================

-- Get the ID first
SELECT id, vendor_id, billing_month, billing_year, total_amount 
FROM billing_records 
WHERE vendor_id = 1 AND billing_month = 11 AND billing_year = 2025;

-- Then delete by ID (safest method)
DELETE FROM billing_records WHERE id = <your_id_here>;

-- And reset corresponding trips
UPDATE trips 
SET processed = false,
    vendor_cost = NULL,
    employee_incentive = NULL
WHERE vendor_id = 1 
  AND EXTRACT(MONTH FROM trip_date) = 11
  AND EXTRACT(YEAR FROM trip_date) = 2025;
