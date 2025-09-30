import React from 'react';
import PropTypes from 'prop-types';

const TransactionReport = ({ onNotificationClick }) => {
  const handleNotificationClick = (msg) => {
    const parts = msg.split(' - ');
    const notificationData = {
      message: parts[0],
      date: parts[1],
      type: msg.includes('Approved') ? 'Approval' :
            msg.includes('Rejected') ? 'Rejection' : 'Completion'
    };
    onNotificationClick(notificationData);
  };

  const containerStyle = {
    marginTop: '1rem',
    padding: '1.5rem',
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

  const tableWrapperStyle = {
    position: 'relative'
  };

  const tableScrollStyle = {
    overflowY: 'auto',
    maxHeight: '210px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '0.25rem 0.75rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const tdStyle = {
    padding: '0.25rem 0.75rem',
    color: '#444444',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.03)'
  };

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
    textDecoration: 'none'
  };

  const listItemHoverStyle = {
    textDecoration: 'underline'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Transaction Report</h2>
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
                {[
                  ['07 Jun 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['31 May 2025', 'closing stock', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['30 May 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['07 Jun 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['31 May 2025', 'closing stock', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['30 May 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['07 Jun 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['31 May 2025', 'closing stock', 'VASHI HO', 'VASHI WAREHOUSE'],
                  ['30 May 2025', 'indent', 'VASHI HO', 'VASHI WAREHOUSE'],
                ].map(([date, type, center, parent], idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{date}</td>
                    <td style={tdStyle}>{type}</td>
                    <td style={tdStyle}>{center}</td>
                    <td style={tdStyle}>{parent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
        <h2 style={headingStyle}>Last Notification</h2>
        <ul style={notificationListStyle}>
          {[
            'Your indent Request No.VASHOVASHIHO/0625/4 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent Request No.VASHI/006256 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent No.VASHI/006258 had been Rejected by VASHI WAREHOUSE - 07 Jun 2025',
            'Your indent Request No.VASHI/006255 had been Completed From VASHI WAREHOUSE - 07 Jun 2025',
            'Your indent Request No.VASHOVASHIHO/0625/4 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent Request No.VASHI/006256 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent No.VASHI/006258 had been Rejected by VASHI WAREHOUSE - 07 Jun 2025',
            'Your indent Request No.VASHI/006255 had been Completed From VASHI WAREHOUSE - 07 Jun 2025',
            'Your indent Request No.VASHOVASHIHO/0625/4 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent Request No.VASHI/006256 had been Approved by VASHI WAREHOUSE - 23 Jun 2025',
            'Your indent No.VASHI/006258 had been Rejected by VASHI WAREHOUSE - 07 Jun 2025',
            'Your indent Request No.VASHI/006255 had been Completed From VASHI WAREHOUSE - 07 Jun 2025',
          ].map((msg, i) => (
            <li
              key={i}
              style={listItemStyle}
              onClick={() => handleNotificationClick(msg)}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

TransactionReport.propTypes = {
  onNotificationClick: PropTypes.func.isRequired,
};

export default TransactionReport;
