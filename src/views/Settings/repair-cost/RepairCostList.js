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
//   cilSearch
// } from '@coreui/icons'
// import { CFormLabel } from '@coreui/react-pro'
// import axiosInstance from 'src/axiosInstance'
// import { confirmDelete, showSuccess } from 'src/utils/sweetAlerts'

// import Pagination from 'src/utils/Pagination'
// import AddRepairedCost from './AddRepairedCost'

// const RepairedCostList = () => {
//   const [repairCosts, setRepairCosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [showModal, setShowModal] = useState(false)
//   const [editingRepairCost, setEditingRepairCost] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const dropdownRefs = useRef({})

//   const fetchRepairCosts = async (page = 1) => {
//     try {
//       setLoading(true)
//       const response = await axiosInstance.get(`/repaired-cost?page=${page}`)
//       if (response.data.success) {
//         setRepairCosts(response.data.data)
//         setCurrentPage(response.data.pagination.currentPage)
//         setTotalPages(response.data.pagination.totalPages)
//       } else {
//         throw new Error('API returned unsuccessful response')
//       }
//     } catch (err) {
//       setError(err.message)
//       console.error('Error fetching repair costs:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchRepairCosts(1)
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return
//     fetchRepairCosts(page)
//   }

//   const handleSort = (key) => {
//     let direction = 'ascending'
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending'
//     }
//     setSortConfig({ key, direction })

//     const sortedData = [...repairCosts].sort((a, b) => {
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

//     setRepairCosts(sortedData)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null
//     return sortConfig.direction === 'ascending' ? (
//       <CIcon icon={cilArrowTop} className="ms-1" />
//     ) : (
//       <CIcon icon={cilArrowBottom} className="ms-1" />
//     )
//   }

//   const filteredData = repairCosts.filter((repairCost) =>
//     Object.values(repairCost).some((value) => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase()),
//         )
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     }),
//   )

