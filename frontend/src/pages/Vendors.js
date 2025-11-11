import React, { useState, useEffect } from 'react';
import { getVendors } from '../services/api';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vendors:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Vendors</h1>
      </div>

      <div className="table-card">
        <h3>All Vendors ({vendors.length})</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Vendor Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td><strong>{vendor.vendorCode}</strong></td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.address}</td>
                <td>{vendor.client?.name || 'N/A'}</td>
                <td>
                  <span className={`badge ${vendor.active ? 'badge-success' : 'badge-warning'}`}>
                    {vendor.active ? 'Active' : 'Inactive'}
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

export default Vendors;
