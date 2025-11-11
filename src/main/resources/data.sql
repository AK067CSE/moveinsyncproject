
INSERT INTO users (username, password, email, role, active, created_at, updated_at) VALUES ('admin', '$2a$10$mGPHHvZEl0Uqctjml7a5aOehhqO47kKgdhhpwkvbLERVZfsz.1GZC', 'admin@billing.com', 'ADMIN', true, NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO users (username, password, email, role, active, employee_id, created_at, updated_at) VALUES ('abhikakm', '$2a$10$SoqM2SJb1uSKwyBHTg/8r..oW5EC/2F8jEnuKMNMFhrXacTotakqe', 'abhik@techcorp.com', 'EMPLOYEE', true, 1, NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO users (username, password, email, role, active, vendor_id, created_at, updated_at) VALUES ('swiftcabs', '$2a$10$l/ZIbSKdbHIOqCsJSAYMj.pbVm5z3jABaTnz3P86996FC67WkKzGm', 'swift@cabs.com', 'VENDOR', true, 1, NOW(), NOW()) ON CONFLICT DO NOTHING;


INSERT INTO clients (id, client_code, name, email, phone, address, active, created_at, updated_at)
VALUES
    (1, 'CLT001', 'Tech Corp', 'contact@techcorp.com', '9876543210', 'Bangalore, Karnataka', true, NOW(), NOW()),
    (2, 'CLT002', 'Finance Solutions', 'info@finance.com', '9876543211', 'Mumbai, Maharashtra', true, NOW(), NOW())
    ON CONFLICT DO NOTHING;


INSERT INTO vendors (id, vendor_code, name, email, phone, address, active, client_id, created_at, updated_at)
VALUES
    (1, 'VND001', 'Swift Cabs', 'swift@cabs.com', '9876543220', 'Bangalore', true, 1, NOW(), NOW()),
    (2, 'VND002', 'Metro Transport', 'metro@transport.com', '9876543221', 'Bangalore', true, 1, NOW(), NOW()),
    (3, 'VND003', 'City Rides', 'city@rides.com', '9876543222', 'Mumbai', true, 2, NOW(), NOW())
    ON CONFLICT DO NOTHING;


INSERT INTO billing_configurations (id, vendor_id, billing_model_type, fixed_monthly_cost,
                                    included_trips, included_kilometers, extra_kilometer_rate, extra_hour_rate,
                                    standard_kilometers_per_trip, standard_hours_per_trip, active, created_at, updated_at)
VALUES
    (1, 1, 'PACKAGE', 50000.00, 100, 2000.00, 15.00, 200.00, 20.00, 2.00, true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

-- Trip Model for VND002
INSERT INTO billing_configurations (id, vendor_id, billing_model_type, cost_per_trip,
                                    cost_per_kilometer, extra_kilometer_rate, extra_hour_rate,
                                    standard_kilometers_per_trip, standard_hours_per_trip, active, created_at, updated_at)
VALUES
    (2, 2, 'TRIP', 200.00, 12.00, 15.00, 200.00, 20.00, 2.00, true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

-- Hybrid Model for VND003
INSERT INTO billing_configurations (id, vendor_id, billing_model_type, fixed_monthly_cost,
                                    included_trips, cost_per_trip, cost_per_kilometer, extra_kilometer_rate, extra_hour_rate,
                                    standard_kilometers_per_trip, standard_hours_per_trip, active, created_at, updated_at)
VALUES
    (3, 3, 'HYBRID', 30000.00, 50, 150.00, 10.00, 15.00, 200.00, 20.00, 2.00, true, NOW(), NOW())
    ON CONFLICT DO NOTHING;


INSERT INTO employees (id, employee_code, name, email, phone, active, client_id, created_at, updated_at)
VALUES
    (1, 'EMP001', 'Abhishek Kumar', 'abhik@techcorp.com', '9876543230', true, 1, NOW(), NOW()),
    (2, 'EMP002', 'Priya Sharma', 'priya@techcorp.com', '9876543231', true, 1, NOW(), NOW()),
    (3, 'EMP003', 'Amit Patel', 'amit@finance.com', '9876543232', true, 2, NOW(), NOW())
    ON CONFLICT DO NOTHING;


INSERT INTO trips (id, trip_code, vendor_id, employee_id, trip_date, distance_km,
                   duration_hours, source, destination, processed, created_at, updated_at)
VALUES
    -- Trips for VND001 (Package Model)
    (1, 'TRP001', 1, 1, '2025-11-01 09:00:00', 25.50, 2.5, 'Home', 'Office', false, NOW(), NOW()),
    (2, 'TRP002', 1, 1, '2025-11-01 18:00:00', 25.50, 2.0, 'Office', 'Home', false, NOW(), NOW()),
    (3, 'TRP003', 1, 2, '2025-11-02 09:00:00', 18.00, 1.5, 'Home', 'Office', false, NOW(), NOW()),
    (4, 'TRP004', 1, 2, '2025-11-02 18:00:00', 18.00, 1.5, 'Office', 'Home', false, NOW(), NOW()),

    -- Trips for VND002 (Trip Model)
    (5, 'TRP005', 2, 1, '2025-11-03 10:00:00', 35.00, 3.0, 'Home', 'Office', false, NOW(), NOW()),
    (6, 'TRP006', 2, 2, '2025-11-03 14:00:00', 22.00, 2.0, 'Office', 'Home', false, NOW(), NOW()),

    -- Trips for VND003 (Hybrid Model)
    (7, 'TRP007', 3, 3, '2025-11-04 09:00:00', 15.00, 1.0, 'Home', 'Office', false, NOW(), NOW()),
    (8, 'TRP008', 3, 3, '2025-11-04 19:00:00', 15.00, 1.0, 'Office', 'Home', false, NOW(), NOW())
    ON CONFLICT DO NOTHING;

-- Reset sequences
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
SELECT setval('vendors_id_seq', (SELECT MAX(id) FROM vendors));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('billing_configurations_id_seq', (SELECT MAX(id) FROM billing_configurations));
SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips));
