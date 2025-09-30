
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody } from '@coreui/react';
import axiosInstance from 'src/axiosInstance';

const CustomerModel = ({ visible, onClose, onCustomerAdded }) => {

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        mobile: '',
        email: '',
        centerId: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
      });    
      const [centers, setCenters] = useState([]);
      const [errors, setErrors] = useState({});
      const [apiError, setApiError] = useState(''); 
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setApiError('');
      };
    
      useEffect(() => {
        const fetchCenters = async () => {
          try {
            const res = await axiosInstance.get('/centers');
            setCenters(res.data.data || []);
          } catch (error) {
           console.log(error)
          }
        };
        fetchCenters();
      }, []);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        ['username', 'mobile', 'email', 'centerId', 'address1'].forEach((field) => {
          if (!formData[field]) newErrors[field] = 'This is a required field';
        });    
    
        if (Object.keys(newErrors).length) {
          setErrors(newErrors);
          return;
        }
    
        try {
        
            const res = await axiosInstance.post('/customers', formData);
            if (onCustomerAdded) {
                onCustomerAdded(res.data.data);
              }
            onClose();
        } catch (error) {
            console.error('Error saving data:', error);
            if (error.response?.data?.message) {
              setApiError(error.response.data.message);
            } else {
              setApiError('Something went wrong. Please try again.');
            }
          }
      };
    
      const handleReset = () => {
        setFormData({
            username: '',
            name: '',
            mobile: '',
            email: '',
            centerId: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
          });
        setErrors({});
        setApiError('');
      };
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Add Customer</CModalTitle>
      </CModalHeader>
      <CModalBody>
      {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}
      <form onSubmit={handleSubmit}>
      <div className="form-row">
              <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.username ? 'error-label' : formData.username ? 'valid-label' : ''}`}
                htmlFor="username">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                 className={`form-input 
                  ${errors.username ? 'error-input' : formData.username ? 'valid-input' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label  
                className={`form-label 
                  ${errors.email ? 'error-label' : formData.email ? 'valid-label' : ''}`}
                htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input 
                    ${errors.email ? 'error-input' : formData.email ? 'valid-input' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className={`form-label 
                  ${errors.centerId ? 'error-label' : formData.centerId ? 'valid-label' : ''}`}
                  htmlFor="centerId">
                  Center <span className="required">*</span>
                </label>
                <select
                  id="centerId"
                  name="centerId"
                  className={`form-input 
                    ${errors.centerId ? 'error-input' : formData.centerId ? 'valid-input' : ''}`}
                  value={formData.centerId}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centerName}
                    </option>
                  ))}
                </select>
                {errors.centerId && <span className="error">{errors.centerId}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.mobile ? 'error-label' : formData.mobile ? 'valid-label' : ''}`} htmlFor="mobile">
                  Mobile <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className={`form-input 
                    ${errors.mobile ? 'error-input' : formData.mobile ? 'valid-input' : ''}`}
                  value={formData.mobile}
                  onChange={handleChange}
                />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>

              <div className="form-group">
                <label 
                 className={`form-label 
                  ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`} 
                  htmlFor="address1">
                  Address 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={`form-input 
                  ${errors.address1 ? 'error-input' : formData.address1 ? 'valid-input' : ''}`}
                  value={formData.address1}
                  onChange={handleChange}
                />
                {errors.address1 && <span className="error">{errors.address1}</span>}
              </div>
            </div>

            <div className="form-row">
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
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
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
      </CModalBody>
    </CModal>
  );
};

CustomerModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCustomerAdded: PropTypes.func,
};

export default CustomerModel;
