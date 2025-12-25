import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';

const TransactionReport = ({ onNotificationClick }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get('/availableStock/transactions');
        if (res.data.success) {
          setTransactions(res.data.data || []);
          setSummary(res.data.summary || null);
        } else {
          setError('Failed to load data.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching transaction data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get('/stockrequest/notification');
        if (res.data.success) {
          setNotifications(res.data.data || []);
        } else {
          console.error('Failed to load notifications');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchTransactions();
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.stockRequestId) {
      navigate(`/stockRequest-profile/${notification.stockRequestId}`);
    }
    if (onNotificationClick) {
      const parts = notification.message.split(' - ');
      const notificationData = {
        message: parts[0],
        date: parts[1],
        type: notification.message.includes('Approved') ? 'Approval' :
              notification.message.includes('Rejected') ? 'Rejection' : 
              notification.message.includes('Completed') ? 'Completion' : 'Update'
      };
      onNotificationClick(notificationData);
    }
  };

  const containerStyle = {
    marginTop: '1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    transition: 'all 0.3s ease'
  };
  const cardStyle = {
    backgroundColor: 'white',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderTop: '3px solid #2759A2'
  };
  const headingStyle = {
    fontWeight: '300',
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    paddingLeft: '0.75rem',
    color: '#444444'
  };
  const tableWrapperStyle = { position: 'relative' };
  const tableScrollStyle = { overflowY: 'auto', maxHeight: '250px' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const thStyle = {
    textAlign: 'left',
    padding: '0.20rem 0.70rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    fontWeight: 700,
    position: 'sticky',
    top: 0,
    zIndex: 2
  };
  
  const tdStyle = { padding: '0.25rem 0.75rem', color: '#444444', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.03)' };
  const notificationListStyle = { 
    fontSize: '0.875rem', 
    overflowY: 'auto', 
    maxHeight: '240px', 
    color: '#3c8dbc', 
    listStyleType: 'none', 
    padding: 0, 
    margin: 0 
  };
  const listItemStyle = { 
    boxShadow: '0 1px 1px rgba(0,0,0,0.05)', 
    cursor: 'pointer', 
    padding: '4px 0', 
    textDecoration: 'none',
    borderBottom: '1px solid #f0f0f0',
    transition: 'all 0.2s ease'
  };
  const loadingStyle = {
    padding: '0.5rem 0.75rem',
    color: '#666',
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle}>

      <div style={cardStyle}>
        <h2 style={headingStyle}>Transaction Report</h2>

        {loading ? (
          <p style={{ paddingLeft: '1rem' }}>Loading...</p>
        ) : error ? (
          <p style={{ paddingLeft: '1rem', color: 'red' }}>{error}</p>
        ) : (
          <>
            <div style={tableWrapperStyle}>
              <div style={tableScrollStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Type</th>
                      <th style={thStyle}>Center</th>
                      <th style={thStyle}>Parent Center</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t) => (
                        <tr key={t._id}>
                          <td style={tdStyle}>{t.Date}</td>
                          <td style={tdStyle}>{t.Type}</td>
                          <td style={tdStyle}>{t.Center}</td>
                          <td style={tdStyle}></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ ...tdStyle, textAlign: 'center' }}>
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ ...cardStyle, paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
        <h2 style={headingStyle}>Last Notification</h2>
        <ul style={notificationListStyle}>
          {notificationsLoading ? (
            <li style={loadingStyle}>Loading notifications...</li>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={notification.id || index}
                style={listItemStyle}
                onClick={() => handleNotificationClick(notification)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f4f4f4';

                }}
                // onMouseOut={(e) => {
                //   e.currentTarget.style.textDecoration = 'none';
                //   e.currentTarget.style.backgroundColor = 'transparent';
                //   e.currentTarget.style.paddingLeft = '0';
                // }}
              >
                {notification.message}
              </li>
            ))
          ) : (
            <li style={loadingStyle}>No recent notifications</li>
          )}
        </ul>
      </div>
    </div>
  );
};

TransactionReport.propTypes = {
  onNotificationClick: PropTypes.func,
};

TransactionReport.defaultProps = {
  onNotificationClick: () => {},
};

export default TransactionReport;