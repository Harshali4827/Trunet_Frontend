
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
  CAlert,
} from '@coreui/react-pro'
import avatar10 from './../../assets/images/avatars/10.png'
import { useNavigate } from 'react-router-dom'
import axiosInstance from 'src/axiosInstance'
import '../../css/form.css'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [center, setCenter] = useState(null)
  const [accessibleCenters, setAccessibleCenters] = useState([])
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedCenter = localStorage.getItem('userCenter')

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      
      // Extract accessibleCenters from user object
      if (parsedUser.accessibleCenters && Array.isArray(parsedUser.accessibleCenters)) {
        setAccessibleCenters(parsedUser.accessibleCenters)
      }
    }
    if (storedCenter) setCenter(JSON.parse(storedCenter))
  }, [])

  useEffect(() => {
    if (showChangePasswordModal) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })
      setAlert({ type: '', message: '' })
      setErrors({})
    }
  }, [showChangePasswordModal])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userCenter')
    navigate('/login')
  }

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true)
  }

  const handleSwitchCenterClick = () => {
    navigate('/select-center');
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'This is a required field'
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'This is a required field'
    }
    if (!passwordData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'This is a required field'
    }
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long'
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validateForm()) return

    setLoading(true)
    setAlert({ type: '', message: '' })

    try {
      const response = await axiosInstance.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      })

      if (response.data.success) {
        setAlert({ type: 'success', message: 'Password changed successfully!' })
        
        setTimeout(() => {
          setShowChangePasswordModal(false)
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          })
        }, 1500)
      } else {
        setAlert({ type: 'danger', message: response.data.message || 'Failed to change password' })
      }
    } catch (error) {
      console.error('Error changing password:', error)

      if (error.response?.data?.errors) {
        const backendErrors = {}
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg
        })
        setErrors(backendErrors)
      } else {
        const msg =
          error.response?.data?.message ||
          error.message ||
          'An error occurred while changing password'
        setAlert({ type: 'danger', message: msg })
      }
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowChangePasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setAlert({ type: '', message: '' })
    setErrors({})
  }

  // Debug: Check what's in localStorage
  useEffect(() => {
    console.log('User from localStorage:', JSON.parse(localStorage.getItem('user') || '{}'));
    console.log('Accessible centers count:', accessibleCenters.length);
  }, [accessibleCenters]);

  return (
    <>
      <CDropdown variant="nav-item" alignment="end">
        <CDropdownToggle
          className="py-0 d-flex align-items-center"
          caret={false}
          style={{ height: '100%' }}
        >
          <CAvatar src={avatar10} size="sm" />
          <span
            className="ms-2"
            style={{
              color: 'white',
              fontWeight: '400',
              fontSize: '14px',
            }}
          >
            {user?.fullName || 'User Name'}
          </span>
        </CDropdownToggle>

        <CDropdownMenu className="pt-1 w-[300px]">
          <CDropdownHeader
            className="bg-[#2759A2] text-white fw-semibold text-center py-1"
            style={{ backgroundColor: '#2759A2', height: '5px', padding: '10px' }}
          ></CDropdownHeader>

          <div
            style={{
              backgroundColor: '#2759A2',
              color: 'white',
              textAlign: 'center',
              padding: '16px',
              width: '300px',
              height: '170px',
            }}
          >
            <div
              style={{
                height: '84px',
                width: '84px',
                borderRadius: '50%',
                border: '3px solid #ffffff33',
                overflow: 'hidden',
                margin: '0 auto 8px auto',
              }}
            >
              <img
                src={avatar10}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid #2759A2',
                }}
              />
            </div>

            <p
              style={{
                color: '#ffffffcc',
                fontWeight: '300',
                fontSize: '12px',
                margin: 0,
              }}
            >
              {user?.email || 'user@example.com'}
            </p>
            <p
              style={{
                color: '#ffffffcc',
                fontSize: '17px',
                marginTop: '10px',
              }}
            >
              {user?.role
                ? `${user.role.roleTitle} - ${center?.centerName || 'Unknown'}`
                : 'Role - Unknown'
              }
            </p>
            
            {/* Show accessible centers count in profile header */}
            {accessibleCenters.length > 1 && (
              <div className="mt-2">
                <small className="text-white-50">
                  Access to {accessibleCenters.length} centers
                </small>
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: 'light',
              paddingTop: '4px',
              paddingBottom: '2px',
              display: 'flex',
              gap: '4px',
              justifyContent: 'space-between',
              margin: '5px',
            }}
          >
            <button 
              className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 py-1 px-2"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
            
            {/* Show Switch Center button if user has more than 1 center */}
            {accessibleCenters && accessibleCenters.length > 1 && (
              <button 
                className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 py-1 px-2"
                onClick={handleSwitchCenterClick}
              >
                Switch Center
              </button>
            )}
            
            <button
              className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 px-2 py-1"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </CDropdownMenu>
      </CDropdown>

      <CModal size="lg" visible={showChangePasswordModal} onClose={closeModal}>
        <CModalHeader className="d-flex justify-content-between align-items-center">
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {alert.message && (
            <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
              {alert.message}
            </CAlert>
          )}

          <div className="form-row">
            <div className="form-group">
              <label
                className={`form-label ${
                  errors.currentPassword
                    ? 'error-label'
                    : passwordData.currentPassword
                    ? 'valid-label'
                    : ''
                }`}
              >
                Current Password <span style={{ color: 'red' }}>*</span>
              </label>
              <CFormInput
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`form-input ${
                  errors.currentPassword
                    ? 'error-input'
                    : passwordData.currentPassword
                    ? 'valid-input'
                    : ''
                }`}
                disabled={loading}
              />
              {errors.currentPassword && (
                <span className="error">{errors.currentPassword}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label
                className={`form-label ${
                  errors.newPassword
                    ? 'error-label'
                    : passwordData.newPassword
                    ? 'valid-label'
                    : ''
                }`}
              >
                New Password <span style={{ color: 'red' }}>*</span>
              </label>
              <CFormInput
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`form-input ${
                  errors.newPassword
                    ? 'error-input'
                    : passwordData.newPassword
                    ? 'valid-input'
                    : ''
                }`}
                disabled={loading}
              />
              {errors.newPassword && (
                <span className="error">{errors.newPassword}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label
                className={`form-label ${
                  errors.confirmNewPassword
                    ? 'error-label'
                    : passwordData.confirmNewPassword
                    ? 'valid-label'
                    : ''
                }`}
              >
                Confirm New Password <span style={{ color: 'red' }}>*</span>
              </label>
              <CFormInput
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                className={`form-input ${
                  errors.confirmNewPassword
                    ? 'error-input'
                    : passwordData.confirmNewPassword
                    ? 'valid-input'
                    : ''
                }`}
                disabled={loading}
              />
              {errors.confirmNewPassword && (
                <span className="error">{errors.confirmNewPassword}</span>
              )}
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton className="submit-button" onClick={handleChangePassword} disabled={loading}>
            {loading ? 'Changing...' : 'Submit'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown