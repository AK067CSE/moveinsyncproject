import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading employees:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Employees</h1>
      </div>

      <div className="table-card">
        <h3>All Employees ({employees.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td><strong>{employee.employeeCode}</strong></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.client?.name || 'N/A'}</td>
                <td>
                  <span className={`badge ${employee.active ? 'badge-success' : 'badge-warning'}`}>
                    {employee.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
