// import React from 'react'
// import { useTranslation } from 'react-i18next'
// import {
//   CBadge,
//   CDropdown,
//   CDropdownHeader,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react-pro'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBell,
// } from '@coreui/icons'
// const AppHeaderDropdownNotif = () => {
//   const { t } = useTranslation()
//   const itemsCount = 5
//   return (
//     <CDropdown variant="nav-item" alignment="end">
//       <CDropdownToggle caret={false}>

//   <span className="d-inline-block my-1 mx-2 position-relative">
//     <CIcon icon={cilBell} size="lg" className="text-white" />

//     <CBadge position="top-end" shape="rounded-circle" className="p-1">
//       <span className="visually-hidden">{itemsCount} new alerts</span>
//     </CBadge>
//   </span>
// </CDropdownToggle>
//       <CDropdownMenu className="py-0">
//         <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
//           {t('notificationsCounter', { counter: itemsCount })}
//         </CDropdownHeader>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default AppHeaderDropdownNotif


import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownItem,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilBell, cilClock } from '@coreui/icons'
import axiosInstance from 'src/axiosInstance'

const AppHeaderDropdownNotif = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
      return 'Just now';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get('/stockrequest/notification');
        if (res.data.success) {
          setNotifications(res.data.data || []);
          setUnreadCount(res.data.data?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.stockRequestId) {
      navigate(`/stockRequest-profile/${notification.stockRequestId}`);
    }
  };

  const handleViewAll = () => {
    navigate('/stock-requests');
  };

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilBell} size="lg" className="text-white" />
          {unreadCount > 0 && (
            <CBadge 
              position="top-end" 
              shape="rounded-circle" 
              className="p-1"
              color="danger"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
              <span className="visually-hidden">{unreadCount} new notifications</span>
            </CBadge>
          )}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" style={{ width: '360px' }}>
        {loading ? (
          <CDropdownItem>
            <div className="text-center py-2">
              <small className="text-muted">Loading notifications...</small>
            </div>
          </CDropdownItem>
        ) : notifications.length > 0 ? (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <CDropdownItem 
                key={notification.id} 
                className="border-bottom"
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-100">
                  <div className="text-wrap " style={{ lineHeight: '1.3' ,fontSize:'14px'}}>
                    {notification.message}
                  </div>
                  <div className="d-flex justify-content-end w-100">
                    <div className="d-flex align-items-center">
                      <CIcon 
                        icon={cilClock} 
                        className="text-muted me-1" 
                        size="sm" 
                      />
                      <small className="text-muted">
                        {getTimeAgo(notification.timestamp || notification.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
              </CDropdownItem>
            ))}
            
            {notifications.length > 5 && (
              <CDropdownItem 
                className="text-center border-top"
                onClick={handleViewAll}
                style={{ cursor: 'pointer' }}
              >
                <small className="text-primary">
                  View all {notifications.length} notifications
                </small>
              </CDropdownItem>
            )}
          </>
        ) : (
          <CDropdownItem>
            <div className="text-center py-2">
              <small className="text-muted">No notifications</small>
            </div>
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif