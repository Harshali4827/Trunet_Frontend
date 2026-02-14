
import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import DatePicker from 'src/utils/DatePicker'
import Select from 'react-select'

const ReportSearchmodel = ({ visible, onClose, onSearch, centers, initialSearchData }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    date: ''
  })
  const formatDateForPicker = (dateValue) => {
    if (!dateValue) return '';

    if (dateValue.includes(' to ')) {
      return dateValue;
    }

    return dateValue;
  };

  useEffect(() => {
    if (visible) {
      if (initialSearchData) {
        setSearchData({
          center: initialSearchData.center || '',
          date: formatDateForPicker(initialSearchData.date) || ''
        });
      } else {
        setSearchData({ center: '', date: '' });
      }
    }
  }, [visible, initialSearchData])


  const handleDateChange = (dateValue) => {
    setSearchData(prev => ({ ...prev, date: dateValue }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleClose = () => {
    if (initialSearchData) {
      setSearchData({
        center: initialSearchData.center || '',
        date: formatDateForPicker(initialSearchData.date) || ''
      });
    } else {
      setSearchData({ center: '', date: '' });
    }
    onClose()
  }
  const handleReset = () => {
    setSearchData({ center: '', date: '' });
  }

  return (
    <CModal size="lg" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Date
            </label>
            <DatePicker
              value={searchData.date}
              onChange={handleDateChange}
              placeholder="Date"
              className="no-radius-input date-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="center">
              Branch
            </label>
            <Select
    id="center"
    name="center"
    placeholder="Select Branch..."
    value={
      searchData.center
        ? {
            value: searchData.center,
            label: centers.find((c) => c._id === searchData.center)
              ? centers.find((c) => c._id === searchData.center).centerName
              : "",
          }
        : null
    }
    onChange={(selected) =>
      setSearchData((prev) => ({
        ...prev,
        center: selected ? selected.value : "",
      }))
    }
    options={centers.map((center) => ({
      value: center._id,
      label: center.centerName,
    }))}
    isClearable
    classNamePrefix="react-select"
    className="no-radius-input"
  />
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Clear
        </CButton>
        <CButton 
          className='reset-button'
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ReportSearchmodel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  initialSearchData: PropTypes.object
}

ReportSearchmodel.defaultProps = {
  initialSearchData: null
}

export default ReportSearchmodel