//   const handleDeleteRepairCost = async (id) => {
//     const result = await confirmDelete()
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/repaired-cost/${id}`)
//         fetchRepairCosts(currentPage)
//         showSuccess('Repair cost deleted successfully!')
//       } catch (error) {
//         console.error('Error deleting repair cost:', error)
//       }
//     }
//   }

//   const handleRepairCostAdded = async (newRepairCost, isEdit) => {
//     if (isEdit) {
//       setRepairCosts((prev) => prev.map((p) => (p._id === newRepairCost._id ? newRepairCost : p)))
//     } else {
//       fetchRepairCosts(currentPage)
//     }
//   }

//   const handleEditRepairCost = (repairCost) => {
//     setEditingRepairCost(repairCost)
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
//        {error}
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="title">Repaired Cost Management</div>
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
//                   <CTableHeaderCell scope="col" className="sortable-header">
//                     SR.No.
//                   </CTableHeaderCell>
//                   <CTableHeaderCell
//                     scope="col"
//                     onClick={() => handleSort('product.productTitle')}
//                     className="sortable-header"
//                   >
//                     Product Name {getSortIcon('product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell
//                     scope="col"
//                     onClick={() => handleSort('repairCost')}
//                     className="sortable-header"
//                   >
//                     Repair Cost (₹) {getSortIcon('repairCost')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((repairCost, index) => (
//                     <CTableRow key={repairCost._id}>
//                       <CTableDataCell>{(currentPage - 1) * 100 + index + 1}</CTableDataCell>
//                       <CTableDataCell>
//                         {repairCost.product?.productTitle || 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         ₹ {repairCost.repairCost?.toFixed(2) || '0.00'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div
//                           className="dropdown-container"
//                           ref={(el) => (dropdownRefs.current[repairCost._id] = el)}
//                         >
//                           <CButton
//                             size="sm"
//                             className="option-button btn-sm"
//                             onClick={() => toggleDropdown(repairCost._id)}
//                           >
//                             <CIcon icon={cilSettings} /> Options
//                           </CButton>
//                           {dropdownOpen[repairCost._id] && (
//                             <div className="dropdown-menu show">
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => handleEditRepairCost(repairCost)}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </button>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => handleDeleteRepairCost(repairCost._id)}
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
//                     <CTableDataCell colSpan="6" className="text-center">
//                       No repair costs found. Add your first repair cost.
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//       <AddRepairedCost
//         visible={showModal}
//         onClose={() => {
//           setShowModal(false)
//           setEditingRepairCost(null)
//         }}
//         onRepairCostAdded={handleRepairCostAdded}
//         repairCost={editingRepairCost}
//       />
//     </div>
//   )
// }

// export default RepairedCostList





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
  cilSearch,
  cilCloudDownload,
  cilCloudUpload
} from '@coreui/icons'
import { CFormLabel } from '@coreui/react-pro'
import axiosInstance from 'src/axiosInstance'
import { confirmDelete, showSuccess, showError } from 'src/utils/sweetAlerts'
import Pagination from 'src/utils/Pagination'
import AddRepairedCost from './AddRepairedCost'
import ImportRepairCostsModal from './ImportRepairCostsModal' 

const RepairedCostList = () => {
  const [repairCosts, setRepairCosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingRepairCost, setEditingRepairCost] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [importLoading, setImportLoading] = useState(false)
  const dropdownRefs = useRef({})

  const fetchRepairCosts = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/repaired-cost?page=${page}`)
      if (response.data.success) {
        setRepairCosts(response.data.data)
        setCurrentPage(response.data.pagination.currentPage)
        setTotalPages(response.data.pagination.totalPages)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching repair costs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepairCosts(1)
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    fetchRepairCosts(page)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedData = [...repairCosts].sort((a, b) => {
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

    setRepairCosts(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? (
      <CIcon icon={cilArrowTop} className="ms-1" />
    ) : (
      <CIcon icon={cilArrowBottom} className="ms-1" />
    )
  }

  const filteredData = repairCosts.filter((repairCost) =>
    Object.values(repairCost).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    }),
  )

  const handleDeleteRepairCost = async (id) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/repaired-cost/${id}`)
        fetchRepairCosts(currentPage)
        showSuccess('Repair cost deleted successfully!')
      } catch (error) {
        console.error('Error deleting repair cost:', error)
      }
    }
  }

  const handleRepairCostAdded = async (newRepairCost, isEdit) => {
    if (isEdit) {
      setRepairCosts((prev) => prev.map((p) => (p._id === newRepairCost._id ? newRepairCost : p)))
    } else {
      fetchRepairCosts(currentPage)
    }
  }

  const handleEditRepairCost = (repairCost) => {
    setEditingRepairCost(repairCost)
    setShowModal(true)
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleImportClick = () => {
    setShowImportModal(true)
  }

const handleDownloadTemplate = async () => {
  try {
    setImportLoading(true);
    
    const response = await axiosInstance.get('/repaired-cost/template', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'repair_costs_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading template:', error);
    if (error.response && error.response.data && typeof error.response.data === 'object') {
      try {
        const errorData = error.response.data;
        showError(errorData.message || 'Failed to download template');
      } catch (e) {
        showError('Failed to download template');
      }
    } else {
      showError('Failed to download template');
    }
  } finally {
    setImportLoading(false);
  }
};


  const handleImportComplete = (result) => {
    if (result.success) {
      fetchRepairCosts(currentPage)
      showSuccess(`Import completed!`)
    }
    setShowImportModal(false)
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
       {error}
      </div>
    )
  }

  return (
    <div>
      <div className="title">Repaired Cost Management</div>
      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={() => setShowModal(true)}>
              <CIcon icon={cilPlus} className="icon" /> Add
            </CButton>
            <CButton 
              size="sm" 
              className="action-btn me-1" 
              onClick={handleImportClick}
            >
              <CIcon icon={cilCloudUpload} className="icon" /> Import
            </CButton>
            <CButton 
              size="sm" 
              className="action-btn me-1" 
              onClick={handleDownloadTemplate}
              disabled={importLoading}
            >
              <CIcon icon={cilCloudDownload} className="icon" /> 
              {importLoading ? 'Downloading...' : 'Download Template'}
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
                  <CTableHeaderCell scope="col" className="sortable-header">
                    SR.No.
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('product.productTitle')}
                    className="sortable-header"
                  >
                    Product Name {getSortIcon('product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('repairCost')}
                    className="sortable-header"
                  >
                    Repair Cost (₹) {getSortIcon('repairCost')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((repairCost, index) => (
                    <CTableRow key={repairCost._id}>
                      <CTableDataCell>{(currentPage - 1) * 100 + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {repairCost.product?.productTitle || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        ₹ {repairCost.repairCost?.toFixed(2) || '0.00'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div
                          className="dropdown-container"
                          ref={(el) => (dropdownRefs.current[repairCost._id] = el)}
                        >
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={() => toggleDropdown(repairCost._id)}
                          >
                            <CIcon icon={cilSettings} /> Options
                          </CButton>
                          {dropdownOpen[repairCost._id] && (
                            <div className="dropdown-menu show">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEditRepairCost(repairCost)}
                              >
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeleteRepairCost(repairCost._id)}
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
                    <CTableDataCell colSpan="6" className="text-center">
                      No repair costs found. Add your first repair cost.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
      <AddRepairedCost
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingRepairCost(null)
        }}
        onRepairCostAdded={handleRepairCostAdded}
        repairCost={editingRepairCost}
      />
      <ImportRepairCostsModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}

export default RepairedCostList