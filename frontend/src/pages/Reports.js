import React, { useState, useEffect } from 'react';
import { getClientReport, getVendorReport, getEmployeeReport, getClients, getVendors, getEmployees, getSelfVendorReport, getSelfEmployeeReport, default as apiClient } from '../services/api';
import { getUserRole, ROLES } from '../utils/auth';
import { FaChartBar, FaFileDownload, FaFilePdf } from 'react-icons/fa';
import { downloadReportPDF } from '../utils/reportPdfGenerator';

function Reports() {
  // Set reportType based on role at mount
  const initialReportType = (() => {
    const role = getUserRole();
    if (role === ROLES.ADMIN) return 'client';
    if (role === ROLES.EMPLOYEE) return 'employee';
    return 'vendor';
  })();
  const [reportType, setReportType] = useState(initialReportType);
  const [entities, setEntities] = useState([]);
  const [entityId, setEntityId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only load entity lists for admin users. Non-admins will see their own vendor report.
    if (getUserRole() === ROLES.ADMIN) {
      loadEntities();
      setEntityId('');
      setReport(null);
    }
  }, [reportType]);

  useEffect(() => {
    // Only clear report selection for admin flows where entity selection matters
    if (getUserRole() === ROLES.ADMIN) {
      setReport(null);
    }
  }, [entityId]);

  const loadEntities = async () => {
    try {
      let data;
      if (reportType === 'client') {
        data = await getClients();
      } else if (reportType === 'vendor') {
        data = await getVendors();
      } else {
        data = await getEmployees();
      }
      setEntities(data);
    } catch (err) {
      console.error('Error loading entities:', err);
    }
  };

  // Fetch the current user's self report for non-admin users
  const fetchSelfReport = async (m, y) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (getUserRole() === ROLES.VENDOR) {
        data = await getSelfVendorReport(m, y);
      } else if (getUserRole() === ROLES.EMPLOYEE) {
        data = await getSelfEmployeeReport(m, y);
      } else {
        // fallback: treat as vendor
        data = await getSelfVendorReport(m, y);
      }
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching your report');
    }
    setLoading(false);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);

    try {
      let data;
      if (reportType === 'client') {
        data = await getClientReport(entityId, month, year);
      } else if (reportType === 'vendor') {
        data = await getVendorReport(entityId, month, year);
      } else {
        data = await getEmployeeReport(entityId, month, year);
      }
      setReport(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating report');
      setLoading(false);
    }
  };

  // When component mounts, if user is not admin fetch their self report automatically
  useEffect(() => {
    if (getUserRole() !== ROLES.ADMIN) {
      // fetch the self report for the currently selected month/year
      fetchSelfReport(month, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadReport = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${month}-${year}.json`;
    link.click();
  };

  const downloadPDF = () => {
    // Get entity name for client reports
    let entityName = '';
    if (reportType === 'client' && entityId) {
      const client = entities.find(e => e.id === parseInt(entityId));
      entityName = client?.name || '';
    }
    
    const success = downloadReportPDF(reportType, report, entityName);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const getEntityLabel = () => {
    switch(reportType) {
      case 'client': return 'Select Client';
      case 'vendor': return 'Select Vendor';
      case 'employee': return 'Select Employee';
      default: return 'Select Entity';
    }
  };

  const getEntityDisplayName = (entity) => {
    if (reportType === 'client') return `${entity.name} (${entity.clientCode})`;
    if (reportType === 'vendor') return `${entity.name} (${entity.vendorCode})`;
    return `${entity.name} (${entity.employeeCode})`;
  };

  return (
    <div>
      <div className="header">
        <h1>Reports</h1>
      </div>

      {/* Report Generation Form - only for admin */}
      {getUserRole() === ROLES.ADMIN && (
        <div className="table-card" style={{ marginBottom: '30px' }}>
          <h3><FaChartBar style={{ marginRight: '10px', color: 'var(--primary-teal)' }} />Generate Report</h3>
          <form onSubmit={handleGenerateReport} style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label>Report Type</label>
                <select
                  className="form-control"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="client">Client Report</option>
                  <option value="vendor">Vendor Report</option>
                  <option value="employee">Employee Incentive</option>
                </select>
              </div>
              <div className="form-group">
                <label>{getEntityLabel()}</label>
                <select
                  className="form-control"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  required
                >
                  <option value="">Choose {reportType}</option>
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {getEntityDisplayName(entity)}
                    </option>
                  ))}
                </select>
              </div>
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
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Report Display */}
      {report && (
        <div className="table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Report Summary</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={downloadPDF} title="Download as PDF">
                <FaFilePdf style={{ marginRight: '8px' }} />
                Download PDF
              </button>
              <button className="btn-secondary" onClick={downloadReport} title="Download as JSON">
                <FaFileDownload style={{ marginRight: '8px' }} />
                Download JSON
              </button>
            </div>
          </div>

          {/* CLIENT REPORT */}
          {reportType === 'client' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Client</div>
                  <div className="stat-value" style={{ fontSize: '20px' }}>
                    {entities.find(e => e.id === parseInt(entityId))?.name || 'N/A'}
                  </div>
                  {/* <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    ID: {report.clientId}
                  </div> */}
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Trips</div>
                  <div className="stat-value" style={{ fontSize: '24px' }}>{report.totalTrips}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Period</div>
                  <div className="stat-value" style={{ fontSize: '20px' }}>
                    {new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} {report.year}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Amount</div>
                  <div className="stat-value" style={{ fontSize: '24px', color: 'var(--primary-teal)' }}>
                    ₹{report.totalAmount?.toLocaleString('en-IN') || 0}
                  </div>
                </div>
              </div>

              {report.vendorReports && report.vendorReports.length > 0 && (
                <>
                  <h4 style={{ marginTop: '30px', marginBottom: '15px' }}>Vendor Breakdown</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>Total Trips</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.vendorReports.map((vendor, index) => (
                        <tr key={index}>
                          <td><strong>{vendor.vendorName}</strong></td>
                          <td>{vendor.totalTrips}</td>
                          <td style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
                            ₹{vendor.totalAmount?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}

          {/* VENDOR REPORT */}
          {reportType === 'vendor' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Vendor</div>
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {report.vendorName || 'N/A'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Trips</div>
                  <div className="stat-value" style={{ fontSize: '24px' }}>{report.totalTrips || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Distance</div>
                  <div className="stat-value" style={{ fontSize: '24px' }}>
                    {report.totalDistance || 0} km
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Amount</div>
                  <div className="stat-value" style={{ fontSize: '24px', color: 'var(--primary-teal)' }}>
                    ₹{report.totalAmount?.toLocaleString('en-IN') || 0}
                  </div>
                </div>
              </div>

              <table className="data-table" style={{ marginTop: '20px' }}>
                <tbody>
                  <tr>
                    <td><strong>Billing Period</strong></td>
                    <td>
                      {new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} {report.year}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Base Billing</strong></td>
                    <td>₹{report.baseBilling?.toLocaleString('en-IN') || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Incentives</strong></td>
                    <td>₹{report.totalIncentives?.toLocaleString('en-IN') || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Duration</strong></td>
                    <td>{report.totalDuration || 0} hours</td>
                  </tr>
                  <tr style={{ background: 'rgba(45, 212, 191, 0.1)' }}>
                    <td><strong>Final Amount</strong></td>
                    <td style={{ color: 'var(--primary-teal)', fontSize: '18px', fontWeight: '700' }}>
                      ₹{report.totalAmount?.toLocaleString('en-IN') || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {/* EMPLOYEE REPORT */}
          {reportType === 'employee' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Employee</div>
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {report.employeeName || 'N/A'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Trips</div>
                  <div className="stat-value" style={{ fontSize: '24px' }}>{report.totalTrips || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Extra Hours</div>
                  <div className="stat-value" style={{ fontSize: '24px' }}>
                    {report.totalExtraHours || 0} hrs
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Incentive</div>
                  <div className="stat-value" style={{ fontSize: '24px', color: 'var(--primary-teal)' }}>
                    ₹{report.totalIncentive?.toLocaleString('en-IN') || 0}
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(45, 212, 191, 0.1)', 
                padding: '30px', 
                borderRadius: '12px',
                marginTop: '30px',
                textAlign: 'center',
                border: '2px solid var(--primary-teal)'
              }}>
                <h4 style={{ color: 'var(--primary-teal)', marginBottom: '15px', fontSize: '18px' }}>
                  Total Incentive Earned
                </h4>
                <div style={{ fontSize: '42px', fontWeight: '700', color: 'var(--primary-teal)' }}>
                  ₹{report.totalIncentive?.toLocaleString('en-IN') || 0}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '15px', fontSize: '14px' }}>
                  For {new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} {report.year}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
