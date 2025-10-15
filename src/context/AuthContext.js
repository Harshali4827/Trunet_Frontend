// import React, { createContext, useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import axiosInstance from 'src/axiosInstance'
// export const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [permissions, setPermissions] = useState([])

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axiosInstance.get('/auth/me', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         })
//         const userData = res.data.data.user
//         setUser(userData)
//         setPermissions(userData.permissions)
//         localStorage.setItem('permissions', JSON.stringify(userData.permissions))
//       } catch (err) {
//         console.error('Error fetching user info:', err)
//       }
//     }

//     fetchUser()
//   }, [])

//   return (
//     <AuthContext.Provider value={{ user, permissions }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// AuthProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// }




import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axiosInstance from 'src/axiosInstance'

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
      console.error('Error fetching user info:', err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // ✅ expose refetch function
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
