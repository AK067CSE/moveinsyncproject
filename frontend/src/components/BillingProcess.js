import React, { useState, useEffect } from 'react';
import { processBilling } from '../services/api';
import { getVendors } from '../services/api';

function BillingProcess() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Fetch vendors on component mount
  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (err) {
      console.error('Error loading vendors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await processBilling(vendorId, month, year);
      setResult(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing billing');
      setLoading(false);
    }
  };

  return (
    <div className="table-card">
      <h3>Process Vendor Billing</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          
          {/* Vendor Dropdown */}
          <div className="form-group">
            <label>Select Vendor</label>
            <select
              className="form-control"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            >
              <option value="">Choose a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.vendorCode})
                </option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div className="form-group">
            <label>Month</label>
            <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="form-group">
            <label>Year</label>
            <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Processing...' : 'Process Billing'}
        </button>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: '20px' }}>{error}</div>}

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h4>Billing Result</h4>
          <div className="stats-grid" style={{ marginTop: '20px' }}>
            <div className="stat-card">
              <div className="stat-label">Vendor</div>
              <div className="stat-value" style={{ fontSize: '18px' }}>{result.vendor?.name || 'N/A'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Trips</div>
              <div className="stat-value" style={{ fontSize: '24px' }}>{result.totalTrips || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Distance</div>
              <div className="stat-value" style={{ fontSize: '24px' }}>{result.totalDistance || 0} km</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Amount</div>
              <div className="stat-value" style={{ fontSize: '24px', color: 'var(--primary-teal)' }}>
                ₹{result.totalAmount?.toLocaleString('en-IN') || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingProcess;
