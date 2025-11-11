import React, { useState, useEffect } from 'react';
import { getVendors } from '../services/api';

function BillingConfiguration() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [billingModel, setBillingModel] = useState('PACKAGE');
  const [config, setConfig] = useState({
    monthlyRate: '5000',
    includedKm: '1000',
    extraKmRate: '10.5',
    perKmRate: '12.0',
    perHourRate: '350',
    baseMonthlyRate: '3500',
    effectiveFrom: '2025-11-09'
  });

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

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Vendor:', vendorId);
    console.log('Model:', billingModel);
    console.log('Config:', config);
    alert('Configuration saved successfully!');
  };

  const renderConfigFields = () => {
    switch(billingModel) {
      case 'PACKAGE':
        return (
          <div className="config-section">
            <h4 className="section-title">Package Configuration</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label>Monthly Rate (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={config.monthlyRate}
                  onChange={(e) => handleConfigChange('monthlyRate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Included KM</label>
                <input
                  type="number"
                  className="form-control"
                  value={config.includedKm}
                  onChange={(e) => handleConfigChange('includedKm', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Extra KM Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={config.extraKmRate}
                  onChange={(e) => handleConfigChange('extraKmRate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'HYBRID':
        return (
          <div className="config-section">
            <h4 className="section-title">Hybrid Configuration</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label>Base Monthly Rate (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={config.baseMonthlyRate}
                  onChange={(e) => handleConfigChange('baseMonthlyRate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Included KM</label>
                <input
                  type="number"
                  className="form-control"
                  value={config.includedKm}
                  onChange={(e) => handleConfigChange('includedKm', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Extra KM Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={config.extraKmRate}
                  onChange={(e) => handleConfigChange('extraKmRate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'TRIP':
        return (
          <div className="config-section">
            <h4 className="section-title">Trip Configuration</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label>Per KM Rate (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={config.perKmRate}
                  onChange={(e) => handleConfigChange('perKmRate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Per Hour Rate (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={config.perHourRate}
                  onChange={(e) => handleConfigChange('perHourRate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="table-card">
      <h3>Billing Configuration</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        
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

        {/* Billing Model */}
        <div className="form-group">
          <label>Billing Model</label>
          <select 
            className="form-control form-control-highlighted"
            value={billingModel}
            onChange={(e) => setBillingModel(e.target.value)}
          >
            <option value="PACKAGE">Package (Fixed + Overage)</option>
            <option value="HYBRID">Hybrid (Base + Variable)</option>
            <option value="TRIP">Trip (Per KM/Hour)</option>
          </select>
        </div>

        {renderConfigFields()}

        <div className="form-group">
          <label>Effective From</label>
          <input
            type="date"
            className="form-control"
            value={config.effectiveFrom}
            onChange={(e) => handleConfigChange('effectiveFrom', e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>
          Save Configuration
        </button>
      </form>
    </div>
  );
}

export default BillingConfiguration;
