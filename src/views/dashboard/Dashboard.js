// import React, { useEffect, useState } from 'react';
// import NotificationDetails from './NotificationDetails';
// import IndentCard from './IndentCard';
// import TransactionReport from './TransactionReport';
// import CenterUsage from './CenterUsage';
// import LoginHistory from './LoginHistory';

// const Dashboard = () => {
//   const [showNotice, setShowNotice] = useState(true);
//   const [animate, setAnimate] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);

//   const closeNotice = () => setShowNotice(false);
//   const handleNotificationClick = (notification) => {
//     setSelectedNotification(notification);
//   };

//   useEffect(() => {
//     if (showNotice) {
//       setTimeout(() => setAnimate(true), 50);
//     }
//   }, [showNotice]);

//   const styles = {
//     root: {
//       position: 'relative',
//       backgroundColor: '#ECF0F5',
//       minHeight: '100vh',
//     },
//      overlayContainer: {
//       position: 'fixed',
//       inset: 0,
//       zIndex: 50,
//       display: 'flex',
//       justifyContent: 'center',
//       paddingTop: '2rem',
//     },
//     overlayBackground: {
//       position: 'absolute',
//       inset: 0,
//       backgroundColor: 'black',
//       opacity: 0.6,
//     },
//     noticeBox: {
//       position: 'relative',
//       backgroundColor: '#3DC1DA',
//       color: 'white',
//       width: '600px',
//       height: '460px',
//       boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
//       zIndex: 10,
//       transform: animate ? 'translateY(0)' : 'translateY(-10px)',
//       opacity: animate ? 1 : 0,
//       transition: 'transform 0.5s, opacity 0.5s',
//     },
//     noticeHeader: {
//       backgroundColor: '#2759A2',
//       padding: '0.875rem 1rem',
//       borderBottom: '1px solid #776C56',
//     },
//     headerText: {
//       fontSize: '18px',
//       color: 'white',
//       margin: 0,
//     },
//     noticeContent: {
//       padding: '2.25rem 1rem 0 1rem',
//     },
//     para: {
//       fontSize: '1.5rem',
//       lineHeight: '1.5rem',
//       marginBottom: '1.5rem',
//     },
//     clickableText: {
//       fontSize: '1.5rem',
//       color: '#3c8dbc',
//       lineHeight: '1.5rem',
//       marginBottom: '2.5rem',
//       cursor: 'pointer',
//       textDecoration: 'none',
//     },
//     clickableTextHover: {
//       opacity: 0.2,
//     },
//     closeButton: {
//       position: 'absolute',
//       top: '0.5rem',
//       right: '1rem',
//       fontSize: '1.25rem',
//       color:'black',
//       cursor: 'pointer',
//       background: 'none',
//       border: 'none',
//     },
//   };

//   return (
//     <div style={styles.root}>
//       {showNotice && (
//         <div style={styles.overlayContainer}>
//           <div style={styles.overlayBackground} />
//           <div style={styles.noticeBox}>
//             <div style={styles.noticeHeader}>
//               <h2 style={styles.headerText}>Notice</h2>
//             </div>
//             <div style={styles.noticeContent}>
//               <p style={styles.para}>
//                 कृपया आपले उपलब्ध स्टॉक सॉफ्टवेअर आणि भौतिकदृष्ट्या उपलब्ध स्टॉक तपासा,
//                 <b> 9820068104 </b> वर कॉल करा आणि आपल्याला स्टॉकची पुष्टी करा.
//               </p>
//               <p
//                 style={styles.clickableText}
//                 onMouseOver={(e) => (e.target.style.opacity = '0.2')}
//                 onMouseOut={(e) => (e.target.style.opacity = '1')}
//               >
//                 आपल्या सॉफ्टवेअर स्टॉकची तपासणी करण्यासाठी येथे क्लिक करा
//               </p>
//               <p style={styles.para}>
//                 Please check your available stock in software and physically available stock.
//                 Call on <b>9820068104</b> and Confirm your stock.
//               </p>
//               <a
//                 href="#"
//                 style={styles.clickableText}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   alert('Redirecting to stock check...');
//                 }}
//                 onMouseOver={(e) => (e.target.style.opacity = '0.2')}
//                 onMouseOut={(e) => (e.target.style.opacity = '1')}
//               >
//                 Click here to Check your software stock
//               </a>
//             </div>
//             <button
//               onClick={closeNotice}
//               style={styles.closeButton}
//               aria-label="Close"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}

//       {selectedNotification ? (
//         <NotificationDetails
//           notification={selectedNotification}
//           onBack={() => setSelectedNotification(null)}
//         />
//       ) : (
//         <>
//           <IndentCard />
//           <TransactionReport onNotificationClick={handleNotificationClick} />
//           <CenterUsage />
//           <LoginHistory />
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import NotificationDetails from './NotificationDetails';
import IndentCard from './IndentCard';
import TransactionReport from './TransactionReport';
import CenterUsage from './CenterUsage';
import LoginHistory from './LoginHistory';
import '../../css/dashboard.css';

const Dashboard = () => {
  const [showNotice, setShowNotice] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const closeNotice = () => setShowNotice(false);
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  useEffect(() => {
    if (showNotice) {
      setTimeout(() => setAnimate(true), 50);
    }
  }, [showNotice]);

  return (
    <div className="dashboard-root">
      {showNotice && (
        <div className="overlay-container">
          <div className="overlay-background" />
          <div className={`notice-box ${animate ? 'animate' : ''}`}>
            <div className="notice-header">
              <h2>Notice</h2>
            </div>
            <div className="notice-content">
              <p>
                कृपया आपले उपलब्ध स्टॉक सॉफ्टवेअर आणि भौतिकदृष्ट्या उपलब्ध स्टॉक तपासा,
                <b> 9820068104 </b> वर कॉल करा आणि आपल्याला स्टॉकची पुष्टी करा.
              </p>
              <p
                className="clickable-text"
                onClick={() => alert('Redirecting to stock check...')}
              >
                आपल्या सॉफ्टवेअर स्टॉकची तपासणी करण्यासाठी येथे क्लिक करा
              </p>
              <p>
                Please check your available stock in software and physically available stock.
                Call on <b>9820068104</b> and Confirm your stock.
              </p>
              <a
                href="#"
                className="clickable-text"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Redirecting to stock check...');
                }}
              >
                Click here to Check your software stock
              </a>
            </div>
            <button
              onClick={closeNotice}
              className="close-button"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {selectedNotification ? (
        <NotificationDetails
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
        />
      ) : (
        <>
          <IndentCard />
          <TransactionReport onNotificationClick={handleNotificationClick} />
          <CenterUsage />
          <LoginHistory />
        </>
      )}
    </div>
  );
};

export default Dashboard;
