
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

  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

  const closeNotice = () => setShowNotice(false);
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  useEffect(() => {
    if (showNotice && userCenterType !== 'center') {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setShowNotice(false);
    }
  }, [showNotice, userCenterType]);

  return (
    <div className="dashboard-root">
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