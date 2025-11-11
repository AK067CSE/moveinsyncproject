import React, { useState, useEffect } from 'react';
import { FaBuilding, FaTruck, FaUsers, FaRoute } from 'react-icons/fa';
import { getClients, getVendors, getEmployees, getTrips } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BiBuildings } from 'react-icons/bi';
import { IoCarSportOutline } from 'react-icons/io5';

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    vendors: 0,
    employees: 0,
    trips: 0
  });
  const [chartData, setChartData] = useState({
    tripsByVendor: [],
    tripsByStatus: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clients, vendors, employees, trips] = await Promise.all([
        getClients(),
        getVendors(),
        getEmployees(),
        getTrips()
      ]);

      setStats({
        clients: clients.length,
        vendors: vendors.length,
        employees: employees.length,
        trips: trips.length
      });

      // Process chart data
      processChartData(trips, vendors);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const processChartData = (trips, vendors) => {
    // Trips by Vendor
    const vendorMap = {};
    trips.forEach(trip => {
      const vendorName = trip.vendor?.name || 'Unknown';
      vendorMap[vendorName] = (vendorMap[vendorName] || 0) + 1;
    });
    const tripsByVendor = Object.entries(vendorMap).map(([name, count]) => ({
      name,
      trips: count
    }));

    // Trips by Status
    const processed = trips.filter(t => t.processed).length;
    const pending = trips.filter(t => !t.processed).length;
    const tripsByStatus = [
      { name: 'Processed', value: processed },
      { name: 'Pending', value: pending }
    ];

    // Monthly trends (mock data - you'd calculate from actual trip dates)
    const monthlyTrends = [
      { month: 'Jan', trips: 45 },
      { month: 'Feb', trips: 52 },
      { month: 'Mar', trips: 48 },
      { month: 'Apr', trips: 61 },
      { month: 'May', trips: 55 },
      { month: 'Jun', trips: 67 }
    ];

    setChartData({ tripsByVendor, tripsByStatus, monthlyTrends });
  };

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <span style={{ color: '#ffffffff' }}>Welcome, {sessionStorage.getItem('user')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-value">{stats.clients}</div>
              <div className="stat-label">Total Clients</div>
            </div>
            <div className="stat-icon green">
              <BiBuildings />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#4CAF50' }}>
            ↑ Active clients in system
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-value">{stats.vendors}</div>
              <div className="stat-label">Total Vendors</div>
            </div>
            <div className="stat-icon blue">
              <IoCarSportOutline />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#2196F3' }}>
            ↑ Transportation partners
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-value">{stats.employees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-icon orange">
              <FaUsers />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#FF9800' }}>
            ↑ Employee travelers
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-value">{stats.trips}</div>
              <div className="stat-label">Total Trips</div>
            </div>
            <div className="stat-icon purple">
              <FaRoute />
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#9C27B0' }}>
            ↑ Trips completed
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>

        {/* Trips by Vendor */}
        <div className="table-card">
          <h3>Trips by Vendor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.tripsByVendor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="trips" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trip Status Distribution */}
        <div className="table-card">
          <h3>Trip Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.tripsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.tripsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="table-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Monthly Trip Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trips" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPIs Section */}
      {/* <div className="table-card" style={{ marginTop: '20px' }}>
        <h3>Key Performance Indicators</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', background: '#E8F5E9', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#2E7D32', marginBottom: '5px' }}>Avg Trips/Day</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
              {Math.round(stats.trips / 30)}
            </div>
          </div>
          <div style={{ padding: '15px', background: '#E3F2FD', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#1565C0', marginBottom: '5px' }}>Processing Rate</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196F3' }}>
              {chartData.tripsByStatus[0] ?
                Math.round((chartData.tripsByStatus[0].value / stats.trips) * 100) : 0}%
            </div>
          </div>
          <div style={{ padding: '15px', background: '#FFF3E0', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#E65100', marginBottom: '5px' }}>Active Vendors</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF9800' }}>
              {stats.vendors}
            </div>
          </div>
          <div style={{ padding: '15px', background: '#F3E5F5', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6A1B9A', marginBottom: '5px' }}>Clients Served</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#9C27B0' }}>
              {stats.clients}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
