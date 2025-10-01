import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert } from '@coreui/react'

const AddCenter = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    centerType: '',
    centerName: '',
    centerCode: '',
    email: '',
    mobile: '',
    status: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    stockVerified: '',
    partnerId: '',
    areaId: ''
  });
  
  const [centers, setCenters] = useState([]);
  const [partners, setPartners] = useState([]);
  const [areas, setAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centersRes = await axiosInstance.get('/centers');
        setCenters(centersRes.data.data || []);
      
        const partnersRes = await axiosInstance.get('/partners');
        setPartners(partnersRes.data.data || []);
        
        const areasRes = await axiosInstance.get('/areas');
        setAreas(areasRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCenter(id);
    }
  }, [id]);

  const fetchCenter = async (centerId) => {
    try {
      const res = await axiosInstance.get(`/centers/${centerId}`);
      const data = res.data.data;
  
      setFormData({
        centerType: data.centerType || '',
        centerName: data.centerName || '',
        centerCode: data.centerCode || '',
        email: data.email || '',
        mobile: data.mobile || '',
        status: data.status || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        state: data.state || '',
        stockVerified: data.stockVerified || '',
        partnerId: data.partner?._id || '',  
        areaId: data.area?._id || ''         
      });
    } catch (error) {
      console.error('Error fetching center:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    ['partnerId', 'areaId', 'centerType', 'centerName', 'centerCode', 'email','status' ].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/centers/${id}`, formData)
        setAlert({ type: 'success', message: 'Center updated successfully!' })
      } else {
        await axiosInstance.post('/centers', formData)
        setAlert({ type: 'success', message: 'Center added successfully!' })
      }
      setTimeout(() => navigate('/center-list'), 1500)
    } catch (error) {
      console.error('Error saving center:', error)
    
      let message = 'Failed to save center. Please try again!'
    
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
      centerType: '',
      centerName: '',
      centerCode: '',
      email: '',
      mobile: '',
      status: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      stockVerified: '',
      partnerId: '',
      areaId: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Center</div>
      <div className="form-card">
        <div className="form-header">
          Center
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
                  ${errors.centerType ? 'error-label' : formData.centerType ? 'valid-label' : ''}`}
                htmlFor="centerType">
                  Center Type <span className="required">*</span>
                </label>
                <select 
                 className={`form-input 
                  ${errors.centerType ? 'error-input' : formData.centerType ? 'valid-input' : ''}`} 
                  id="centerType"
                  name="centerType"
                  value={formData.centerType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Center">Center</option>
                  <option value="Outlet">Outlet</option>
                </select>
                {errors.centerType && <span className="error">{errors.centerType}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.centerName ? 'error-label' : formData.centerName ? 'valid-label' : ''}`} 
                htmlFor="centerName">
                  Center Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="centerName"
                  name="centerName"
                  className={`form-input 
                  ${errors.centerName ? 'error-input' : formData.centerName ? 'valid-input' : ''}`}
                  value={formData.centerName}
                  onChange={handleChange}
                />
                {errors.centerName && <span className="error">{errors.centerName}</span>}
              </div>

              <div className="form-group">
              </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.centerCode ? 'error-label' : formData.centerCode ? 'valid-label' : ''}`}
                htmlFor="centerCode">
                  Center Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="centerCode"
                  name="centerCode"
                  className={`form-input 
                  ${errors.centerCode ? 'error-input' : formData.centerCode ? 'valid-input' : ''}`}
                  value={formData.centerCode}
                  onChange={handleChange}
                />
                {errors.centerCode && <span className="error">{errors.centerCode}</span>}
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
                <label className="form-label" htmlFor="mobile">
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.status ? 'error-label' : formData.status ? 'valid-label' : ''}`}
                htmlFor="status">
                  Status <span className="required">*</span>
                </label>
                 <select 
                 className={`form-input 
                  ${errors.status ? 'error-input' : formData.status ? 'valid-input' : ''}`}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  >
                  <option value="">SELECT</option>
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
                {errors.status && <span className="error">{errors.status}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="addressLine1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  className="form-input"
                  value={formData.addressLine1}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addressLine2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  className="form-input"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>
            </div>
            
          
            <div className="form-row">
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
              
              <div className="form-group">
                <label className="form-label" htmlFor="stockVerified">
                  Stock Verified
                </label>
                <select 
                  className="form-input" 
                  id="stockVerified"
                  name="stockVerified"
                  value={formData.stockVerified}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
            </div>
            
  
            <div className="form-row">
              <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.partnerId ? 'error-label' : formData.partnerId ? 'valid-label' : ''}`} 
                htmlFor="partnerId">
                  Partner Name <span className="required">*</span>
                </label>
                <select
                  className={`form-input 
                  ${errors.partnerId ? 'error-input' : formData.partnerId ? 'valid-input' : ''}`}
                  id="partnerId"
                  name="partnerId"
                  value={formData.partnerId}
                  onChange={handleChange}
                >
                  <option value="">SELECT PARTNER</option>
                  {partners.map(partner => (
                    <option key={partner.id} value={partner._id}>
                      {partner.partnerName}
                    </option>
                  ))}
                </select>
                {errors.partnerId && <span className="error">{errors.partnerId}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.areaId ? 'error-label' : formData.areaId ? 'valid-label' : ''}`} 
                htmlFor="areaId">
                Area Name <span className="required">*</span>
                </label>
                <select
                  className={`form-input 
                    ${errors.areaId ? 'error-input' : formData.areaId ? 'valid-input' : ''}`}
                  id="areaId"
                  name="areaId"
                  value={formData.areaId}
                  onChange={handleChange}
                >
                  <option value="">SELECT AREA</option>
                  {areas.map(area => (
                    <option key={area.id} value={area._id}>
                      {area.areaName}
                    </option>
                  ))}
                </select>
                {errors.areaId && <span className="error">{errors.areaId}</span>}
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

export default AddCenter;