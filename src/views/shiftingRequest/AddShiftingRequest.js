import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import { CButton } from '@coreui/react';
import { CAlert } from '@coreui/react';

const AddShiftingRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    toCenter: '',
    customer: '',
    address1: '',
    address2: '',
    city: '',
    remark: ''
  });

  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchCenters();
    if (id) {
      fetchShiftingRequest(id);
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/customers');
      setCustomers(res.data.data || []);
      setFilteredCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers');
      setCenters(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShiftingRequest = async (requestId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/shiftingRequest/${requestId}`);
      
      if (res.data.success) {
        const data = res.data.data;

        setFormData({
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          toCenter: data.toCenter?._id || data.toCenter || '',
          customer: data.customer?._id || data.customer || '',
          address1: data.address1 || '',
          address2: data.address2 || '',
          city: data.city || '',
          remark: data.remark || '',
        });
        if (data.customer) {
          setCustomerSearchTerm(data.customer.name || data.customer.username || '');
        }
      }
    } catch (error) {
      console.error('Error fetching shifting request:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer =>
        customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.username?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.mobile?.toString().includes(customerSearchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchTerm, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCustomerSearchChange = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
  
    if (!value.trim()) {
      setFormData(prev => ({
        ...prev,
        customer: ''
      }));
    }
    
    setShowCustomerDropdown(true);
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer._id,
      address1: customer.address1 || customer.address || '',
      address2: customer.address2 || '',
      city: customer.city || ''
    }));
    setCustomerSearchTerm(customer.name || customer.username);
    setShowCustomerDropdown(false);
  };

  const handleCustomerInputFocus = () => {
    setShowCustomerDropdown(true);
  };

  const handleCustomerInputBlur = () => {
    setTimeout(() => {
      setShowCustomerDropdown(false);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.date) newErrors.date = 'This is a required field';
    if (!formData.toCenter) newErrors.toCenter = 'This is a required field';
    if (!formData.customer) newErrors.customer = 'This is a required field';
    if (!formData.address1) newErrors.address1 = 'This is a required field';
    if (!formData.remark) newErrors.remark = 'This is a required field';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        date: formData.date,
        toCenter: formData.toCenter,
        customer: formData.customer,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        remark: formData.remark
      };

      if (id) {
        await axiosInstance.put(`/shiftingRequest/${id}`, payload);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/shiftingRequest', payload);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
      setTimeout(() =>navigate('/shifting-request'),1500)
    } catch (error) {
      console.error('Error saving shifting request:', error);
      let message = 'Failed to save Data. Please try again!'
    
      if (error.response) {
        message = error.response.data?.message || error.response.data?.error || message
      } else if (error.request) {
        message = 'No response from server. Please check your connection.'
      } else {
        message = error.message
      }
    
      setAlert({ type: 'danger', message })
    }    
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customer: '',
      toCenter: '',
      address1: '',
      address2: '',
      city: '',
      remark: '',
    });
    setCustomerSearchTerm('');
    setErrors({});
  };

  const handleBack = () => {
    navigate('/shifting-request');
  };

  if (loading && id) {
    return (
      <div className="form-container">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">
        <CButton
          size="sm"
          className="back-button me-3"
          onClick={handleBack}
        >
          <i className="fa fa-fw fa-arrow-left"></i>Back
        </CButton>
        {id ? 'Edit' : 'Add'} Shifting Request 
      </div>

      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="form-body">
        {alert.message && (
              <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
              {alert.message}
              </CAlert>
            )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                  htmlFor="date">
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input 
                    ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group select-dropdown-container">
                <label 
                  className={`form-label 
                    ${errors.customer ? 'error-label' : formData.customer ? 'valid-label' : ''}`}>
                  Customer <span className="required">*</span>
                </label>
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    className={`form-input 
                      ${errors.customer ? 'error-input' : formData.customer ? 'valid-input' : ''}`}
                    value={customerSearchTerm}
                    onChange={handleCustomerSearchChange}
                    onFocus={handleCustomerInputFocus}
                    onBlur={handleCustomerInputBlur}
                    placeholder="Search User"
                    disabled={!!id} 
                    
                  />
                </div>
                {showCustomerDropdown && !id && (
                  
                  <div className="select-dropdown">
                    <div className="select-dropdown-header">
                      <span>Select Customer</span>
                    </div>
                    <div className="select-list">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer._id}
                            className="select-item"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="select-name">
                              {customer.name || customer.username} - {customer.mobile}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-select">No customers found</div>
                      )}
                    </div>
                  </div>
                )}
                {errors.customer && <span className="error-text">{errors.customer}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label 
                  ${errors.toCenter ? 'error-label' : formData.toCenter ? 'valid-label' : ''}`}
                  htmlFor="toCenter">
                  To Branch <span className="required">*</span>
                </label>
                <select
                  id="toCenter"
                  name="toCenter"
                  className={`form-input 
                    ${errors.toCenter ? 'error-input' : formData.toCenter ? 'valid-input' : ''}`}
                  value={formData.toCenter}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centerName}
                    </option>
                  ))}
                </select>
                {errors.toCenter && <span className="error-text">{errors.toCenter}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`} 
                  htmlFor="address1">
                  Address 1<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={`form-input 
                    ${errors.address1 ? 'error-input' : formData.address1 ? 'valid-input' : ''}`}
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder='Address1'
                />
                {errors.address1 && <span className="error-text">{errors.address1}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address2">
                  Address 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="form-input"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder='Address2'
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder='City'
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label 
                    ${errors.remark ? 'error-label' : formData.remark ? 'valid-label' : ''}`} 
                  htmlFor="remark">
                  Remark <span className="required">*</span>
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  placeholder='Remark'
                  className={`form-textarea 
                    ${errors.remark ? 'error-input' : formData.remark ? 'valid-input' : ''}`}
                  value={formData.remark}
                  onChange={handleChange}
                  rows="3"
                />
                {errors.remark && <span className="error-text">{errors.remark}</span>}
              </div>
              <div className="form-group"></div>
            </div>

            <div className="form-footer">
              <button type="button" className="reset-button" onClick={handleReset}>
                Reset
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShiftingRequest;