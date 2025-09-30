import React, { useState, useEffect, useRef } from 'react'
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
import './search.css'

const SearchStockModel = ({ visible, onClose, onSearch, centers }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    outlet: '',
    statusChanged: 'Any Status',
    dateRange: '',
    indentNo: '',
    currentStatus: 'Any Status',
    indentDate: ''
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [activeDateField, setActiveDateField] = useState('')
  const [selectedRange, setSelectedRange] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('12:00 AM')
  const [endTime, setEndTime] = useState('11:59 PM')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [nextMonth, setNextMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)))

  const datePickerRef = useRef(null)

  useEffect(() => {
    if (!visible) {
      const today = new Date()
      const formatted = formatDate(today)
      setSearchData({ 
        center: '', 
        outlet: '',
        statusChanged: 'Any Status',
       dateRange: '',
        // dateRange: `${formatted} - ${formatted}`,
        indentNo: '',
        currentStatus: 'Any Status',
        // indentDate: `${formatted} - ${formatted}`
        indentDate:''
      })
      setShowDatePicker(false)
      setSelectedRange('')
      setStartDate('')
      setEndDate('')
      setStartTime('12:00 AM')
      setEndTime('11:59 PM')
    }
  }, [visible])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      center: '', 
      outlet: '',
      statusChanged: 'Any Status',
      dateRange: '',
      indentNo: '',
      currentStatus: 'Any Status',
      indentDate: ''
    })
    onSearch({ 
      center: '', 
      outlet: '',
      statusChanged: 'Any Status',
      dateRange: '',
      indentNo: '',
      currentStatus: 'Any Status',
      indentDate: ''
    })
  }

  const openDatePicker = (fieldName) => {
    setActiveDateField(fieldName)
    setShowDatePicker(true)
    const now = new Date()
    setCurrentMonth(new Date(now))
    setNextMonth(new Date(now.setMonth(now.getMonth() + 1)))
  }

  const handleQuickRangeSelect = (range) => {
    setSelectedRange(range)
    
    const today = new Date()
    let start, end

    switch (range) {
      case 'Today':
        start = today
        end = today
        break
      case 'Yesterday':
        start = new Date(today)
        start.setDate(today.getDate() - 1)
        end = new Date(start)
        break
      case 'This Week':
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay())
        end = new Date(today)
        end.setDate(today.getDate() + (6 - today.getDay()))
        break
      case 'Last Week':
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay() - 7)
        end = new Date(start)
        end.setDate(start.getDate() + 6)
        break
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'Last Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'This Year':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      case 'Last Year':
        start = new Date(today.getFullYear() - 1, 0, 1)
        end = new Date(today.getFullYear() - 1, 11, 31)
        break
      default:
        return
    }

    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
  }

  const applyDateRange = () => {
    if (startDate && endDate) {
      const dateString = `${startDate} to ${endDate}`
  
      if (activeDateField === 'statusChange') {
        setSearchData(prev => ({ ...prev, dateRange: dateString }))
      } else if (activeDateField === 'indentDate') {
        setSearchData(prev => ({ ...prev, indentDate: dateString }))
      }
    }
    setShowDatePicker(false)
  }  

  const cancelDateRange = () => {
    setShowDatePicker(false)
    setSelectedRange('')
    setStartDate('')
    setEndDate('')
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendar = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    const days = []
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i)
      })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(year, month, i)
      })
    }
    

    const totalCells = 42 
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    
    for (let i = 1; days.length < totalCells; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(nextYear, nextMonth, i)
      })
    }
    
    return days
  }

  const navigateMonth = (calendarType, direction) => {
    if (calendarType === 'current') {
      const newMonth = new Date(currentMonth)
      newMonth.setMonth(newMonth.getMonth() + direction)
      setCurrentMonth(newMonth)
      
      const next = new Date(newMonth)
      next.setMonth(next.getMonth() + 1)
      setNextMonth(next)
    } else {
      const newMonth = new Date(nextMonth)
      newMonth.setMonth(newMonth.getMonth() + direction)
      setNextMonth(newMonth)
      
      const current = new Date(newMonth)
      current.setMonth(current.getMonth() - 1)
      setCurrentMonth(current)
    }
  }

  const handleDateSelect = (date, calendarType) => {
    const formattedDate = formatDate(date)
    
    if (calendarType === 'start') {
      setStartDate(formattedDate)
      if (endDate && date > new Date(endDate.split('-').reverse().join('-'))) {
        setEndDate(formattedDate)
      }
    } else {
      setEndDate(formattedDate)
      if (startDate && date < new Date(startDate.split('-').reverse().join('-'))) {
        setStartDate(formattedDate)
      }
    }
  }

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const isDateSelected = (date, type) => {
    const formattedDate = formatDate(date)
    if (type === 'start') {
      return formattedDate === startDate
    } else {
      return formattedDate === endDate
    }
  }
  const handleTimeChange = (type, part, value) => {
    const [hourMinute, ampm] = type === 'start' ? startTime.split(' ') : endTime.split(' ');
    let [hour, minute] = hourMinute.split(':');
  
    if (part === 'hour') hour = value;
    if (part === 'minute') minute = value;
    if (part === 'ampm') ampm = value;
  
    const newTime = `${hour}:${minute} ${ampm}`;
    if (type === 'start') setStartTime(newTime);
    else setEndTime(newTime);
  };
  


  const previewQuickRange = (range) => {
    const today = new Date()
    let start, end
  
    switch (range) {
      case 'Today':
        start = today
        end = today
        break
      case 'Yesterday':
        start = new Date(today)
        start.setDate(today.getDate() - 1)
        end = new Date(start)
        break
      case 'This Week':
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay())
        end = new Date(today)
        end.setDate(today.getDate() + (6 - today.getDay()))
        break
      case 'Last Week':
        start = new Date(today)
        start.setDate(today.getDate() - today.getDay() - 7)
        end = new Date(start)
        end.setDate(start.getDate() + 6)
        break
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'Last Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'This Year':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      case 'Last Year':
        start = new Date(today.getFullYear() - 1, 0, 1)
        end = new Date(today.getFullYear() - 1, 11, 31)
        break
      default:
        return
    }
    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
  }
  
  const DatePickerModal = () => (
    <div className="date-picker-overlay">
      <div ref={datePickerRef} className="date-picker-modal">
        <div className="date-picker-body">
          <div className="date-picker-layout">
            <div className="quick-range-section">
              <div className="quick-range-options">
                {['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'This Year', 'Last Year', 'Custom Range'].map((range) => (
                  <button
                    key={range}
                    className={`quick-range-btn ${selectedRange === range ? 'active' : ''}`}
                    onMouseEnter={() => previewQuickRange(range)}
                    onClick={() => handleQuickRangeSelect(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="custom-range-label">
              <CButton color="success text-white" className='me-2' onClick={applyDateRange}>
            Apply
          </CButton>
              <CButton color="secondary" onClick={cancelDateRange}>
            Cancel
          </CButton>
              </div>
            </div>

            <div className="calendar-section">
              <div className="dual-calendar-container">
                <div className="calendar-wrapper">
                <div className='calender-input'>
                  <input
                  type='text'
                  value={startDate || formatDate(new Date())}
                  />
                </div>
<div className="time-input-wrapper">
    <span className="clock-icon">⏰</span>
    <select
      value={startTime.split(':')[0]}
      onChange={(e) => handleTimeChange('start', 'hour', e.target.value)}
      className="time-select"
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>

    <span>:</span>

    <select
      value={startTime.split(':')[1].split(' ')[0]}
      onChange={(e) => handleTimeChange('start', 'minute', e.target.value)}
      className="time-select"
    >
      {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
        <option key={minute} value={minute}>
          {minute}
        </option>
      ))}
    </select>

    <select
      value={startTime.split(' ')[1]}
      onChange={(e) => handleTimeChange('start', 'ampm', e.target.value)}
      className="time-select"
    >
      {['AM', 'PM'].map((ampm) => (
        <option key={ampm} value={ampm}>
          {ampm}
        </option>
      ))}
    </select>
  </div>
                  <div className="calendar-header">
                    <button onClick={() => navigateMonth('current', -1)}>‹</button>
                    <span>{currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                    <button onClick={() => navigateMonth('current', 1)}>›</button>
                  </div>
                  <div className="calendar">
                    <div className="week-days">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="week-day">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {generateCalendar(currentMonth).map((dayObj, index) => (
                        <div
                          key={index}
                          className={`calendar-day ${dayObj.month !== 'current' ? 'other-month' : ''} ${
                            isDateSelected(dayObj.date, 'start') ? 'selected-start' : ''
                          } ${isDateSelected(dayObj.date, 'end') ? 'selected-end' : ''}`}
                          onClick={() => handleDateSelect(dayObj.date, 'start')}
                        >
                          {dayObj.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="calendar-wrapper">
                <div className='calender-input'>
                  <input
                  type='text'
                  value={endDate || formatDate(new Date())}
                  />
                </div>
                <div className="time-input-wrapper">
        
    <span className="clock-icon">⏰</span>
    <select
      value={startTime.split(':')[0]}
      onChange={(e) => handleTimeChange('start', 'hour', e.target.value)}
      className="time-select"
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>

    <span>:</span>

    <select
      value={startTime.split(':')[1].split(' ')[0]}
      onChange={(e) => handleTimeChange('start', 'minute', e.target.value)}
      className="time-select"
    >
      {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
        <option key={minute} value={minute}>
          {minute}
        </option>
      ))}
    </select>

    <select
      value={startTime.split(' ')[1]}
      onChange={(e) => handleTimeChange('start', 'ampm', e.target.value)}
      className="time-select"
    >
      {['AM', 'PM'].map((ampm) => (
        <option key={ampm} value={ampm}>
          {ampm}
        </option>
      ))}
    </select>
  </div>
                  <div className="calendar-header">
                    <button onClick={() => navigateMonth('next', -1)}>‹</button>
                    <span>{nextMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                    <button onClick={() => navigateMonth('next', 1)}>›</button>
                  </div>

                  <div className="calendar">
                    <div className="week-days">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="week-day">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {generateCalendar(nextMonth).map((dayObj, index) => (
                        <div
                          key={index}
                          className={`calendar-day ${dayObj.month !== 'current' ? 'other-month' : ''} ${
                            isDateSelected(dayObj.date, 'end') ? 'selected-end' : ''
                          } ${isDateSelected(dayObj.date, 'start') ? 'selected-start' : ''}`}
                          onClick={() => handleDateSelect(dayObj.date, 'end')}
                        >
                          {dayObj.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <CModal size="lg" visible={visible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Search</CModalTitle>
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
                {centers.map((center) => (
                  <option key={center._id} value={center._id}>
                    {center.centerName}
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
                name="statusChanged"
                value={searchData.statusChanged}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value='Any Status'>Any Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Rejected'>Rejected</option>
                <option value='Shipped'>Shipped</option>
              </CFormSelect>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <CFormInput
                type="text"
                value={searchData.dateRange}
                readOnly
                className="form-input no-radius-input date-input"
                onClick={() => openDatePicker('statusChange')}
                placeholder="Date"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indent No.</label>
              <CFormInput
                type="text"
                name="indentNo"
                value={searchData.indentNo}
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
                <option value='Rejected'>Rejected</option>
                <option value='Shipped'>Shipped</option>
                <option value='Completed'>Completed</option>
                <option value='Incomplete'>Incomplete</option>
              </CFormSelect>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indent Date</label>
              <CFormInput
                type="text"
                value={searchData.indentDate}
                readOnly
                className="form-input no-radius-input date-input"
                onClick={() => openDatePicker('indentDate')}
                placeholder="Indent Date"
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

      {showDatePicker && <DatePickerModal />}
    </>
  )
}

SearchStockModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired
}

export default SearchStockModel