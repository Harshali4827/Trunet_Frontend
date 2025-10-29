import React, { useState} from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/search.css';
import DatePicker from 'src/utils/DatePicker';

const SearchTransferModel = ({ visible, onClose, onSearch, centers, outlets }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    outlet: '',
    statusChanged: 'Any Status',
    transferNo: '',
    currentStatus: 'Any Status',
    startDate: '',
    endDate: '',
    statusStartDate: '',
    statusEndDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      const formatDateForAPI = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      };
      
      setSearchData(prev => ({ 
        ...prev, 
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate)
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        startDate: '',
        endDate: ''
      }));
    }
  };

  const handleSearch = () => {
    const apiSearchData = {
      keyword: searchData.transferNo,
      center: searchData.center,
      outlet: searchData.outlet,
      status: searchData.currentStatus !== 'Any Status' ? searchData.currentStatus : '',
      statusChanged: searchData.statusChanged !== 'Any Status' ? searchData.statusChanged : ''
    };
    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    }
    if (searchData.statusStartDate && searchData.statusEndDate) {
      apiSearchData.statusStartDate = searchData.statusStartDate;
      apiSearchData.statusEndDate = searchData.statusEndDate;
    }

    console.log('Search Data:', apiSearchData);
    onSearch(apiSearchData);
    onClose();
  }

  return (
    <>
      <CModal size="lg" visible={visible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Search Stock Transfers</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Center</label>
              <CFormSelect
                name="center"
                value={searchData.center}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value="">SELECT</option>
                {centers.map((center) => (
                  <option key={center._id} value={center._id}>
                    {center.centerName}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="form-group">
              <label className="form-label">Outlet</label>
              <CFormSelect
                name="outlet"
                value={searchData.outlet}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value="">SELECT</option>
                {outlets.map((outlet) => (
                  <option key={outlet._id} value={outlet._id}>
                    {outlet.centerName}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </div>
          
          <h5>Date Filter based on status change</h5>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status Changed</label>
              <CFormSelect
                name="currentStatus"
                value={searchData.currentStatus}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value='Any Status'>Any Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Shipped'>Shipped</option>
                <option value='Completed'>Completed</option>
              </CFormSelect>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <DatePicker
                value={searchData.startDate && searchData.endDate 
                  ? `${searchData.startDate.split('-').reverse().join('-')} to ${searchData.endDate.split('-').reverse().join('-')}`
                  : ''}
                onChange={handleDateChange}
                placeholder="Date"
                className="no-radius-input date-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indent No.</label>
              <CFormInput
                type="text"
                name="transferNo"
                value={searchData.transferNo}
                onChange={handleChange}
                className="form-input no-radius-input"
                placeholder="Indent Number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <CFormSelect
                name="currentStatus"
                value={searchData.currentStatus}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value='Any Status'>Any Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Admin_Approved'>Admin Approved</option>
                <option value='Shipped'>Shipped</option>
                <option value='Completed'>Completed</option>
                <option value='Rejected'>Rejected</option>
                <option value='Admin_Rejected'>Admin Rejected</option>
                <option value='Incompleted'>Incompleted</option>
                <option value='Draft'>Draft</option>
              </CFormSelect>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indent Date</label>
              <DatePicker
                value={searchData.startDate && searchData.endDate 
                  ? `${searchData.startDate.split('-').reverse().join('-')} to ${searchData.endDate.split('-').reverse().join('-')}`
                  : ''}
                onChange={handleDateChange}
                placeholder="Indent Date"
                className="no-radius-input date-input"
              />
            </div>
            <div className="form-group">
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSearch}>
            Search
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

SearchTransferModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  outlets: PropTypes.array.isRequired
}

export default SearchTransferModel;