import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import { CButton } from '@coreui/react';

const AddShiftingRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    customer_id: '',
    address1: '',
    address2: '',
    landmark: '',
    remark: '',
    shiftingAmount: '',
    wireChangeAmount: ''
  });

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
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

  const fetchShiftingRequest = async (requestId) => {
    try {
      const res = await axiosInstance.get(`/shifting-requests/${requestId}`);
      const data = res.data.data;
      
      setFormData({
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        customer: data.customer || '',
        customer_id: data.customer_id || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        landmark: data.landmark || '',
        remark: data.remark || '',
        shiftingAmount: data.shiftingAmount || '',
        wireChangeAmount: data.wireChangeAmount || ''
      });
      
      if (data.customer) {
        setCustomerSearchTerm(data.customer);
      }
    } catch (error) {
      console.error('Error fetching shifting request:', error);
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
    setFormData(prev => ({
      ...prev,
      customer: value,
      customer_id: ''
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer.name || customer.username,
      customer_id: customer._id || customer.id,
      address1: customer.address || '',
      mobile: customer.mobile || ''
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
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.address1) newErrors.address1 = 'Address 1 is required';
    if (!formData.remark) newErrors.remark = 'Remark is required';
    if (!formData.shiftingAmount) newErrors.shiftingAmount = 'Shifting Amount is required';
    if (!formData.wireChangeAmount) newErrors.wireChangeAmount = 'Wire Change Amount is required';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        date: formData.date
      };

      if (id) {
        await axiosInstance.put(`/shifting-requests/${id}`, payload);
      } else {
        await axiosInstance.post('/shifting-requests', payload);
      }
      navigate('/shifting-request-list');
    } catch (error) {
      console.error('Error saving shifting request:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customer: '',
      customer_id: '',
      address1: '',
      address2: '',
      landmark: '',
      remark: '',
      shiftingAmount: '',
      wireChangeAmount: ''
    });
    setCustomerSearchTerm('');
    setErrors({});
  };

  const handleBack = () => {
    navigate('/shifting-request');
  };

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
                  />
                </div>
                {showCustomerDropdown && (
                  <div className="select-dropdown">
                    <div className="select-dropdown-header">
                      <span>Select Customer</span>
                    </div>
                    <div className="select-list">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer._id || customer.id}
                            className="select-item"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="select-name">
                              {customer.username}-{customer.mobile}
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
                <label className="form-label" htmlFor="landmark">
                  City
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className="form-input"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder='New Mumbai'
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