
import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody } from '@coreui/react';
import axiosInstance from 'src/axiosInstance';

const BuildingModel = ({ visible, onClose, onBuildingAdded }) => {

  const [formData, setFormData] = useState({
    center: '',
    buildingName: '',
    displayName: '',
    address1: '',
    address2: '',
    landmark: '',
    pincode: '',
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
        ['center', 'buildingName', 'displayName', 'address1'].forEach((field) => {
          if (!formData[field]) newErrors[field] = 'This field is required';
        });
    
    
        if (Object.keys(newErrors).length) {
          setErrors(newErrors);
          return;
        }
    
        try {
        
            const res = await axiosInstance.post('/buildings', formData);
            if (onBuildingAdded) {
                onBuildingAdded(res.data.data);
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
          center: '',
          buildingName: '',
          displayName: '',
          address1: '',
          address2: '',
          landmark: '',
          pincode: ''
        });
        setErrors({});
        setApiError('');
      };
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Add Building</CModalTitle>
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
                  ${errors.center ? 'error-label' : formData.center ? 'valid-label' : ''}`}  
                htmlFor="center"
                >
                  Center <span className="required">*</span>
                </label>
                <select
                  id="center"
                  name="center"
                  className={`form-input 
                    ${errors.center ? 'error-input' : formData.center ? 'valid-input' : ''}`}
                  value={formData.center}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centerName}
                    </option>
                  ))}
                </select>
                {errors.center && <span className="error">{errors.center}</span>}
              </div>
              <div className="form-group">
                <label 
               className={`form-label 
                ${errors.buildingName ? 'error-label' : formData.buildingName ? 'valid-label' : ''}`} 
                htmlFor="buildingName">
                  Building Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  className={`form-input 
                    ${errors.buildingName ? 'error-input' : formData.buildingName ? 'valid-input' : ''}`}
                  value={formData.buildingName}
                  onChange={handleChange}
                />
                {errors.buildingName && <span className="error">{errors.buildingName}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.displayName ? 'error-label' : formData.displayName ? 'valid-label' : ''}`} 
                htmlFor="displayName">
                  Display Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className={`form-input 
                    ${errors.displayName ? 'error-input' : formData.displayName ? 'valid-input' : ''}`}
                  value={formData.displayName}
                  onChange={handleChange}
                />
                {errors.displayName && <span className="error">{errors.displayName}</span>}
              </div>
            </div>

            <div className="form-row">
             
            <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`} 
                 htmlFor="address1">
                Address Line 1<span className="required">*</span>
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
              <div className="form-group">
                <label className="form-label" htmlFor="address2">
                Address Line 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="form-input"
                  value={formData.address2}
                  onChange={handleChange}
                />
                {errors.address2 && <span className="error">{errors.address2}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="landmark">
                Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className="form-input"
                  value={formData.landmark}
                  onChange={handleChange}
                />
                {errors.landmark && <span className="error">{errors.landmark}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{width:"310px"}}>
                <label className="form-label" htmlFor="pincode">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-input"
                  value={formData.pincode}
                  onChange={handleChange}
                />
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
      </CModalBody>
    </CModal>
  );
};

BuildingModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBuildingAdded: PropTypes.func,
};

export default BuildingModel;
