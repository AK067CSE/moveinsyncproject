import React, { useState } from 'react';
import { FaMoneyBillWave, FaCog } from 'react-icons/fa';
import BillingProcess from '../components/BillingProcess';
import BillingConfiguration from '../components/BillingConfiguration';

function Billing() {
  const [activeTab, setActiveTab] = useState('process'); // 'process' or 'config'

  return (
    <div>
      <div className="header">
        <h1>Billing Management</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'process' ? 'active' : ''}`}
          onClick={() => setActiveTab('process')}
        >
          <FaMoneyBillWave style={{ marginRight: '8px' }} />
          Process Billing
        </button>
        <button
          className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <FaCog style={{ marginRight: '8px' }} />
          Billing Configuration
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'process' ? <BillingProcess /> : <BillingConfiguration />}
      </div>
    </div>
  );
}

export default Billing;
