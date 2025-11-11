import React, { useState, useEffect } from 'react';
import { getTrips } from '../services/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trips:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Trips</h1>
      </div>

      <div className="table-card">
        <h3>All Trips ({trips.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Trip Code</th>
                <th>Date & Time</th>
                <th>Vendor</th>
                <th>Employee</th>
                <th>Route</th>
                <th>Distance</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td><strong>{trip.tripCode}</strong></td>
                  <td>{formatDate(trip.tripDate)}</td>
                  <td>{trip.vendor?.name || 'N/A'}</td>
                  <td>{trip.employee?.name || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaMapMarkerAlt style={{ color: '#4CAF50', fontSize: '12px' }} />
                      <span style={{ fontSize: '13px' }}>
                        {trip.source} → {trip.destination}
                      </span>
                    </div>
                  </td>
                  <td>{trip.distanceKm} km</td>
                  <td>{trip.durationHours} hrs</td>
                  <td>
                    <span className={`badge ${trip.processed ? 'badge-success' : 'badge-warning'}`}>
                      {trip.processed ? 'Processed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Trips;
