export const ROLES = {
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  EMPLOYEE: 'EMPLOYEE'
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_VENDORS: 'MANAGE_VENDORS',
  MANAGE_TRIPS: 'MANAGE_TRIPS',
  MANAGE_BILLING: 'MANAGE_BILLING',
  VIEW_ALL_CLIENTS: 'VIEW_ALL_CLIENTS',
  VIEW_ALL_EMPLOYEES: 'VIEW_ALL_EMPLOYEES',
  CONFIGURE_BILLING: 'CONFIGURE_BILLING'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.MANAGE_TRIPS,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_ALL_CLIENTS,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.CONFIGURE_BILLING
  ],
  [ROLES.VENDOR]: [
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_REPORTS,
  ]
};

export const hasPermission = (userRole, permission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const getUserRole = () => {
  return sessionStorage.getItem('userRole') || null;
};

export const getUserId = () => {
  return sessionStorage.getItem('userId') || null;
};

export const setUserData = (role, userId, username) => {
  sessionStorage.setItem('userRole', role);
  sessionStorage.setItem('userId', userId);
  sessionStorage.setItem('user', username);
};

export const clearUserData = () => {
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
};
