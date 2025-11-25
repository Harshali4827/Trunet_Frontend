import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axiosInstance from 'src/axiosInstance';

const IndentCard = () => {
  const [centerCount, setCenterCount] = useState(0);
  const [indentSummary, setIndentSummary] = useState({
    totalRequests: 0,
    completed: 0,
    incomplete: 0,
  });
  const [loading, setLoading] = useState(true);

  const containerStyle = { transition: 'all 0.3s ease' };
  const headingStyle = { fontSize: '1.5rem', color: '#333333', fontWeight: '300', marginBottom: '0.75rem' };
  const cardsContainerStyle = { display: 'flex', gap: '1rem', flexWrap: 'wrap' };
  const cardStyle = { display: 'flex', width: '18.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', backgroundColor: 'white' };
  const leftSectionStyle = { backgroundColor: '#00A65A', padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const centerLeft = { backgroundColor: '#00c0ef', padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const iconStyle = { color: 'white', fontSize: '40px' };
  const rightSectionStyle = { backgroundColor: 'white', color: 'black', paddingLeft: '0.75rem', paddingTop: '0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
  const linkStyle = { fontSize: '0.875rem', color: '#3C8DBC', textDecoration: 'none' };
  const linkHoverStyle = { color: '#72AFDB' };
  const countTextStyle = { fontSize: '1.125rem', fontWeight: 'bold', color: '#333333' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centerRes = await axiosInstance.get('/centers');
        if (centerRes.data.success) {
          setCenterCount(centerRes.data.pagination.totalItems);
        }

        const indentRes = await axiosInstance.get('/stockrequest/indent-count');
        if (indentRes.data.success) {
          setIndentSummary({
            totalRequests: indentRes.data.totalRequests || 0,
            completed: indentRes.data.completed || 0,
            incomplete: indentRes.data.incomplete || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Dashboard</h2>

      <div style={cardsContainerStyle}>
        <div style={cardStyle}>
          <div style={centerLeft}>
            <i className='fa fa-users' style={iconStyle}></i>
          </div>

          <div style={rightSectionStyle}>
            <Link
              to="/center-list"
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = linkHoverStyle.color)}
              onMouseLeave={e => (e.target.style.color = linkStyle.color)}
            >
              CENTERS
            </Link>
            <div style={countTextStyle}>
              {loading ? 'Loading...' : centerCount}
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={leftSectionStyle}>
            <FontAwesomeIcon icon={faCartShopping} size="2x" style={iconStyle} />
          </div>

          <div style={rightSectionStyle}>
            <Link
              to="/order/index/indent"
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = linkHoverStyle.color)}
              onMouseLeave={e => (e.target.style.color = linkStyle.color)}
            >
              TOTAL INDENT
            </Link>
            <div style={countTextStyle}>
              {loading
                ? 'Loading...'
                : `${indentSummary.totalRequests}/${indentSummary.completed}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndentCard;
