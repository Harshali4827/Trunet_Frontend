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
    resellerId:'',
    areaId: '',
  });
  
  const [centers, setCenters] = useState([]);
  const [areas, setAreas] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centersRes = await axiosInstance.get('/centers');
        setCenters(centersRes.data.data || []);
        
        const resellersRes = await axiosInstance.get('/resellers');
        setResellers(resellersRes.data.data || []);

        // const areasRes = await axiosInstance.get('/areas');
        // setAreas(areasRes.data.data || []);
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

  useEffect(() => {
    if (formData.resellerId) {
      fetchAreasByReseller(formData.resellerId);
    } else {
      setAreas([]);
      setFormData(prev => ({ ...prev, areaId: '' }));
    }
  }, [formData.resellerId]);

  const fetchAreasByReseller = async (resellerId) => {
    try {
      const response = await axiosInstance.get(`/areas/reseller/${resellerId}`);
      setAreas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

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
        resellerId: data.reseller?._id || '',  
        areaId: data.area?._id || '' ,       
      });
      if (data.reseller?._id) {
        fetchAreasByReseller(data.reseller._id);
      }
    } catch (error) {
      console.error('Error fetching center:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resellerId') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        areaId: '' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    const requiredFields = ['resellerId', 'areaId', 'centerType', 'centerName', 'centerCode', 'status'];
    
    requiredFields.forEach((field) => {
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
      resellerId:'',
      areaId: '',
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Storage Outlet</div>
      <div className="form-card">
        <div className="form-header">
          Outlet
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
                  Outlet Type <span className="required">*</span>
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
                  <option value="Outlet">Warehouse</option>
                </select>
                {errors.centerType && <span className="error">{errors.centerType}</span>}
              </div>
              <div className="form-group">
                  <label 
                  className={`form-label 
                    ${errors.resellerId ? 'error-label' : formData.resellerId ? 'valid-label' : ''}`} 
                  htmlFor="resellerId">
                  Reseller Name <span className="required">*</span>
                  </label>
                  <select
                    className={`form-input 
                      ${errors.resellerId ? 'error-input' : formData.resellerId ? 'valid-input' : ''}`}
                    id="resellerId"
                    name="resellerId"
                    value={formData.resellerId}
                    onChange={handleChange}
                  >
                    <option value="">SELECT RESELLER</option>
                    {resellers.map(reseller => (
                      <option key={reseller.id} value={reseller._id}>
                        {reseller.businessName}
                      </option>
                    ))}
                  </select>
                  {errors.resellerId && <span className="error">{errors.resellerId}</span>}
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
                className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input" 
                  value={formData.email}
                  onChange={handleChange}
                />
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
                  disabled={!formData.resellerId} 
                >
                   <option value="">
                    {formData.resellerId ? 'SELECT AREA' : 'SELECT RESELLER FIRST'}
                  </option>
                  {areas.map(area => (
                    <option key={area.id} value={area._id}>
                      {area.areaName}
                    </option>
                  ))}
                </select>
                {errors.areaId && <span className="error">{errors.areaId}</span>}
              </div>
              <div className="form-group"></div>
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