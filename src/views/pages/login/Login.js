import React, { useContext, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed,cilLockLocked, cilUser } from '@coreui/icons'
import backgroundImage from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
import axiosInstance from 'src/axiosInstance'
import { useNavigate } from 'react-router-dom'
import './login.css'
import { AuthContext } from 'src/context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState(1)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role || '';
  const { refreshPermissions } = useContext(AuthContext)
   
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setError('')
    setSuccess('')
    
    if (!formData.username || (activeTab === 1 && !formData.password)) {
      setError('Please fill in all fields')
      return
    }
    
    if (activeTab === 1) {
      setLoading(true)
  
      try {
        const response = await axiosInstance.post('/auth/login', {
          username: formData.username,
          password: formData.password,
        })
  
        if (response.data.success) {
          if (response.data.requiresCenterSelection) {
            localStorage.setItem('tempToken', response.data.token)
            localStorage.setItem('userTemp', JSON.stringify(response.data.data.user))
            navigate('/select-center')
          } else {
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
          
            if (response.data.data && response.data.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.data.user))
              
              if (response.data.data.user.center) {
                localStorage.setItem('userCenter', JSON.stringify(response.data.data.user.center))
              }
            }
            await refreshPermissions()
            navigate('/');
          }
        } else {
          setError(response.data.message || 'Login failed')
        }
        
      } catch (error) {
      } finally {
        setLoading(false)
      }
    } else {
      setSuccess('OTP has been sent to your email.')
    }
  }

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
              <h1 className="display-4 fw-bold">TRUNET</h1>
              <p className="lead">Welcome to our platform</p>
            </div>
          </CCol>

          <CCol md={4} className="me-5">
            <CCardGroup>
              <CCard className="p-4 shadow login-card">
                <CCardBody>
                  <p className="text-center">Sign in to start your session Login</p>
                
                  <CNav variant="tabs" className="mb-3">
                    <CNavItem className="login-tab-item">
                      <CNavLink
                        active={activeTab === 1}
                        onClick={() => setActiveTab(1)}
                      >
                        Password Login
                      </CNavLink>
                    </CNavItem>
                    <CNavItem className="login-tab-item">
                      <CNavLink
                        active={activeTab === 2}
                        onClick={() => setActiveTab(2)}
                      >
                        OTP Login
                      </CNavLink>
                    </CNavItem>
                  </CNav>

                  <CForm onSubmit={handleSubmit}>
                    {error && (
                      <CAlert color="danger" className="mb-3">
                        {error}
                      </CAlert>
                    )}
                    <CTabContent>
                      <CTabPane visible={activeTab === 1}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </CInputGroup>
                      </CTabPane>

                      <CTabPane visible={activeTab === 2}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilEnvelopeClosed} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            name="username"
                            placeholder="Email"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </CInputGroup>
                        <CRow>
                          <CCol className="text-start">
                            <CButton
                              className="px-4 login-button"
                              type="button"
                            >
                              Generate OTP
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
                    </CTabContent>

                    {activeTab === 1 && (
                      <>
                        <CRow className="text-end mt-3">
                          <CCol>
                            <CButton
                              className="px-4 login-button mb-2"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <CSpinner
                                    component="span"
                                    size="sm"
                                    aria-hidden="true"
                                  />
                                  <span className="ms-2">Loading...</span>
                                </>
                              ) : (
                                'Sign In'
                              )}
                            </CButton>
                          </CCol>
                        </CRow>
                        <CRow className="text-end">
                          <CCol>
                            <CButton
                              color="link"
                              className="px-0 forgot-link"
                            >
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </>
                    )}

                    <hr />
                    <CRow>
                      <p className="footer-text">
                        Design and Developed by{' '}
                        <a href="https://softcrowdtechnologies.com/">
                          <span className="sub-footer">
                            Softcrowd Technologies
                          </span>
                        </a>
                      </p>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login