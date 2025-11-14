
import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axiosInstance from 'src/axiosInstance'
import { showError } from 'src/utils/sweetAlerts'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const userData = res.data.data.user
      setUser(userData)
      setPermissions(userData.permissions)
      localStorage.setItem('permissions', JSON.stringify(userData.permissions))
    } catch (err) {
      const message = err?.response?.data?.message;

    if (message === "Your token has expired. Please log in again.") {
      localStorage.clear();
      showError(message);
      window.location.href = "/auth/login";
      return;
    }

    if (message === "Your account has been disabled. Please contact administrator.") {
      showError(message);
      localStorage.clear();
      window.location.href = "/auth/login";
      return;
    }
      console.error('Error fetching user info:', err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const refreshPermissions = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, permissions, refreshPermissions }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
