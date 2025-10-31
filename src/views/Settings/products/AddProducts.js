import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { useAlert } from 'src/context/AlertContext';
import { CAlert } from '@coreui/react';

const AddProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    productCategory: '',
    productTitle: '',
    productCode: '',
    productPrice: '',
    productImage: '',
    productWeight: '',
    productBarcode: '',
    status: '',
    description: '',
    trackSerialNumber: '',
    repairable: '',
    replaceable: ''
  });
  
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [showDropdown, setShowDropdown] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProducts(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/product-category');
      setCategories(res.data.data);
      setFilteredCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts(id);
    }
  }, [id]);
  
  const fetchProducts = async (productId) => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data.data;
  
      setFormData({
        ...product,
        productCategory: product.productCategory?._id || ''
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, productCategory: value }));

    const filtered = categories.filter((cat) =>
      cat.productCategory.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowDropdown(true);
  };

  const selectCategory = (category) => {
    setFormData((prev) => ({ ...prev, productCategory: category._id }));
    setFilteredCategories(categories);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    ['productCategory', 'productTitle', 'status', 'trackSerialNumber', 'repairable', 'replaceable'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This is a required field';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/products/${id}`, formData);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/products', formData);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
       setTimeout(() => navigate('/product-list'), 1500)
    }  catch (error) {
      console.error('Error saving data:', error);
      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        let fieldErrors = {};
        
        backendErrors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path] = err.msg;
          }
        });
    
        setErrors(fieldErrors);
        setAlert({ type: 'danger', message: error.response.data.message || "Validation failed" });
        return;
      }
    
      let message = 'Failed to save data. Please try again!';
    
      if (error.response) {
        message = error.response.data?.message || error.response.data?.error || message;
      } else if (error.request) {
        message = 'No response from server. Please check your connection.';
      } else {
        message = error.message;
      }
    
      setAlert({ type: 'danger', message });
    }
  }
  
  const handleReset = () => {
    setFormData({
      productCategory: '',
      productTitle: '',
      productCode: '',
      productPrice: '',
      productImage: '',
      productWeight: '',
      productBarcode: '',
      status: '',
      description: '',
      trackSerialNumber: '',
      repairable: '',
      replaceable: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Product</div>
      <div className="form-card">
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
                  ${errors.productCategory ? 'error-label' : formData.productCategory ? 'valid-label' : ''}`}
                 htmlFor="productCategory">
                Product Category<span className="required">*</span>
                </label>

                 <input
                  type="text"
                  id="productCategory"
                  name="productCategory"
                  className={`form-input 
                    ${errors.productCategory ? 'error-input' : formData.productCategory ? 'valid-input' : ''}`}
                  value={
                    categories.find((c) => c._id === formData.productCategory)?.productCategory ||
                    formData.productCategory
                  }
                  onChange={handleCategoryChange}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && filteredCategories.length > 0 && (
                  <ul className="dropdown-list">
                    {filteredCategories.map((cat) => (
                      <li
                        key={cat._id}
                        className="dropdown-item"
                        onClick={() => selectCategory(cat)}
                      >
                        {cat.productCategory}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.productCategory && <span className="error">{errors.productCategory}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.productTitle ? 'error-label' : formData.productTitle ? 'valid-label' : ''}`}
                htmlFor="productTitle">
                  Product Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="productTitle"
                  name="productTitle"
                  className={`form-input 
                  ${errors.productTitle ? 'error-input' : formData.productTitle ? 'valid-input' : ''}`}
                  value={formData.productTitle}
                  onChange={handleChange}
                />
                {errors.productTitle && <span className="error">{errors.productTitle}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="productCode">
                  Product Code
                </label>
                <input
                  type="text"
                  id="productCode"
                  name="productCode"
                  className="form-input"
                  value={formData.productCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label className="form-label" htmlFor="productPrice">
                  Product Price
                </label>
                <input
                  type="text"
                  id="productPrice"
                  name="productPrice"
                  className="form-input"
                  value={formData.productPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="productImage">
                  Product Image
                </label>
                <input
                  type="file"
                  id="productImage"
                  name="productImage"
                  className="form-input"
                  value={formData.productImage}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="productWeight">
                  Product Weight
                </label>
                <input
                  type="tel"
                  id="productWeight"
                  name="productWeight"
                  className="form-input"
                  value={formData.productWeight}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
            <div className="form-group">
                <label className="form-label" htmlFor="productBarcode">
                  Product Barcode
                </label>
                <input
                  type="text"
                  id="productBarcode"
                  name="productBarcode"
                  className="form-input"
                  value={formData.productBarcode}
                  onChange={handleChange}
                />
              </div>
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
                <label className="form-label" htmlFor="description">
                  Product Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
             
            </div>
            
          
            <div className="form-row">
               <div className="form-group">
                <label 
                className={`form-label 
                ${errors.trackSerialNumber ? 'error-label' : formData.trackSerialNumber ? 'valid-label' : ''}`} 
                htmlFor="trackSerialNumber">
                Track Serial Number <span className="required">*</span>
                </label>
                <select 
                  className={`form-input 
                  ${errors.trackSerialNumber ? 'error-input' : formData.trackSerialNumber ? 'valid-input' : ''}`}
                  id="trackSerialNumber"
                  name="trackSerialNumber"
                  value={formData.trackSerialNumber}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.trackSerialNumber && <span className="error">{errors.trackSerialNumber}</span>}
              </div>
              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.repairable ? 'error-label' : formData.repairable ? 'valid-label' : ''}`} 
                htmlFor="repairable">
                Repairable <span className="required">*</span>
                </label>
                <select 
                  className={`form-input 
                  ${errors.repairable ? 'error-input' : formData.repairable ? 'valid-input' : ''}`}
                  id="repairable"
                  name="repairable"
                  value={formData.repairable}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.repairable && <span className="error">{errors.repairable}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.replaceable ? 'error-label' : formData.replaceable ? 'valid-label' : ''}`}
                htmlFor="replaceable">
                Replaceable <span className="required">*</span>
                </label>
                <select 
                  className={`form-input 
                  ${errors.replaceable ? 'error-input' : formData.replaceable ? 'valid-input' : ''}`} 
                  id="replaceable"
                  name="replaceable"
                  value={formData.replaceable}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.replaceable && <span className="error">{errors.replaceable}</span>}
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
        </div>
      </div>
    </div>
  );
};

export default AddProducts;