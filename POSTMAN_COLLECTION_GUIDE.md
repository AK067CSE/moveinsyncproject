# Postman Collection Guide - Billing Platform API

## 📦 Files Created

1. **Billing_Platform_API.postman_collection.json** - Complete API collection with all endpoints
2. **Billing_Platform_Environment.postman_environment.json** - Environment variables for testing

## 🚀 How to Import into Postman

### Step 1: Import the Collection

1. Open **Postman**
2. Click **Import** button (top left)
3. Select **File** tab
4. Browse to: `c:\Users\abhik\Downloads\billing-platform\billing-platform\`
5. Select **Billing_Platform_API.postman_collection.json**
6. Click **Import**

### Step 2: Import the Environment

1. Click **Import** again
2. Select **File** tab
3. Select **Billing_Platform_Environment.postman_environment.json**
4. Click **Import**

### Step 3: Activate the Environment

1. In top-right corner, click the **Environment dropdown**
2. Select **"Billing Platform - Local"**
3. You're ready to test!

## 📂 Collection Structure

```
📁 Billing Platform API - Complete Collection
├── 📁 1. Authentication
│   ├── Login as Admin
│   ├── Login as Employee (abhikakm)
│   └── Login as Vendor (swiftcabs)
├── 📁 2. Clients Management
│   ├── Get All Clients
│   ├── Get Client by ID
│   ├── Create New Client
│   └── Update Client
├── 📁 3. Vendors Management
│   ├── Get All Vendors
│   └── Get Vendor by ID
├── 📁 4. Employees Management
│   ├── Get All Employees
│   └── Get Employee by ID
├── 📁 5. Trips Management
│   ├── Get All Trips
│   └── Get Trip by ID
├── 📁 6. Billing Processing ⭐ (Core Feature)
│   ├── Process Billing for Specific Vendor
│   ├── Process Billing for Vendor 2 (Metro Transport)
│   ├── Process Billing for Vendor 3 (City Rides)
│   └── Process Billing for All Vendors
├── 📁 7. Reports - Admin
│   ├── Get Client Report
│   ├── Get Vendor Report
│   └── Get Employee Incentive Report
├── 📁 8. Reports - Vendor (Self)
│   └── Get My Vendor Report
└── 📁 9. Reports - Employee (Self)
    └── Get My Employee Incentive Report
```

## 🎯 Quick Start Workflow

### Testing the Complete Billing Flow:

#### 1. **Login as Admin**
   - Folder: `1. Authentication`
   - Request: `Login as Admin`
   - This will auto-save the JWT token to environment

#### 2. **View All Trips**
   - Folder: `5. Trips Management`
   - Request: `Get All Trips`
   - Verify unprocessed trips exist

#### 3. **Process Billing for Vendor 1 (Swift Cabs - Package Model)**
   - Folder: `6. Billing Processing`
   - Request: `Process Billing for Specific Vendor`
   - Parameters: `month=11`, `year=2025`
   - This creates billing record and marks trips as processed

#### 4. **View Billing Report**
   - Folder: `7. Reports - Admin`
   - Request: `Get Vendor Report`
   - See calculated billing amounts

#### 5. **Process All Vendors at Once**
   - Folder: `6. Billing Processing`
   - Request: `Process Billing for All Vendors`
   - Processes all vendors in one call

## 👥 User Credentials (Sample Data)

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access

### Employee User
- **Username**: `abhikakm`
- **Password**: `employee123`
- **Access**: View own incentive reports

### Vendor User
- **Username**: `swiftcabs`
- **Password**: `vendor123`
- **Access**: View own billing reports

## 🔑 Environment Variables

The environment includes these pre-configured variables:

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `base_url` | API base URL (localhost:8080) | No |
| `jwt_token` | JWT authentication token | Yes (on login) |
| `username` | Current logged-in user | Yes (on login) |
| `user_role` | Current user role | Yes (on login) |
| `billing_month` | Default billing month (11) | No |
| `billing_year` | Default billing year (2025) | No |

**Auto-Set**: Variables are automatically saved by login requests

## 📊 Sample Data Overview

### Vendors & Their Billing Models:

1. **Swift Cabs (ID: 1)** - Package Model
   - Fixed monthly: ₹50,000
   - Included trips: 100
   - Included KM: 2000

2. **Metro Transport (ID: 2)** - Trip Model
   - Cost per trip: ₹200
   - Cost per KM: ₹12

3. **City Rides (ID: 3)** - Hybrid Model
   - Fixed monthly: ₹30,000
   - Included trips: 50
   - Extra trip cost: ₹150

### Sample Trips (November 2025):
- 8 trips created across all vendors
- All trips are initially unprocessed (`processed: false`)
- Trip dates range from Nov 1-4, 2025

## 🧪 Testing Different Scenarios

### Scenario 1: Process Single Vendor
1. Login as Admin
2. Process Billing for Vendor 1
3. View Vendor Report
4. Verify trips are marked as processed

### Scenario 2: Vendor Self-Service
1. Login as Vendor (swiftcabs)
2. Get My Vendor Report
3. View only your own billing data

### Scenario 3: Employee Self-Service
1. Login as Employee (abhikakm)
2. Get My Employee Incentive Report
3. View your trip incentives

### Scenario 4: Full Month Processing
1. Login as Admin
2. Process Billing for All Vendors
3. Get Client Report to see consolidated billing

## 🛠️ Troubleshooting

### Issue: "401 Unauthorized"
- **Solution**: Login again to get fresh JWT token
- Token expires after 24 hours (86400000 ms)

### Issue: "Billing already processed for vendor"
- **Solution**: Change month/year or delete existing billing record from database
- Cannot reprocess same vendor for same month

### Issue: "No trips found"
- **Solution**: Check trips exist in database for that month
- Verify trip dates match the billing period

### Issue: "403 Forbidden"
- **Solution**: Login with correct user role
- Admin endpoints require ADMIN role
- Vendor endpoints require VENDOR or ADMIN role

## 📝 API Response Examples

### Successful Login Response:
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

### Billing Record Response:
```json
{
    "id": 1,
    "vendor": {
        "id": 1,
        "name": "Swift Cabs",
        "vendorCode": "VND001"
    },
    "billingMonth": 11,
    "billingYear": 2025,
    "totalTrips": 4,
    "totalDistance": 87.00,
    "totalDuration": 7.50,
    "baseBilling": 50000.00,
    "totalIncentives": 435.00,
    "totalAmount": 50435.00
}
```

## 🔄 Workflow Best Practices

1. **Always login first** - JWT token is required for all protected endpoints
2. **Use Admin account** for billing processing
3. **Check trips before processing** - Verify unprocessed trips exist
4. **Don't reprocess same period** - System prevents duplicate billing
5. **Use role-specific endpoints** - Test vendor/employee self-service features

## 📚 Additional Resources

- **Application URL**: http://localhost:8080
- **Database**: PostgreSQL (moveinsync)
- **Sample Data**: Pre-loaded via data.sql
- **API Documentation**: All endpoints documented in collection

## 💡 Tips

- Use the **Tests** tab in requests to see auto-save scripts
- **Environment variables** are automatically updated on login
- All timestamps are in **UTC**
- Billing calculations include **incentives** for both vendors and employees
- **3 Billing Models** implemented: Package, Trip, and Hybrid

---

**Created for**: MoveInSync Billing Platform  
**Version**: 1.0.0  
**Last Updated**: November 2025
