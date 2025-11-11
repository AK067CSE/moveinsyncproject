import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBuilding,
    FaTruck,
    FaUsers,
    FaRoute,
    FaFileInvoiceDollar,
    FaChartBar,
    FaSignOutAlt,
    FaCog
} from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { BiBuildings } from "react-icons/bi";
import { IoCarSportOutline } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { LuChartSpline } from "react-icons/lu";
import { logout } from '../services/api';
import { getUserRole, hasPermission, PERMISSIONS, ROLES } from "../utils/auth";
import { SlLogout } from 'react-icons/sl';

function Sidebar() {
    const location = useLocation();
    const userRole = getUserRole();

    const menuItems = [
        {
            path: "/dashboard",
            icon: <RxDashboard />,
            label: "Dashboard",
            permission: PERMISSIONS.VIEW_DASHBOARD
        },
        {
            path: "/reports",
            icon: <LuChartSpline />,
            label: "Reports",
            permission: PERMISSIONS.VIEW_REPORTS
        },
        {
            path: "/clients",
            icon: <BiBuildings />,
            label: "Clients",
            permission: PERMISSIONS.VIEW_ALL_CLIENTS,
            adminOnly: true
        },
        {
            path: "/vendors",
            icon: <IoCarSportOutline />,
            label: "Vendors",
            permission: PERMISSIONS.MANAGE_VENDORS,
            adminOnly: true
        },
        {
            path: "/trips",
            icon: <FaRoute />,
            label: "Trips",
            permission: PERMISSIONS.MANAGE_TRIPS
        },
        {
            path: "/employees",
            icon: <FaUsers />,
            label: "Employees",
            permission: PERMISSIONS.VIEW_ALL_EMPLOYEES,
            adminOnly: true
        },
        {
            path: "/billing",
            icon: <FaFileInvoiceDollar />,
            label: "Billing",
            permission: PERMISSIONS.MANAGE_BILLING,
            adminOnly: true
        }
    ];

    const visibleMenuItems = menuItems.filter(item => {
        if (item.adminOnly && userRole !== ROLES.ADMIN) return false;
        return hasPermission(userRole, item.permission);
    });

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img
                    src="/moveinsync-logo.jpg"
                    alt="MoveInSync logo"
                    className="moveinsync-logo"
                    style={{ maxWidth: '160px', height: 'auto', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '12px', marginTop: '5px' }}>Unified Billing & Reporting</p>
                <div className="user-role-badge">
                    {userRole}
                </div>
            </div>
            <ul className="sidebar-menu">
                {visibleMenuItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
                <li>
                    <a href="#" onClick={logout} className='logout-ref'>
                        <SlLogout />
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
