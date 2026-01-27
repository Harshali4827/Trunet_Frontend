// import React, { useState, useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'
// import {
//   CBadge,
//   CDropdown,
//   CDropdownHeader,
//   CDropdownMenu,
//   CDropdownToggle,
//   CDropdownItem,
// } from '@coreui/react-pro'
// import CIcon from '@coreui/icons-react'
// import { cilBell, cilClock } from '@coreui/icons'
// import axiosInstance from 'src/axiosInstance'

// const AppHeaderDropdownNotif = () => {
//   const { t } = useTranslation()
//   const navigate = useNavigate()
//   const [notifications, setNotifications] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [unreadCount, setUnreadCount] = useState(0)

//   const getTimeAgo = (timestamp) => {
//     if (!timestamp) return '';
    
//     const date = new Date(timestamp);
//     const now = new Date();
//     const seconds = Math.floor((now - date) / 1000);
    
//     if (seconds < 60) {
//       return 'Just now';
//     }
    
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) {
//       return `${minutes} min ago`;
//     }
    
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) {
//       return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     }
    
//     const days = Math.floor(hours / 24);
//     if (days < 7) {
//       return `${days} day${days > 1 ? 's' : ''} ago`;
//     }
    
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) {
//       return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
//     }
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await axiosInstance.get('/stockrequest/notification');
//         if (res.data.success) {
//           setNotifications(res.data.data || []);
//           setUnreadCount(res.data.data?.length || 0);
//         }
//       } catch (err) {
//         console.error('Error fetching notifications:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleNotificationClick = (notification) => {
//     if (notification.stockRequestId) {
//       navigate(`/stockRequest-profile/${notification.stockRequestId}`);
//     }
//   };

//   const handleViewAll = () => {
//     navigate('/stock-requests');
//   };

//   return (
//     <CDropdown variant="nav-item" alignment="end">
//       <CDropdownToggle caret={false}>
//         <span className="d-inline-block my-1 mx-2 position-relative">
//           <CIcon icon={cilBell} size="lg" className="text-white" />
//           {unreadCount > 0 && (
//             <CBadge 
//               position="top-end" 
//               shape="rounded-circle" 
//               className="p-1"
//               color="danger"
//             >
//               {unreadCount > 9 ? '9+' : unreadCount}
//               <span className="visually-hidden">{unreadCount} new notifications</span>
//             </CBadge>
//           )}
//         </span>
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" style={{ width: '360px' }}>
//         {loading ? (
//           <CDropdownItem>
//             <div className="text-center py-2">
//               <small className="text-muted">Loading notifications...</small>
//             </div>
//           </CDropdownItem>
//         ) : notifications.length > 0 ? (
//           <>
//             {notifications.slice(0, 5).map((notification) => (
//               <CDropdownItem 
//                 key={notification.id} 
//                 className="border-bottom"
//                 onClick={() => handleNotificationClick(notification)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <div className="w-100">
//                   <div className="text-wrap " style={{ lineHeight: '1.3' ,fontSize:'14px'}}>
//                     {notification.message}
//                   </div>
//                   <div className="d-flex justify-content-end w-100">
//                     <div className="d-flex align-items-center">
//                       <CIcon 
//                         icon={cilClock} 
//                         className="text-muted me-1" 
//                         size="sm" 
//                       />
//                       <small className="text-muted">
//                         {getTimeAgo(notification.timestamp || notification.createdAt)}
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//               </CDropdownItem>
//             ))}
            
//             {notifications.length > 5 && (
//               <CDropdownItem 
//                 className="text-center border-top"
//                 onClick={handleViewAll}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <small className="text-primary">
//                   View all {notifications.length} notifications
//                 </small>
//               </CDropdownItem>
//             )}
//           </>
//         ) : (
//           <CDropdownItem>
//             <div className="text-center py-2">
//               <small className="text-muted">No notifications</small>
//             </div>
//           </CDropdownItem>
//         )}
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default AppHeaderDropdownNotif



////********************* show all notification*************/




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
    navigate('/stock-request');
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
      <CDropdownMenu 
        className="pt-0" 
        style={{ 
          width: '400px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}
      >
        <CDropdownHeader className="bg-light fw-semibold py-2 sticky-top" style={{ zIndex: 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <span>Notifications</span>
            <CBadge color="primary" className="ms-2">
              {notifications.length}
            </CBadge>
          </div>
        </CDropdownHeader>
        
        {loading ? (
          <CDropdownItem className="text-center py-3">
            <div className="d-flex justify-content-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Loading notifications...</span>
            </div>
          </CDropdownItem>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification, index) => (
              <CDropdownItem 
                key={notification.id || index} 
                className="border-bottom py-2"
                onClick={() => handleNotificationClick(notification)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: notification.isRead ? 'transparent' : '#f8f9fa'
                }}
              >
                <div className="w-100">
                  <div className="d-flex align-items-start">
                    <div className="me-2 mt-1">
                      <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                        style={{ width: '8px', height: '8px' }}>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="text-wrap mb-1" style={{ lineHeight: '1.3', fontSize: '14px' }}>
                        {notification.message}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {notification.title || 'Notification'}
                        </small>
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
                  </div>
                </div>
              </CDropdownItem>
            ))}
            
            <CDropdownItem 
              className="text-center py-2 bg-light"
              onClick={handleViewAll}
              style={{ cursor: 'pointer', position: 'sticky', bottom: 0 }}
            >
              <small className="text-primary fw-semibold">
                View All Stock Requests
              </small>
            </CDropdownItem>
          </>
        ) : (
          <CDropdownItem className="text-center py-4">
            <div className="text-muted">
              <CIcon icon={cilBell} className="mb-2" size="xl" />
              <div>No notifications</div>
              <small>You are all caught up!</small>
            </div>
          </CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif



//***********************  remove read notification count *********************************/


// import React, { useState, useEffect, useRef } from 'react'
// import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'
// import {
//   CBadge,
//   CDropdown,
//   CDropdownHeader,
//   CDropdownMenu,
//   CDropdownToggle,
//   CDropdownItem,
// } from '@coreui/react-pro'
// import CIcon from '@coreui/icons-react'
// import { cilBell, cilClock, cilCheck } from '@coreui/icons'
// import axiosInstance from 'src/axiosInstance'

// const AppHeaderDropdownNotif = () => {
//   const { t } = useTranslation()
//   const navigate = useNavigate()
//   const [notifications, setNotifications] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [unreadCount, setUnreadCount] = useState(0)
//   const dropdownRef = useRef(null)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const getTimeAgo = (timestamp) => {
//     if (!timestamp) return '';
    
//     const date = new Date(timestamp);
//     const now = new Date();
//     const seconds = Math.floor((now - date) / 1000);
    
//     if (seconds < 60) {
//       return 'Just now';
//     }
    
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) {
//       return `${minutes} min ago`;
//     }
    
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) {
//       return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     }
    
//     const days = Math.floor(hours / 24);
//     if (days < 7) {
//       return `${days} day${days > 1 ? 's' : ''} ago`;
//     }
    
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) {
//       return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
//     }
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Fetch notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await axiosInstance.get('/stockrequest/notification');
//         if (res.data.success) {
//           const fetchedNotifications = res.data.data || [];
          
//           // Load read status from localStorage
//           const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
          
//           // Mark notifications as read/unread
//           const notificationsWithReadStatus = fetchedNotifications.map(notification => ({
//             ...notification,
//             isRead: readNotifications.includes(notification.id)
//           }));
          
//           setNotifications(notificationsWithReadStatus);
          
//           // Count unread notifications
//           const unread = notificationsWithReadStatus.filter(n => !n.isRead).length;
//           setUnreadCount(unread);
//         }
//       } catch (err) {
//         console.error('Error fetching notifications:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
    
//     // Refresh notifications every 30 seconds
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Mark a single notification as read
//   const markAsRead = (notificationId) => {
//     const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    
//     if (!readNotifications.includes(notificationId)) {
//       readNotifications.push(notificationId);
//       localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      
//       // Update local state
//       setNotifications(prev => 
//         prev.map(notification => 
//           notification.id === notificationId 
//             ? { ...notification, isRead: true }
//             : notification
//         )
//       );
      
//       // Update unread count
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = () => {
//     const allIds = notifications.map(n => n.id).filter(id => id);
//     const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    
//     // Add all notification IDs to read list
//     allIds.forEach(id => {
//       if (!readNotifications.includes(id)) {
//         readNotifications.push(id);
//       }
//     });
    
//     localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    
//     // Update all notifications to read
//     setNotifications(prev => 
//       prev.map(notification => ({ ...notification, isRead: true }))
//     );
    
//     // Reset unread count
//     setUnreadCount(0);
//   };

//   // Mark notifications as read when dropdown is opened
//   useEffect(() => {
//     if (dropdownOpen && unreadCount > 0) {
//       // Mark all as read after 2 seconds of dropdown being open
//       const timer = setTimeout(() => {
//         markAllAsRead();
//       }, 2000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [dropdownOpen]);

//   const handleNotificationClick = (notification) => {
//     // Mark as read when clicked
//     if (notification.id && !notification.isRead) {
//       markAsRead(notification.id);
//     }
    
//     if (notification.stockRequestId) {
//       navigate(`/stockRequest-profile/${notification.stockRequestId}`);
//     }
//   };

//   const handleViewAll = () => {
//     // Mark all as read when viewing all
//     markAllAsRead();
//     navigate('/stock-requests');
//   };

//   return (
//     <CDropdown 
//       variant="nav-item" 
//       alignment="end"
//       visible={dropdownOpen}
//       onShow={() => setDropdownOpen(true)}
//       onHide={() => setDropdownOpen(false)}
//     >
//       <CDropdownToggle caret={false} className="position-relative">
//         <CIcon icon={cilBell} size="lg" className="text-white" />
//         {unreadCount > 0 && (
//           <CBadge 
//             position="top-end" 
//             shape="rounded-circle" 
//             // className="p-1"
//             color="danger"
//             style={{
//               position: 'absolute',
//               top: '7px',
//               right: '-5px',
//               fontSize: '0.6rem',
//               minWidth: '18px',
//               height: '18px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             {unreadCount > 9 ? '9+' : unreadCount}
//             <span className="visually-hidden">{unreadCount} new notifications</span>
//           </CBadge>
//         )}
//       </CDropdownToggle>
//       <CDropdownMenu 
//         className="pt-0" 
//         style={{ 
//           width: '400px',
//           maxHeight: '500px',
//           overflowY: 'auto'
//         }}
//       >
//         <CDropdownHeader className="bg-light fw-semibold py-2 sticky-top" style={{ zIndex: 1 }}>
//           <div className="d-flex justify-content-between align-items-center">
//             <span>Notifications</span>
//             <div className="d-flex align-items-center gap-2">
//               {unreadCount > 0 && (
//                 <CBadge color="danger" className="ms-2">
//                   {unreadCount} new
//                 </CBadge>
//               )}
//               <CBadge color="primary">
//                 {notifications.length} total
//               </CBadge>
//               {unreadCount > 0 && (
//                 <button 
//                   className="btn btn-link btn-sm text-decoration-none p-0 ms-2"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     markAllAsRead();
//                   }}
//                   title="Mark all as read"
//                 >
//                   <CIcon icon={cilCheck} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </CDropdownHeader>
        
//         {loading ? (
//           <CDropdownItem className="text-center py-3">
//             <div className="d-flex justify-content-center">
//               <div className="spinner-border spinner-border-sm" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <span className="ms-2">Loading notifications...</span>
//             </div>
//           </CDropdownItem>
//         ) : notifications.length > 0 ? (
//           <>
//             {notifications.map((notification, index) => (
//               <CDropdownItem 
//                 key={notification.id || index} 
//                 className="border-bottom py-2"
//                 onClick={() => handleNotificationClick(notification)}
//                 style={{ 
//                   cursor: 'pointer',
//                   backgroundColor: notification.isRead ? 'transparent' : '#f0f8ff'
//                 }}
//               >
//                 <div className="w-100">
//                   <div className="d-flex align-items-start">
//                     <div className="me-2 mt-1">
//                       {!notification.isRead && (
//                         <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
//                           style={{ width: '10px', height: '10px' }}>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-grow-1">
//                       <div className="text-wrap mb-1" style={{ lineHeight: '1.3', fontSize: '14px' }}>
//                         {notification.message}
//                       </div>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <small className="text-muted">
//                           {notification.title || 'Notification'}
//                         </small>
//                         <div className="d-flex align-items-center">
//                           <CIcon 
//                             icon={cilClock} 
//                             className="text-muted me-1" 
//                             size="sm" 
//                           />
//                           <small className="text-muted">
//                             {getTimeAgo(notification.timestamp || notification.createdAt)}
//                           </small>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CDropdownItem>
//             ))}
            
//             <CDropdownItem 
//               className="text-center py-2 bg-light border-top"
//               onClick={handleViewAll}
//               style={{ 
//                 cursor: 'pointer', 
//                 position: 'sticky', 
//                 bottom: 0,
//                 zIndex: 1
//               }}
//             >
//               <small className="text-primary fw-semibold">
//                 View All Stock Requests
//               </small>
//             </CDropdownItem>
//           </>
//         ) : (
//           <CDropdownItem className="text-center py-4">
//             <div className="text-muted">
//               <CIcon icon={cilBell} className="mb-2" size="xl" />
//               <div>No notifications</div>
//               <small>You are all caught up!</small>
//             </div>
//           </CDropdownItem>
//         )}
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default AppHeaderDropdownNotif