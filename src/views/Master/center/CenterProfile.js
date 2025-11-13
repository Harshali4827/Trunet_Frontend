import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from 'src/axiosInstance'
import '../../../css/profile.css'
import '../../../css/table.css'
import {
  CCard,
  CCardBody,
  CButton,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CContainer,
  CTableDataCell,
  CTableRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilSettings, cilPlus, cilTrash } from '@coreui/icons'
import { showError, confirmDelete, showSuccess } from 'src/utils/sweetAlerts'
import Pagination from 'src/utils/Pagination'
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime'
import usePermission from 'src/utils/usePermission'

const CenterProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [center, setCenter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('indent')
  const [indentActiveTab, setIndentActiveTab] = useState('closed')
  const [usageActiveTab, setUsageActiveTab] = useState('pending')

  const [indentData, setIndentData] = useState([])
  const [usageData, setUsageData] = useState([])
  const [availableStockData, setAvailableStockData] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState({})
  const [indentCurrentPage, setIndentCurrentPage] = useState(1)
  const [indentTotalPages, setIndentTotalPages] = useState(1)
  const [usageCurrentPage, setUsageCurrentPage] = useState(1)
  const [usageTotalPages, setUsageTotalPages] = useState(1)
  const [stockCurrentPage, setStockCurrentPage] = useState(1)
  const [stockTotalPages, setStockTotalPages] = useState(1)

  const [loadingTabs, setLoadingTabs] = useState({
    indent: false,
    usage: false,
    availableStock: false,
  })

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
    tab: 'indent',
  })

  const dropdownRefs = useRef({})
  const { hasAnyPermission } = usePermission()

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/centers/${id}`)

        if (response.data.success) {
          setCenter(response.data.data)
          fetchIndentData(1)
        } else {
          throw new Error('Failed to fetch center data')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching center:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCenter()
    }
  }, [id])

  const fetchIndentData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({ ...prev, indent: true }))
      const response = await axiosInstance.get(
        `/stockrequest?center=${id}&status=Rejected&status=Completed&page=${page}`,
      )
      if (response.data.success) {
        setIndentData(response.data.data || [])
        setIndentCurrentPage(response.data.pagination?.currentPage || 1)
        setIndentTotalPages(response.data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching indent data:', err)
      setIndentData([])
    } finally {
      setLoadingTabs((prev) => ({ ...prev, indent: false }))
    }
  }

  const fetchUsageData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({ ...prev, usage: true }))
      const response = await axiosInstance.get(`/damage?center=${id}&page=${page}`)
      if (response.data.success) {
        setUsageData(response.data.data || [])
        setUsageCurrentPage(response.data.pagination?.currentPage || 1)
        setUsageTotalPages(response.data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching usage data:', err)
      setUsageData([])
    } finally {
      setLoadingTabs((prev) => ({ ...prev, usage: false }))
    }
  }

  const fetchAvailableStockData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({ ...prev, availableStock: true }))
      const response = await axiosInstance.get(
        `/availableStock/availableStock?center=${id}&page=${page}`,
      )
      if (response.data.success) {
        setAvailableStockData(response.data.data?.stock || [])
        setStockCurrentPage(response.data.data?.pagination?.currentPage || 1)
        setStockTotalPages(response.data.data?.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching available stock data:', err)
      setAvailableStockData([])
    } finally {
      setLoadingTabs((prev) => ({ ...prev, availableStock: false }))
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case 'indent':
        if (indentData.length === 0) {
          fetchIndentData()
        }
        break
      case 'usage':
        if (usageData.length === 0) {
          fetchUsageData()
        }
        break
      case 'availableStock':
        if (availableStockData.length === 0) {
          fetchAvailableStockData()
        }
        break
      default:
        break
    }
  }

  const handleIndentTabChange = (tab) => {
    setIndentActiveTab(tab)

    if (tab === 'open') {
      navigate('/stock-request')
    }
  }

  const handleUsageTabChange = (tab) => {
    setUsageActiveTab(tab)

    if (tab === 'all') {
      navigate('/stock-usage')
    }
  }

  const handleAddStockRequest = () => {
    navigate('/add-stockRequest')
  }

  const handleAddStockUsage = () => {
    navigate('/add-stockUsage')
  }

  const handleIndentPageChange = (page) => {
    if (page < 1 || page > indentTotalPages) return
    fetchIndentData(page)
  }

  const handleUsagePageChange = (page) => {
    if (page < 1 || page > usageTotalPages) return
    fetchUsageData(page)
  }

  const handleStockPageChange = (page) => {
    if (page < 1 || page > stockTotalPages) return
    fetchAvailableStockData(page)
  }

  const handleDeleteIndent = async (indentId) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/stockrequest/${indentId}`)
        setIndentData((prev) => prev.filter((item) => item._id !== indentId))
        showSuccess('Indent deleted successfully!')
      } catch (error) {
        console.error('Error deleting indent:', error)
        showError('Error deleting indent')
      }
    }
  }

  const handleSort = (key, tab) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending' && sortConfig.tab === tab) {
      direction = 'descending'
    }
    setSortConfig({ key, direction, tab })

    let dataToSort = []
    let setDataFunction = null

    switch (tab) {
      case 'indent':
        dataToSort = [...indentData]
        setDataFunction = setIndentData
        break
      case 'usage':
        dataToSort = [...usageData]
        setDataFunction = setUsageData
        break
      case 'availableStock':
        dataToSort = [...availableStockData]
        setDataFunction = setAvailableStockData
        break
      default:
        return
    }

    const sortedData = dataToSort.sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes(' ')) {
        aValue = a[key]
        bValue = b[key]
      } else if (key.includes('.')) {
        const keys = key.split('.')
        aValue = keys.reduce((obj, k) => obj && obj[k], a)
        bValue = keys.reduce((obj, k) => obj && obj[k], b)
      } else {
        aValue = a[key]
        bValue = b[key]
      }

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1
      }
      return 0
    })

    setDataFunction(sortedData)
  }

  const getSortIcon = (key, tab) => {
    if (sortConfig.key !== key || sortConfig.tab !== tab) {
      return null
    }
    return sortConfig.direction === 'ascending' ? (
      <CIcon icon={cilArrowTop} className="ms-1" />
    ) : (
      <CIcon icon={cilArrowBottom} className="ms-1" />
    )
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleIndentClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`)
  }

  const renderIndentTable = () => (
    <div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <CButton size="sm" className="action-btn" onClick={handleAddStockRequest}>
            <CIcon icon={cilPlus} className="me-1" />
            Add
          </CButton>
        </div>

        <div>
          <Pagination
            currentPage={indentCurrentPage}
            totalPages={indentTotalPages}
            onPageChange={handleIndentPageChange}
          />
        </div>
      </div>

      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={indentActiveTab === 'open'}
            onClick={() => handleIndentTabChange('open')}
            style={{
              cursor: 'pointer',
              borderTop: indentActiveTab === 'open' ? '4px solid #2759a2' : '3px solid transparent',
              color: 'black',
              borderBottom: 'none',
            }}
          >
            Open
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={indentActiveTab === 'closed'}
            onClick={() => handleIndentTabChange('closed')}
            style={{
              cursor: 'pointer',
              borderTop:
                indentActiveTab === 'closed' ? '4px solid #2759a2' : '3px solid transparent',
              borderBottom: 'none',
              color: 'black',
            }}
          >
            Closed
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={indentActiveTab === 'open'}>
          <div className="text-center p-4">
            <p>Click on the Open tab to view all open stock requests</p>
            <CButton color="primary" onClick={() => navigate('/stock-request')}>
              Go to Stock Requests
            </CButton>
          </div>
        </CTabPane>
        <CTabPane visible={indentActiveTab === 'closed'}>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('date', 'indent')}
                    className="sortable-header"
                  >
                    Date {getSortIcon('date', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('orderNumber', 'indent')}
                    className="sortable-header"
                  >
                    Number {getSortIcon('orderNumber', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('warehouse.centerName', 'indent')}
                    className="sortable-header"
                  >
                    From {getSortIcon('warehouse.centerName', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('center.centerName', 'indent')}
                    className="sortable-header"
                  >
                    Center {getSortIcon('center.centerName', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('createdBy.email', 'indent')}
                    className="sortable-header"
                  >
                    Posted By {getSortIcon('createdBy.email', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('status', 'indent')}
                    className="sortable-header"
                  >
                    Status {getSortIcon('status', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('products[0].productRemark', 'indent')}
                    className="sortable-header"
                  >
                    Remarks {getSortIcon('products[0].productRemark', 'indent')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loadingTabs.indent ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      <CSpinner size="sm" /> Loading indent data...
                    </CTableDataCell>
                  </CTableRow>
                ) : indentData.length > 0 ? (
                  indentData.map((item) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                      <CTableDataCell>
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => handleIndentClick(item._id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#337ab7',
                          }}
                        >
                          {item.orderNumber}
                        </button>
                      </CTableDataCell>
                      <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
                      <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {item.createdBy?.email || 'N/A'}
                        {item.createdAt &&
                          ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}`}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.status && (
                          <span className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{item.products[0]?.productRemark || ''}</CTableDataCell>
                      <CTableDataCell>
                        <div
                          className="dropdown-container"
                          ref={(el) => (dropdownRefs.current[item._id] = el)}
                        >
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={() => toggleDropdown(item._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          {dropdownOpen[item._id] && (
                            <div className="dropdown-menu show">
                              {hasAnyPermission('Indent', [
                                'delete_indent_own_center',
                                'delete_indent_all_center',
                              ]) && (
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDeleteIndent(item._id)}
                                >
                                  <CIcon icon={cilTrash} className="me-2" /> Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No closed indent data found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CTabPane>
      </CTabContent>
    </div>
  )

  const renderUsageTable = () => (
    <div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <CButton size="sm" className="action-btn" onClick={handleAddStockUsage}>
            <CIcon icon={cilPlus} className="me-1" />
            Add
          </CButton>
        </div>

        <div>
          <Pagination
            currentPage={usageCurrentPage}
            totalPages={usageTotalPages}
            onPageChange={handleUsagePageChange}
          />
        </div>
      </div>

      <CNav variant="tabs" className="mb-3 border-bottom">
        <CNavItem>
          <CNavLink
            active={usageActiveTab === 'all'}
            onClick={() => handleUsageTabChange('all')}
            style={{
              cursor: 'pointer',
              borderTop: usageActiveTab === 'all' ? '4px solid #2759a2' : '3px solid transparent',
              color: 'black',
              borderBottom: 'none',
            }}
          >
            All
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={usageActiveTab === 'pending'}
            onClick={() => handleUsageTabChange('pending')}
            style={{
              cursor: 'pointer',
              borderTop:
                usageActiveTab === 'pending' ? '4px solid #2759a2' : '3px solid transparent',
              borderBottom: 'none',
              color: 'black',
            }}
          >
            Pending
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={usageActiveTab === 'all'}>
          <div className="text-center p-4">
            <p>Click on the All tab to view all stock usage records</p>
            <CButton color="primary" onClick={() => navigate('/stock-usage')}>
              Go to Stock Usage
            </CButton>
          </div>
        </CTabPane>
        <CTabPane visible={usageActiveTab === 'pending'}>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('date', 'usage')}
                    className="sortable-header"
                  >
                    Date {getSortIcon('date', 'usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('usageType', 'usage')}
                    className="sortable-header"
                  >
                    Type {getSortIcon('usageType', 'usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('center.centerName', 'usage')}
                    className="sortable-header"
                  >
                    Center {getSortIcon('center.centerName', 'usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('remark', 'usage')}
                    className="sortable-header"
                  >
                    Remark {getSortIcon('remark', 'usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('customer.username', 'usage')}
                    className="sortable-header"
                  >
                    Detail {getSortIcon('customer.username', 'usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('createdAt', 'usage')}
                    className="sortable-header"
                  >
                    Created At {getSortIcon('createdAt', 'usage')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loadingTabs.usage ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      <CSpinner size="sm" /> Loading usage data...
                    </CTableDataCell>
                  </CTableRow>
                ) : usageData.length > 0 ? (
                  usageData.map((item) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell>
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => navigate(`/edit-stockUsage/${item._id}`)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#337ab7',
                          }}
                        >
                          {formatDate(item.date)}
                        </button>
                      </CTableDataCell>
                      <CTableDataCell>Damage Return</CTableDataCell>
                      <CTableDataCell>{item.center?.centerName || ''}</CTableDataCell>
                      <CTableDataCell>{item.remark || ''}</CTableDataCell>
                      <CTableDataCell>Pending Damage Return</CTableDataCell>
                      <CTableDataCell>{formatDateTime(item.createdAt)}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      No pending damage return records found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CTabPane>
      </CTabContent>
    </div>
  )

  const renderAvailableStockTable = () => (
    <div>
     
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div></div>

        <div>
          <Pagination
            currentPage={stockCurrentPage}
            totalPages={stockTotalPages}
            onPageChange={handleStockPageChange}
          />
        </div>
      </div>

      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className="responsive-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell
                scope="col"
                onClick={() => handleSort('centerName', 'availableStock')}
                className="sortable-header"
              >
                Center {getSortIcon('centerName', 'availableStock')}
              </CTableHeaderCell>
              <CTableHeaderCell
                scope="col"
                onClick={() => handleSort('productName', 'availableStock')}
                className="sortable-header"
              >
                Product {getSortIcon('productName', 'availableStock')}
              </CTableHeaderCell>
              <CTableHeaderCell
                scope="col"
                onClick={() => handleSort('productCategory.name', 'availableStock')}
                className="sortable-header"
              >
                Category {getSortIcon('productCategory.name', 'availableStock')}
              </CTableHeaderCell>
              <CTableHeaderCell
                scope="col"
                onClick={() => handleSort('availableQuantity', 'availableStock')}
                className="sortable-header"
              >
                Stock {getSortIcon('availableQuantity', 'availableStock')}
              </CTableHeaderCell>
              <CTableHeaderCell
                scope="col"
                onClick={() => handleSort('damagedQuantity', 'availableStock')}
                className="sortable-header"
              >
                Damage {getSortIcon('damagedQuantity', 'availableStock')}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loadingTabs.availableStock ? (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  <CSpinner size="sm" /> Loading available stock data...
                </CTableDataCell>
              </CTableRow>
            ) : availableStockData.length > 0 ? (
              availableStockData.map((item) => (
                <CTableRow key={item._id}>
                  <CTableDataCell>{item.centerName || ''}</CTableDataCell>
                  <CTableDataCell>{item.productName}</CTableDataCell>
                  <CTableDataCell>{item.productCategory?.name || ''}</CTableDataCell>
                  <CTableDataCell>{item.availableQuantity || 0}</CTableDataCell>
                  <CTableDataCell>{item.damagedQuantity || 0}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  No available stock data found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )

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
        Error loading center profile: {error}
      </div>
    )
  }

  if (!center) {
    return (
      <div className="alert alert-warning" role="alert">
        Center not found
      </div>
    )
  }

  const handleBack = () => {
    navigate('/center-list')
  }

  return (
    <CContainer fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="title-container">
          <CButton size="sm" className="back-button me-3" onClick={handleBack}>
            <i className="fa fa-fw fa-arrow-left"></i>Back
          </CButton>
          <h1 className="title">Center Details</h1>
        </div>
      </div>

      <CCard className="profile-card">
        <div className="subtitle">{center.centerName}</div>
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="label-cell">Name:</td>
                <td className="value-cell">{center.centerName || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Email:</td>
                <td className="value-cell">{center.email || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Mobile:</td>
                <td className="value-cell">{center.mobile || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Code:</td>
                <td className="value-cell">{center.centerCode || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Type:</td>
                <td className="value-cell">{center.centerType || 'Center'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Address:</td>
                <td className="value-cell">{center.addressLine1 || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">City:</td>
                <td className="value-cell">{center.city || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">State:</td>
                <td className="value-cell">{center.state || 'N/A'}</td>
              </tr>
              <tr className="table-row">
                <td className="label-cell">Center Debit:</td>
                <td className="value-cell">{center.centerDebit || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <CCard className="table-container mt-4">
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'indent'}
                onClick={() => handleTabChange('indent')}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === 'indent' ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none',
                }}
              >
                Indent
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'usage'}
                onClick={() => handleTabChange('usage')}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === 'usage' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black',
                }}
              >
                Usage
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'availableStock'}
                onClick={() => handleTabChange('availableStock')}
                style={{
                  cursor: 'pointer',
                  borderTop:
                    activeTab === 'availableStock' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black',
                }}
              >
                Available Stock
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane visible={activeTab === 'indent'}>{renderIndentTable()}</CTabPane>
            <CTabPane visible={activeTab === 'usage'}>{renderUsageTable()}</CTabPane>
            <CTabPane visible={activeTab === 'availableStock'}>
              {renderAvailableStockTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default CenterProfile