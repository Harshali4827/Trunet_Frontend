// import React, { useEffect, useState } from 'react';
// import NotificationDetails from './NotificationDetails';
// import IndentCard from './IndentCard';
// import TransactionReport from './TransactionReport';
// import CenterUsage from './CenterUsage';
// import LoginHistory from './LoginHistory';
// import '../../css/dashboard.css';

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

//   return (
//     <div className="dashboard-root">
//       {showNotice && (
//         <div className="overlay-container">
//           <div className="overlay-background" />
//           <div className={`notice-box ${animate ? 'animate' : ''}`}>
//             <div className="notice-header">
//               <h2>Notice</h2>
//             </div>
//             <div className="notice-content">
//               <p>
//                 कृपया आपले उपलब्ध स्टॉक सॉफ्टवेअर आणि भौतिकदृष्ट्या उपलब्ध स्टॉक तपासा,
//                 <b> 9820068104 </b> वर कॉल करा आणि आपल्याला स्टॉकची पुष्टी करा.
//               </p>
//               <p
//                 className="clickable-text"
//                 onClick={() => alert('Redirecting to stock check...')}
//               >
//                 आपल्या सॉफ्टवेअर स्टॉकची तपासणी करण्यासाठी येथे क्लिक करा
//               </p>
//               <p>
//                 Please check your available stock in software and physically available stock.
//                 Call on <b>9820068104</b> and Confirm your stock.
//               </p>
//               <a
//                 href="#"
//                 className="clickable-text"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   alert('Redirecting to stock check...');
//                 }}
//               >
//                 Click here to Check your software stock
//               </a>
//             </div>
//             <button
//               onClick={closeNotice}
//               className="close-button"
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

  // Get user center type from localStorage
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

  const closeNotice = () => setShowNotice(false);
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  useEffect(() => {
    // Only show notice if user center type is not 'center'
    if (showNotice && userCenterType !== 'center') {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setShowNotice(false);
    }
  }, [showNotice, userCenterType]);

  return (
    <div className="dashboard-root">
      {showNotice && userCenterType !== 'center' && (
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