// import '../../../css/table.css'
// import '../../../css/form.css'
// import React, { useState, useRef, useEffect } from 'react'
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CPaginationItem,
//   CPagination,
//   CSpinner,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilArrowTop,
//   cilArrowBottom,
//   cilPlus,
//   cilSettings,
//   cilPencil,
//   cilTrash,
// } from '@coreui/icons'
// import { CFormLabel } from '@coreui/react-pro'
// import { useNavigate } from 'react-router-dom'
// import axiosInstance from 'src/axiosInstance'
// import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts'
// import AddArea from './AddArea'
// import Pagination from 'src/utils/Pagination'
// const AreaList = () => {
//   const [areas, setAreas] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [showModal, setShowModal] = useState(false)
//   const [editingArea, setEditingArea] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const dropdownRefs = useRef({})
//   const navigate = useNavigate()

//   const fetchAreas = async (page = 1) => {
//     try {
//       setLoading(true)
//       const response = await axiosInstance.get('/areas?page=${page}')
//       if (response.data.success) {
//         setAreas(response.data.data)
//         setCurrentPage(response.data.pagination.currentPage)
//         setTotalPages(response.data.pagination.totalPages)
//       } else {
//         throw new Error('API returned unsuccessful response')
//       }
//     } catch (err) {
//       setError(err.message)
//       console.error('Error fetching areas:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAreas(1)
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return
//     fetchAreas(page)
//   }
//   const handleSort = (key) => {
//     let direction = 'ascending'
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending'
//     }
//     setSortConfig({ key, direction })

//     const sortedData = [...areas].sort((a, b) => {
//       let aValue = a
//       let bValue = b

//       if (key.includes('.')) {
//         const keys = key.split('.')
//         aValue = keys.reduce((obj, k) => obj && obj[k], a)
//         bValue = keys.reduce((obj, k) => obj && obj[k], b)
//       } else {
//         aValue = a[key]
//         bValue = b[key]
//       }

//       if (aValue < bValue) return direction === 'ascending' ? -1 : 1
//       if (aValue > bValue) return direction === 'ascending' ? 1 : -1
//       return 0
//     })

//     setAreas(sortedData)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null
//     return sortConfig.direction === 'ascending' ? (
//       <CIcon icon={cilArrowTop} className="ms-1" />
//     ) : (
//       <CIcon icon={cilArrowBottom} className="ms-1" />
//     )
//   }

//   const filteredData = areas.filter((partner) =>
//     Object.values(partner).some((value) => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase()),
//         )
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     }),
//   )

