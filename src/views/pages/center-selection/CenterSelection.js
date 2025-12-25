import React, { useState, useEffect, useContext } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CAlert,
  CSpinner,
} from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background.jpg';
import logo from '../../../assets/images/logo.png';
import { AuthContext } from 'src/context/AuthContext';

const CenterSelection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();
  const { refreshPermissions } = useContext(AuthContext);

  useEffect(() => {
    const tempToken = localStorage.getItem('tempToken');
    const regularToken = localStorage.getItem('token');
    
    if (tempToken) {
      setIsSwitching(false);
      loadCentersFromTempToken();
    } else if (regularToken) {
      setIsSwitching(true);
      loadCentersFromRegularToken();
    } else {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const loadCentersFromTempToken = async () => {
    try {
      const userTemp = localStorage.getItem('userTemp');
      if (userTemp) {
        const user = JSON.parse(userTemp);
        setUserInfo(user);
        
        if (user.accessibleCenters) {
          setCenters(user.accessibleCenters);
          if (user.accessibleCenters.length === 1) {
            handleCenterSelect(user.accessibleCenters[0]._id);
          }
        }
      } else {
        setError('User session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error loading centers:', error);
      setError('Error loading centers. Please login again.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const loadCentersFromRegularToken = async () => {
    try {
      setLoading(true);
      // Fetch current user info to get accessible centers
      const response = await axiosInstance.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        setUserInfo(user);
        setCenters(user.accessibleCenters || []);
        
        // Preselect current center if switching
        if (user.center && user.center._id) {
          setSelectedCenter(user.center._id);
        }
      } else {
        setError('Failed to load centers. Please try again.');
      }
    } catch (error) {
      console.error('Error loading user info:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(error.response?.data?.message || 'Error loading centers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCenterSelect = async (centerId) => {
    setSelectedCenter(centerId);
    setError('');
    setLoading(true);

    try {
      let token;
      let isTempToken = false;
      
      if (isSwitching) {
        // Center switching - use regular token
        token = localStorage.getItem('token');
      } else {
        // Initial login - use temp token
        token = localStorage.getItem('tempToken');
        isTempToken = true;
      }

      if (!token) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axiosInstance.post('/auth/select-center', 
        { centerId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (isSwitching) {
          // For switching, just update the token
          localStorage.setItem('token', response.data.token);
        } else {
          // For initial login, replace temp token with regular token
          localStorage.setItem('token', response.data.token);
          localStorage.removeItem('tempToken');
          localStorage.removeItem('userTemp');
        }
        if (response.data.data && response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          
          if (response.data.data.user.center) {
            localStorage.setItem('userCenter', JSON.stringify(response.data.data.user.center));
          }
        }
        await refreshPermissions();
        navigate('/');
      } else {
        setError(response.data.message || 'Failed to select center');
      }
    } catch (error) {
      console.error('Center selection error:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 403) {
        setError('You do not have access to this center');
      } else {
        setError(error.response?.data?.message || 'Error selecting center. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isSwitching) {
      navigate('/');
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer fluid>
        <CRow className="justify-content-center align-items-center min-vh-100">
          <CCol md={6} className="d-flex justify-content-center align-items-center">
            <div className="text-center text-white">
              <img
                src={logo}
                alt="Company Logo"
                style={{ maxWidth: '450px', marginTop: '50px' }}
              />
            </div>
          </CCol>

          <CCol md={4} className="me-5">
            <CCard className="p-4 shadow login-card">
              <CCardBody>
                <h3 className="text-center mb-4">
                  {isSwitching ? 'Switch Center' : 'Select Center'}
                </h3>
                
                {userInfo && (
                  <p className="text-center mb-4">
                    {isSwitching ? (
                      <>
                        Hello, <strong>{userInfo.fullName}</strong>
                        <br />
                        <small className="text-muted">
                          Currently in: <strong>{userInfo.center?.centerName || 'Unknown'}</strong>
                        </small>
                      </>
                    ) : (
                      <>Welcome, <strong>{userInfo.fullName}</strong></>
                    )}
                  </p>
                )}
                
                {error && (
                  <CAlert color="danger" className="mb-3">
                    {error}
                  </CAlert>
                )}

                <p className="text-center mb-4">
                  {isSwitching ? (
                    <>You can switch between {centers.length} accessible center(s).</>
                  ) : (
                    <>You have access to {centers.length} center(s). Please select one to continue.</>
                  )}
                </p>

                <div className="centers-list">
                  {centers.map((center) => {
                    const isCurrentCenter = isSwitching && userInfo?.center?._id === center._id;
                    
                    return (
                      <div 
                        key={center._id} 
                        className={`center-card mb-3 p-3 ${selectedCenter === center._id ? 'selected' : ''} ${isCurrentCenter ? 'current-center' : ''}`}
                        style={{
                          border: `2px solid ${isCurrentCenter ? '#198754' : (selectedCenter === center._id ? '#321fdb' : '#d8dbe0')}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: isCurrentCenter ? '#d4edda' : (selectedCenter === center._id ? '#f0f2f5' : 'white'),
                          transition: 'all 0.3s'
                        }}
                        onClick={() => !isCurrentCenter && setSelectedCenter(center._id)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1">
                              {center.centerName}
                              {isCurrentCenter && (
                                <span className="badge bg-success ms-2">Current</span>
                              )}
                            </h5>
                          </div>
                          <div className="text-end">
                            {!isCurrentCenter ? (
                              <CButton
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCenterSelect(center._id);
                                }}
                                disabled={loading}
                              >
                                {loading && selectedCenter === center._id ? (
                                  <>
                                    <CSpinner size="sm" />
                                    <span className="ms-2">
                                      {isSwitching ? 'Switching...' : 'Selecting...'}
                                    </span>
                                  </>
                                ) : (
                                  isSwitching ? 'Switch' : 'Select'
                                )}
                              </CButton>
                            ) : (
                              <CButton
                                color="secondary"
                                disabled
                              >
                                Current
                              </CButton>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-4">
                  <CButton
                    color="link"
                    onClick={handleBack}
                  >
                    {isSwitching ? 'Back to Dashboard' : 'Back to Login'}
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default CenterSelection;