//   const handleDeletePartner = async (partnerId) => {
//     const result = await confirmDelete()
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/areas/${partnerId}`)
//         setAreas((prev) => prev.filter((c) => c._id !== partnerId))
//         showSuccess('Data deleted successfully!')
//       } catch (error) {
//         console.error('Error deleting data:', error)
//       }
//     }
//   }

//   const handleAreaAdded = async (newArea, isEdit) => {
//     if (isEdit) {
//       setAreas((prev) => prev.map((p) => (p._id === newArea._id ? newArea : p)))
//     } else {
//       try {
//         const response = await axiosInstance.get('/areas')
//         if (response.data.success) {
//           setAreas(response.data.data)
//         }
//       } catch (err) {
//         console.error('Error refreshing areas:', err)
//         setAreas((prev) => [...prev, newArea])
//       }
//     }
//   }

//   const handleEditPartner = (partner) => {
//     setEditingArea(partner)
//     setShowModal(true)
//   }

//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {}
//       let shouldUpdate = false

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

//       if (shouldUpdate) {
//         setDropdownOpen((prev) => ({ ...prev, ...newDropdownState }))
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Error loading partner: {error}
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="title">Area List</div>
//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             <CButton size="sm" className="action-btn me-1" onClick={() => setShowModal(true)}>
//               <CIcon icon={cilPlus} className="icon" /> Add
//             </CButton>
//           </div>

//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className="d-flex">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableDataCell scope="col" className="sortable-header">
//                     SR.No.
//                   </CTableDataCell>
//                   <CTableHeaderCell
//                     scope="col"
//                     onClick={() => handleSort('businessName')}
//                     className="sortable-header"
//                   >
//                     Reseller Name {getSortIcon('businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell
//                     scope="col"
//                     onClick={() => handleSort('areaName')}
//                     className="sortable-header"
//                   >
//                     Area Name {getSortIcon('areaName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((area, index) => (
//                     <CTableRow key={area._id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{area.reseller?.businessName}</CTableDataCell>
//                       <CTableDataCell>{area.areaName}</CTableDataCell>
//                       <CTableDataCell>
//                         <div
//                           className="dropdown-container"
//                           ref={(el) => (dropdownRefs.current[area._id] = el)}
//                         >
//                           <CButton
//                             size="sm"
//                             className="option-button btn-sm"
//                             onClick={() => toggleDropdown(area._id)}
//                           >
//                             <CIcon icon={cilSettings} /> Options
//                           </CButton>
//                           {dropdownOpen[area._id] && (
//                             <div className="dropdown-menu show">
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => handleEditPartner(area)}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </button>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => handleDeletePartner(area._id)}
//                               >
//                                 <CIcon icon={cilTrash} className="me-2" /> Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       No area found
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//       <AddArea
//         visible={showModal}
//         onClose={() => {
//           setShowModal(false)
//           setEditingArea(null)
//         }}
//         onAreaAdded={handleAreaAdded}
//         area={editingArea}
//       />
//     </div>
//   )
// }

// export default AreaList

import '../../../css/table.css'
import '../../../css/form.css'
import React, { useState, useRef, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CPaginationItem,
  CPagination,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilArrowBottom,
  cilPlus,
  cilSettings,
  cilPencil,
  cilTrash,
} from '@coreui/icons'
import { CFormLabel } from '@coreui/react-pro'
import { useNavigate } from 'react-router-dom'
import axiosInstance from 'src/axiosInstance'
import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts'
import AddArea from './AddArea'
import Pagination from 'src/utils/Pagination'

const AreaList = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const dropdownRefs = useRef({})
  const navigate = useNavigate()

  const fetchAreas = async (page = 1) => {
    // Add page parameter with default value
    try {
      setLoading(true)
      // Add page parameter to API call
      const response = await axiosInstance.get(`/areas?page=${page}`)
      if (response.data.success) {
        // Correctly set areas from response.data.data.areas
        setAreas(response.data.data.areas)
        setCurrentPage(response.data.data.pagination.currentPage)
        setTotalPages(response.data.data.pagination.totalPages)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching areas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas(1) // Pass initial page
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    fetchAreas(page) // Pass the page to fetchAreas
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedData = [...areas].sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')
        aValue = keys.reduce((obj, k) => obj && obj[k], a)
        bValue = keys.reduce((obj, k) => obj && obj[k], b)
      } else {
        aValue = a[key]
        bValue = b[key]
      }

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1
      return 0
    })

    setAreas(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? (
      <CIcon icon={cilArrowTop} className="ms-1" />
    ) : (
      <CIcon icon={cilArrowBottom} className="ms-1" />
    )
  }

  const filteredData = areas.filter((area) =>
    Object.values(area).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    }),
  )

  const handleDeleteArea = async (areaId) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/areas/${areaId}`)
        // Refresh the current page after deletion
        fetchAreas(currentPage)
        showSuccess('Area deleted successfully!')
      } catch (error) {
        console.error('Error deleting area:', error)
      }
    }
  }

  const handleAreaAdded = async (newArea, isEdit) => {
    if (isEdit) {
      setAreas((prev) => prev.map((p) => (p._id === newArea._id ? newArea : p)))
    } else {
      // Refresh the list to get updated data with proper pagination
      fetchAreas(currentPage)
    }
  }

  const handleEditArea = (area) => {
    setEditingArea(area)
    setShowModal(true)
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(dropdownRefs.current).forEach((key) => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newDropdownState[key] = false
          shouldUpdate = true
        }
      })

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({ ...prev, ...newDropdownState }))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading areas: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="title">Area List</div>
      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={() => setShowModal(true)}>
              <CIcon icon={cilPlus} className="icon" /> Add
            </CButton>
          </div>

          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className="d-flex">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableDataCell scope="col" className="sortable-header">
                    SR.No.
                  </CTableDataCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('reseller.businessName')}
                    className="sortable-header"
                  >
                    Reseller Name {getSortIcon('reseller.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('areaName')}
                    className="sortable-header"
                  >
                    Area Name {getSortIcon('areaName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((area, index) => (
                    <CTableRow key={area._id}>
                      <CTableDataCell>{(currentPage - 1) * 100 + index + 1}</CTableDataCell>
                      <CTableDataCell>{area.reseller?.businessName}</CTableDataCell>
                      <CTableDataCell>{area.areaName}</CTableDataCell>
                      <CTableDataCell>
                        <div
                          className="dropdown-container"
                          ref={(el) => (dropdownRefs.current[area._id] = el)}
                        >
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={() => toggleDropdown(area._id)}
                          >
                            <CIcon icon={cilSettings} /> Options
                          </CButton>
                          {dropdownOpen[area._id] && (
                            <div className="dropdown-menu show">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEditArea(area)}
                              >
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeleteArea(area._id)}
                              >
                                <CIcon icon={cilTrash} className="me-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center">
                      No area found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
      <AddArea
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingArea(null)
        }}
        onAreaAdded={handleAreaAdded}
        area={editingArea}
      />
    </div>
  )
}

export default AreaList
