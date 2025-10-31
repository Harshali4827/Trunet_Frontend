

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { CAlert, CButton, CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { cilPlus, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import BuildingFormModal from './BuildingModel';
import CustomerModel from './CustomerModel';
import ControlRoomModel from './ControlRoomModel';
import UsageSerialNumbers from './UsageSerialNumbers';

const AddStockUsage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    usageType: '',
    remark: '',
    customer: '',
    connectionType: '',
    packageAmount: '',
    packageDuration: '',
    onuCharges: '',
    installationCharges: '',
    reason: '',
    fromBuilding: '',
    toBuilding: '',
    controlRoom: '',
    stolenFrom: '',
    address: '',
    shiftingAmount: '',
    wireChangeAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [buildingSearchTerm, setBuildingSearchTerm] = useState('');
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [currentBuildingType, setCurrentBuildingType] = useState(''); 
  const [controlRooms, setControlRooms] = useState([]);
  const [filteredControlRooms, setFilteredControlRooms] = useState([]);
  const [controlRoomSearchTerm, setControlRoomSearchTerm] = useState('');
  const [showControlRoomDropdown, setShowControlRoomDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (id) {
      fetchStockUsage(id);
    }
    fetchCustomers();
    fetchBuildings();
    fetchControlRooms();
    fetchProducts();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleOpenSerialModal = (product) => {
    const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
    if (usageQuantity > 0) {
      setSelectedProduct(product);
      setSerialModalVisible(true);
    }
  };
   
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };
  
  const fetchStockUsage = async (usageId) => {
    try {
      const res = await axiosInstance.get(`/stockusage/${usageId}`);
      const data = res.data.data;
      const apiDate = data.date ? data.date.split('T')[0] : '';
      
      setFormData(prev => ({
        ...prev,
        ...data,
        date: apiDate,
        customer: data.customer?._id || data.customer || '',
        fromBuilding: data.fromBuilding?._id || data.fromBuilding || '',
        toBuilding: data.toBuilding?._id || data.toBuilding || '',
        controlRoom: data.controlRoom?._id || data.controlRoom || ''
      }));
    
      if (data.customer) {
        setCustomerSearchTerm(data.customer.name || data.customer.username || '');
      }
      
      if (data.fromBuilding) {
        setBuildingSearchTerm(data.fromBuilding.buildingName || '');
      }
      
      if (data.controlRoom) {
        setControlRoomSearchTerm(data.controlRoom.buildingName || '');
      }
  
      if (data.items && data.items.length > 0) {
        const existingSelectedRows = {};
        const existingAssignedSerials = {};
        
        data.items.forEach(item => {
          const productId = item.product?.productId || item.product;
          existingSelectedRows[productId] = {
            quantity: item.quantity.toString(),
            productRemark: item.productRemark || '',
            productInStock: item.oldStock || 0
          };
          
          if (item.serialNumbers && item.serialNumbers.length > 0) {
            existingAssignedSerials[productId] = item.serialNumbers;
          }
        });
        
        setSelectedRows(existingSelectedRows);
        setAssignedSerials(existingAssignedSerials);
      }
      
    } catch (error) {
      console.error('Error fetching stock usage:', error);
      showAlert('Failed to fetch stock usage data', 'danger');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/customers');
      setCustomers(res.data.data || []);
      setFilteredCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Failed to fetch customers', 'danger');
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get('/buildings');
      setBuildings(res.data.data || []);
      setFilteredBuildings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      showAlert('Failed to fetch buildings', 'danger');
    }
  };

  const fetchControlRooms = async () => {
    try {
      const res = await axiosInstance.get('/controlRooms');
      setControlRooms(res.data.data || []);
      setFilteredControlRooms(res.data.data || []);
    } catch (error) {
      console.error('Error fetching control rooms:', error);
      showAlert('Failed to fetch control rooms', 'danger');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
      }
      return updated;
    });
  };
  
  const handleUsageQtyChange = (productId, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value
      }
    }));
  };
  
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer =>
        customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.username?.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchTerm, customers]);

  useEffect(() => {
    if (buildingSearchTerm) {
      const filtered = buildings.filter(building =>
        building.buildingName?.toLowerCase().includes(buildingSearchTerm.toLowerCase()) ||
        building.code?.toLowerCase().includes(buildingSearchTerm.toLowerCase())
      );
      setFilteredBuildings(filtered);
    } else {
      setFilteredBuildings(buildings);
    }
  }, [buildingSearchTerm, buildings]);

  useEffect(() => {
    if (controlRoomSearchTerm) {
      const filtered = controlRooms.filter(controlRoom =>
        controlRoom.buildingName?.toLowerCase().includes(controlRoomSearchTerm.toLowerCase()) ||
        controlRoom.code?.toLowerCase().includes(controlRoomSearchTerm.toLowerCase())
      );
      setFilteredControlRooms(filtered);
    } else {
      setFilteredControlRooms(controlRooms);
    }
  }, [controlRoomSearchTerm, controlRooms]);

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
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer:customer._id,
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

  const handleBuildingSearchChange = (e, type = 'from') => {
    const value = e.target.value;
    setBuildingSearchTerm(value);
    setCurrentBuildingType(type);
    
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromBuilding: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: value,
  
      }));
    }
  };

  const handleBuildingSelect = (building, type = 'from') => {
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromBuilding: building._id || building.id,
      }));
      setBuildingSearchTerm(building.buildingName);
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: building._id || building.id,
      }));
    }
    setShowBuildingDropdown(false);
  };

  const handleBuildingInputFocus = (type = 'from') => {
    setCurrentBuildingType(type);
    setShowBuildingDropdown(true);
  };

  const handleBuildingInputBlur = () => {
    setTimeout(() => {
      setShowBuildingDropdown(false);
    }, 200);
  };

  const handleControlRoomSearchChange = (e) => {
    const value = e.target.value;
    setControlRoomSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      controlRoom: value,
    }));
  };

  const handleControlRoomSelect = (controlRoom) => {
    setFormData(prev => ({
      ...prev,
      controlRoom: controlRoom._id || controlRoom.id,
    }));
    setControlRoomSearchTerm(controlRoom.buildingName);
    setShowControlRoomDropdown(false);
  };

  const handleControlRoomInputFocus = () => {
    setShowControlRoomDropdown(true);
  };

  const handleControlRoomInputBlur = () => {
    setTimeout(() => {
      setShowControlRoomDropdown(false);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.usageType) newErrors.usageType = 'Usage Type is required';
    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = 'Please select at least one product';
    }
  
    Object.keys(selectedRows).forEach(productId => {
      const product = products.find(p => p._id === productId);
      const selectedRow = selectedRows[productId];
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid usage quantity for ${product?.productTitle}`;
      }
      
      if (product?.trackSerialNumber === "Yes") {
        const usageQty = parseInt(selectedRow.quantity);
        const assignedSerialsForProduct = assignedSerials[productId] || [];
        
        if (assignedSerialsForProduct.length !== usageQty) {
          newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
        }
      }
    });
  
    if (formData.usageType === 'Customer') {
      if (!formData.customer) newErrors.customer = 'Customer is required';
      if (!formData.connectionType) newErrors.connectionType = 'Previous Connection Type is required';
      if (!formData.packageAmount) newErrors.packageAmount = 'Package Amount is required';
      if (!formData.packageDuration) newErrors.packageDuration = 'Package Duration is required';
      if (!formData.onuCharges) newErrors.onuCharges = 'ONU Charges is required';
      if (!formData.installationCharges) newErrors.installationCharges = 'Installation Charges is required';
      if (!formData.reason) newErrors.reason = 'Reason is required';
    }
    
    if (formData.usageType === 'Building' && !formData.fromBuilding) {
      newErrors.fromBuilding = 'From Building is required';
    }
    
    if (formData.usageType === 'Building to Building') {
      if (!formData.fromBuilding) newErrors.fromBuilding = 'From Building is required';
      if (!formData.toBuilding) newErrors.toBuilding = 'To Building is required';
    }
    
    if (formData.usageType === 'Control Room' && !formData.controlRoom) {
      newErrors.controlRoom = 'Control Room is required';
    }
    
    if (formData.usageType === 'Stolen from Field' && !formData.stolenFrom) {
      newErrors.stolenFrom = 'Stolen From is required';
    }
    
    if (formData.usageType === 'Other' && !formData.address) {
      newErrors.address = 'Address is required';
    }
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
        const items = Object.keys(selectedRows).map(productId => {
        const product = products.find(p => p._id === productId);
        const selectedRow = selectedRows[productId];
        const serialNumbers = assignedSerials[productId] || [];
        
        const item = {
          product: productId,
          quantity: parseInt(selectedRow.quantity),
          productRemark: selectedRow.productRemark || '',
        };
        if (serialNumbers.length > 0) {
          item.serialNumbers = serialNumbers;
        }
        
        return item;
      });
  
      const payload = {
        date: formData.date,
        usageType: formData.usageType,
        remark: formData.remark || '',
        customer: formData.customer || null,
        connectionType: formData.connectionType || null,
        packageAmount: formData.packageAmount ? parseFloat(formData.packageAmount) : 0,
        packageDuration: formData.packageDuration || null,
        onuCharges: formData.onuCharges ? parseFloat(formData.onuCharges) : 0,
        installationCharges: formData.installationCharges ? parseFloat(formData.installationCharges) : 0,
        reason: formData.reason || null,
        shiftingAmount: formData.shiftingAmount ? parseFloat(formData.shiftingAmount) : 0,
        wireChangeAmount: formData.wireChangeAmount ? parseFloat(formData.wireChangeAmount) : 0,
        fromBuilding: formData.fromBuilding || null,
        toBuilding: formData.toBuilding || null,
        fromControlRoom: formData.controlRoom || null,
        stolenFrom: formData.stolenFrom || null,
        address: formData.address || null,
        items: items
      };
  
      console.log('Submitting payload:', payload);
  
      if (id) {
        await axiosInstance.put(`/stockusage/${id}`, payload);
        showAlert('Stock usage updated successfully!', 'success');
        setTimeout(() => {
          navigate('/stock-usage');
        }, 1500);
      } else {
        await axiosInstance.post('/stockusage', payload);
        showAlert('Stock usage added successfully!', 'success');
        setTimeout(() => {
          navigate('/stock-usage');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving stock usage:', error);
      
      let errorMessage = 'Failed to save stock usage';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Handle the specific center validation error
        if (errorMessage.includes('CenterStock validation failed') && errorMessage.includes('Must be a valid Center (not Outlet)')) {
          errorMessage = 'Invalid center type. Please select a valid Center (not an Outlet) for stock usage.';
        }
      }
      
      showAlert(errorMessage, 'danger');
    }
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      usageType: '',
      remark: '',
      customer: '',
      connectionType: '',
      packageAmount: '',
      packageDuration: '',
      onuCharges: '',
      installationCharges: '',
      reason: '',
      fromBuilding: '',
      toBuilding: '',
      fromControlRoom: '',
      stolenFrom: '',
      address: '',
      shiftingAmount: '',
      wireChangeAmount: ''
    });
    setCustomerSearchTerm('');
    setBuildingSearchTerm('');
    setControlRoomSearchTerm('');
    setSelectedRows({});
    setAssignedSerials({});
    setErrors({});
    showAlert('Form has been reset', 'info');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddCustomer = () => {
    setShowCustomerModal(true);
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
    setFilteredCustomers((prev) => [...prev, newCustomer]);

    setFormData((prev) => ({
      ...prev,
      customer: newCustomer._id,
    }));
    setCustomerSearchTerm(newCustomer.name || newCustomer.username);
    showAlert('Customer added successfully!', 'success');
  };

  const handleAddBuilding = () => {
    setIsBuildingModalOpen(true);
  };

  const handleBuildingAdded = (newBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);
    setFilteredBuildings((prev) => [...prev, newBuilding]);

    if (currentBuildingType === 'from') {
      setFormData((prev) => ({
        ...prev,
        fromBuilding: newBuilding._id || newBuilding.id,
      }));
      setBuildingSearchTerm(newBuilding.name);
    } else {
      setFormData((prev) => ({
        ...prev,
        toBuilding: newBuilding._id || newBuilding.id
      }));
    }
    showAlert('Building added successfully!', 'success');
  };

  const handleAddControlRoom = () => {
    setIsControlRoomModalOpen(true);
  };

  const handleControlRoomAdded = (newControlRoom) => {
    setControlRooms((prev) => [...prev, newControlRoom]);
    setFilteredControlRooms((prev) => [...prev, newControlRoom]);

    setFormData((prev) => ({
      ...prev,
      controlRoom: newControlRoom._id || newControlRoom.id,
    }));
    setControlRoomSearchTerm(newControlRoom.buildingName);
    showAlert('Control room added successfully!', 'success');
  };

  const filteredProducts = products.filter((p) =>
    p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConditionalFields = () => {
    switch (formData.usageType) {
      case 'Customer':
        return (
          <>
            <div className="form-row">
              <div className="form-group select-dropdown-container">
                <label className={`form-label ${errors.customer ? 'error-label' : formData.customer ? 'valid-label' : ''}`}>
                  Customer <span className="required">*</span>
                </label>
                <div className="input-with-button">
                  <div className="select-input-wrapper">
                    <input
                      type="text"
                      name="customer"
                      className={`form-input ${errors.customer ? 'error-input' : formData.customer ? 'valid-input' : ''}`}
                      value={customerSearchTerm}
                      onChange={handleCustomerSearchChange}
                      onFocus={handleCustomerInputFocus}
                      onBlur={handleCustomerInputBlur}
                      placeholder="Search User"
                    />
                    <CIcon icon={cilSearch} className="search-icon" />
                  </div>
                  <button type="button" className="add-btn" onClick={handleAddCustomer}>
                    <CIcon icon={cilPlus} className='icon'/> ADD
                  </button>
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
                            key={customer._id}
                            className="select-item"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="select-name">{customer.username}-{customer.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="no-select">No customers found</div>
                      )}
                    </div>
                  </div>
                )}
                {errors.customer && <span className="error">{errors.customer}</span>}
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className={`form-label ${errors.connectionType ? 'error-label' : formData.connectionType ? 'valid-label' : ''}`}>
                  Connection Type <span className="required">*</span>
                </label>
                <select
                  name="connectionType"
                  className={`form-input ${errors.connectionType ? 'error-input' : formData.connectionType ? 'valid-input' : ''}`}
                  value={formData.connectionType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="NC">NC</option>
                  <option value="Convert">Convert</option>
                  <option value="Shifting">Shifting</option>
                  <option value="Repair">Repair</option>
                </select>
                {errors.connectionType && <span className="error">{errors.connectionType}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.packageAmount ? 'error-label' : formData.packageAmount ? 'valid-label' : ''}`}>
                  Package Amount <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="packageAmount"
                  className={`form-input ${errors.packageAmount ? 'error-input' : formData.packageAmount ? 'valid-input' : ''}`}
                  value={formData.packageAmount}
                  onChange={handleChange}
                  placeholder="Package Amount"
                />
                {errors.packageAmount && <span className="error">{errors.packageAmount}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.packageDuration ? 'error-label' : formData.packageDuration ? 'valid-label' : ''}`}>
                  Package Duration <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="packageDuration"
                  className={`form-input ${errors.packageDuration ? 'error-input' : formData.packageDuration ? 'valid-input' : ''}`}
                  value={formData.packageDuration}
                  onChange={handleChange}
                  placeholder="Package Duration"
                />
                {errors.packageDuration && <span className="error">{errors.packageDuration}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.onuCharges ? 'error-label' : formData.onuCharges ? 'valid-label' : ''}`}>
                  ONU Charges <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="onuCharges"
                  className={`form-input ${errors.onuCharges ? 'error-input' : formData.onuCharges ? 'valid-input' : ''}`}
                  value={formData.onuCharges}
                  onChange={handleChange}
                  placeholder="ONU Charges"
                />
                {errors.onuCharges && <span className="error">{errors.onuCharges}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className={`form-label ${errors.installationCharges ? 'error-label' : formData.installationCharges ? 'valid-label' : ''}`}>
                  Installation Charges <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="installationCharges"
                  className={`form-input ${errors.installationCharges ? 'error-input' : formData.installationCharges ? 'valid-input' : ''}`}
                  value={formData.installationCharges}
                  onChange={handleChange}
                  placeholder="Installation Charges"
                />
                {errors.installationCharges && <span className="error">{errors.installationCharges}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.reason ? 'error-label' : formData.reason ? 'valid-label' : ''}`}>
                  Reason <span className="required">*</span>
                </label>
                <select
                  name="reason"
                  className={`form-input ${errors.reason ? 'error-input' : formData.reason ? 'valid-input' : ''}`}
                  value={formData.reason}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="NC">NC</option>
                  <option value="Convert">Convert</option>
                  <option value="Shifting">Shifting</option>
                  <option value="Repair">Repair</option>
                </select>
                {errors.reason && <span className="error">{errors.reason}</span>}
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className={`form-label ${errors.shiftingAmount ? 'error-label' : formData.shiftingAmount ? 'valid-label' : ''}`}>
                  Shifting Amount<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="shiftingAmount"
                  className={`form-input ${errors.shiftingAmount ? 'error-input' : formData.shiftingAmount ? 'valid-input' : ''}`}
                  value={formData.shiftingAmount}
                  onChange={handleChange}
                  placeholder='Shifting Amount'
                />
                {errors.shiftingAmount && <span className="error">{errors.shiftingAmount}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.wireChangeAmount ? 'error-label' : formData.wireChangeAmount ? 'valid-label' : ''}`}>
                  Wire Change Amount <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="wireChangeAmount"
                  className={`form-input ${errors.wireChangeAmount ? 'error-input' : formData.wireChangeAmount ? 'valid-input' : ''}`}
                  value={formData.wireChangeAmount}
                  onChange={handleChange}
                  placeholder='Wire Change Amount'
                />
                {errors.wireChangeAmount && <span className="error">{errors.wireChangeAmount}</span>}
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>
          </>
        );

      case 'Building':
        return (
          <div className="form-row">
            <div className="form-group select-dropdown-container">
              <label className={`form-label ${errors.fromBuilding ? 'error-label' : formData.fromBuilding ? 'valid-label' : ''}`}>
                From Building <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    name="fromBuilding"
                    className={`form-input ${errors.fromBuilding ? 'error-input' : formData.fromBuilding ? 'valid-input' : ''}`}
                    value={buildingSearchTerm}
                    onChange={(e) => handleBuildingSearchChange(e, 'from')}
                    onFocus={() => handleBuildingInputFocus('from')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <CIcon icon={cilSearch} className="search-icon" />
                </div>
                <button type="button" className="add-btn" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                  <CIcon icon={cilPlus} className='icon'/> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'from' && (
                <div className="select-dropdown">
                  <div className="select-dropdown-header">
                    <span>Select Building</span>
                  </div>
                  <div className="select-list">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="select-item"
                          onClick={() => handleBuildingSelect(building, 'from')}
                        >
                          <div className="select-name">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-select">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.fromBuilding && <span className="error">{errors.fromBuilding}</span>}
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        );

      case 'Building to Building':
        return (
          <div className="form-row">
            <div className="form-group select-dropdown-container">
              <label className={`form-label ${errors.fromBuilding ? 'error-label' : formData.fromBuilding ? 'valid-label' : ''}`}>
                From Building <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    name="fromBuilding"
                    className={`form-input ${errors.fromBuilding ? 'error-input' : formData.fromBuilding ? 'valid-input' : ''}`}
                    value={buildingSearchTerm}
                    onChange={(e) => handleBuildingSearchChange(e, 'from')}
                    onFocus={() => handleBuildingInputFocus('from')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <CIcon icon={cilSearch} className="search-icon" />
                </div>
                <button type="button" className="add-btn" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                  <CIcon icon={cilPlus} className='icon'/> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'from' && (
                <div className="select-dropdown">
                  <div className="select-dropdown-header">
                    <span>Select Building</span>
                  </div>
                  <div className="select-list">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="select-item"
                          onClick={() => handleBuildingSelect(building, 'from')}
                        >
                          <div className="select-name">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-select">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.fromBuilding && <span className="error">{errors.fromBuilding}</span>}
            </div>

            <div className="form-group select-dropdown-container">
              <label className={`form-label ${errors.toBuilding ? 'error-label' : formData.toBuilding ? 'valid-label' : ''}`}>
                To Building <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    name="toBuilding"
                    className={`form-input ${errors.toBuilding ? 'error-input' : formData.toBuilding ? 'valid-input' : ''}`}
                    value={formData.toBuilding}
                    onChange={(e) => handleBuildingSearchChange(e, 'to')}
                    onFocus={() => handleBuildingInputFocus('to')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <CIcon icon={cilSearch} className="search-icon" />
                </div>
                <button type="button" className="add-btn" onClick={() => { setCurrentBuildingType('to'); handleAddBuilding(); }}>
                  <CIcon icon={cilPlus} className='icon'/> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'to' && (
                <div className="select-dropdown">
                  <div className="select-dropdown-header">
                    <span>Select Building</span>
                  </div>
                  <div className="select-list">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="select-item"
                          onClick={() => handleBuildingSelect(building, 'to')}
                        >
                          <div className="select-name">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-select">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.toBuilding && <span className="error">{errors.toBuilding}</span>}
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        );

      case 'Control Room':
        return (
          <div className="form-row">
            <div className="form-group select-dropdown-container">
              <label className={`form-label ${errors.controlRoom ? 'error-label' : formData.controlRoom ? 'valid-label' : ''}`}>
                Control Room <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    name="controlRoom"
                    className={`form-input ${errors.controlRoom ? 'error-input' : formData.controlRoom ? 'valid-input' : ''}`}
                    value={controlRoomSearchTerm}
                    onChange={handleControlRoomSearchChange}
                    onFocus={handleControlRoomInputFocus}
                    onBlur={handleControlRoomInputBlur}
                    placeholder="Search Control Room"
                  />
                  <CIcon icon={cilSearch} className="search-icon" />
                </div>
                <button type="button" className="add-btn" onClick={handleAddControlRoom}>
                  <CIcon icon={cilPlus} className='icon'/> ADD
                </button>
              </div>
              {showControlRoomDropdown && (
                <div className="select-dropdown">
                  <div className="select-dropdown-header">
                    <span>Select Control Room</span>
                  </div>
                  <div className="select-list">
                    {filteredControlRooms.length > 0 ? (
                      filteredControlRooms.map((controlRoom) => (
                        <div
                          key={controlRoom.id}
                          className="select-item"
                          onClick={() => handleControlRoomSelect(controlRoom)}
                        >
                          <div className="select-name">{controlRoom.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-select">No control rooms found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.controlRoom && <span className="error">{errors.controlRoom}</span>}
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        );

      case 'Stolen from Field':
        return (
          <div className="form-row">
            <div className="form-group">
              <label className={`form-label ${errors.stolenFrom ? 'error-label' : formData.stolenFrom ? 'valid-label' : ''}`}>
                Stolen From <span className="required">*</span>
              </label>
              <select
                type="text"
                name="stolenFrom"
                className={`form-input ${errors.stolenFrom ? 'error-input' : formData.stolenFrom ? 'valid-input' : ''}`}
                value={formData.stolenFrom}
                onChange={handleChange}
                placeholder="Stolen From"
              >
                <option value="">SELECT</option>
                <option value="Building">Building</option>
                <option value="Customer">Customer</option>
                <option value="Control Room">Control Room</option>
              </select>
              {errors.stolenFrom && <span className="error">{errors.stolenFrom}</span>}
            </div>
            {formData.stolenFrom === 'Building' && (
                  <div className="form-group select-dropdown-container">
                  <label className={`form-label ${errors.fromBuilding ? 'error-label' : formData.fromBuilding ? 'valid-label' : ''}`}>
                    From Building <span className="required">*</span>
                  </label>
                  <div className="input-with-button">
                    <div className="select-input-wrapper">
                      <input
                        type="text"
                        name="fromBuilding"
                        className={`form-input ${errors.fromBuilding ? 'error-input' : formData.fromBuilding ? 'valid-input' : ''}`}
                        value={buildingSearchTerm}
                        onChange={(e) => handleBuildingSearchChange(e, 'from')}
                        onFocus={() => handleBuildingInputFocus('from')}
                        onBlur={handleBuildingInputBlur}
                        placeholder="Search Building"
                      />
                      <CIcon icon={cilSearch} className="search-icon" />
                    </div>
                    <button type="button" className="add-btn" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                      <CIcon icon={cilPlus} className='icon'/> ADD
                    </button>
                  </div>
                  {showBuildingDropdown && currentBuildingType === 'from' && (
                    <div className="select-dropdown">
                      <div className="select-dropdown-header">
                        <span>Select Building</span>
                      </div>
                      <div className="select-list">
                        {filteredBuildings.length > 0 ? (
                          filteredBuildings.map((building) => (
                            <div
                              key={building.id}
                              className="select-item"
                              onClick={() => handleBuildingSelect(building, 'from')}
                            >
                              <div className="select-name">{building.buildingName}</div>
                            </div>
                          ))
                        ) : (
                          <div className="no-select">No buildings found</div>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.fromBuilding && <span className="error">{errors.fromBuilding}</span>}
                </div>
            )}
            { formData.stolenFrom === 'Customer' && (
                <>
                  <div className="form-group select-dropdown-container">
                <label className={`form-label ${errors.customer ? 'error-label' : formData.customer ? 'valid-label' : ''}`}>
                  Customer <span className="required">*</span>
                </label>
                <div className="input-with-button">
                  <div className="select-input-wrapper">
                    <input
                      type="text"
                      name="customer"
                      className={`form-input ${errors.customer ? 'error-input' : formData.customer ? 'valid-input' : ''}`}
                      value={customerSearchTerm}
                      onChange={handleCustomerSearchChange}
                      onFocus={handleCustomerInputFocus}
                      onBlur={handleCustomerInputBlur}
                      placeholder="Search User"
                    />
                    <CIcon icon={cilSearch} className="search-icon" />
                  </div>
                  <button type="button" className="add-btn" onClick={handleAddCustomer}>
                    <CIcon icon={cilPlus} className='icon'/> ADD
                  </button>
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
                            key={customer._id}
                            className="select-item"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="select-name">{customer.username}-{customer.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="no-select">No customers found</div>
                      )}
                    </div>
                  </div>
                )}
                {errors.customer && <span className="error">{errors.customer}</span>}
              </div>
                </>
            )}

            {formData.stolenFrom === 'Control Room' && (
              <>
                   <div className="form-group select-dropdown-container">
              <label className={`form-label ${errors.controlRoom ? 'error-label' : formData.controlRoom ? 'valid-label' : ''}`}>
                Control Room <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <div className="select-input-wrapper">
                  <input
                    type="text"
                    name="controlRoom"
                    className={`form-input ${errors.controlRoom ? 'error-input' : formData.controlRoom ? 'valid-input' : ''}`}
                    value={controlRoomSearchTerm}
                    onChange={handleControlRoomSearchChange}
                    onFocus={handleControlRoomInputFocus}
                    onBlur={handleControlRoomInputBlur}
                    placeholder="Search Control Room"
                  />
                  <CIcon icon={cilSearch} className="search-icon" />
                </div>
                <button type="button" className="add-btn" onClick={handleAddControlRoom}>
                  <CIcon icon={cilPlus} className='icon'/> ADD
                </button>
              </div>
              {showControlRoomDropdown && (
                <div className="select-dropdown">
                  <div className="select-dropdown-header">
                    <span>Select Control Room</span>
                  </div>
                  <div className="select-list">
                    {filteredControlRooms.length > 0 ? (
                      filteredControlRooms.map((controlRoom) => (
                        <div
                          key={controlRoom.id}
                          className="select-item"
                          onClick={() => handleControlRoomSelect(controlRoom)}
                        >
                          <div className="select-name">{controlRoom.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-select">No control rooms found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.controlRoom && <span className="error">{errors.controlRoom}</span>}
            </div>
              </>
            )}
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        );

      case 'Other':
        return (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Address
              </label>
              <textarea
                type="text"
                name="address"
                className="form-textarea"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        );

      default:
        return null;
    }
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
        {id ? 'Edit' : 'Add'} Stock Usage 
      </div>
      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div className="form-body">
          {alert.show && (
            <CAlert
              color={alert.type}
              className="mb-3 mx-3"
              dismissible
              onClose={() => setAlert({ show: false, message: '', type: '' })}
            >
              {alert.message}
            </CAlert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}>
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.usageType ? 'error-label' : formData.usageType ? 'valid-label' : ''}`}>
                  Usage Type <span className="required">*</span>
                </label>
                <select
                  name="usageType"
                  className={`form-input ${errors.usageType ? 'error-input' : formData.usageType ? 'valid-input' : ''}`}
                  value={formData.usageType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Customer">Customer</option>
                  <option value="Building">Building</option>
                  <option value="Building to Building">Building to Building</option>
                  <option value="Control Room">Control Room</option>
                  <option value="Damage">Damage</option>
                  <option value="Stolen from Center">Stolen from Center</option>
                  <option value="Stolen from Field">Stolen from Field</option>
                  <option value="Other">Other</option>
                </select>
                {errors.usageType && <span className="error">{errors.usageType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="form-textarea"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group"></div>
            </div>

            {renderConditionalFields()}
            
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Select Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center my-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <div className="responsive-table-wrapper">
                <CTable bordered striped className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Select</CTableHeaderCell>
                      <CTableHeaderCell>Product Name</CTableHeaderCell>
                      <CTableHeaderCell>Available Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Damage Qty</CTableHeaderCell>
                      <CTableHeaderCell>Old Replace</CTableHeaderCell>
                      <CTableHeaderCell>Usage Qty</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  
                  <CTableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                  const isSelected = !!selectedRows[p._id];

      return (
        <CTableRow key={p._id} className={isSelected ? 'selected-row' : ''}>
          <CTableDataCell>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleRowSelect(p._id, p.stock)}
              style={{ height: "20px", width: "20px" }}
            />
          </CTableDataCell>

          <CTableDataCell>{p.productTitle}</CTableDataCell>
          <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>

          <CTableDataCell></CTableDataCell>
          <CTableDataCell></CTableDataCell>
          <CTableDataCell></CTableDataCell>

          <CTableDataCell>
  {isSelected && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <CFormInput
        type="number"
        value={selectedRows[p._id]?.quantity || ''}
        onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
        placeholder="Usage Qty"
        style={{width:'100px'}}
        min="1"
        max={p.stock?.currentStock || 0}
      />

      {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
        <span
          style={{
            fontSize: '18px',
            cursor: 'pointer',
            color: '#337ab7',
          }}
          onClick={() => handleOpenSerialModal(p)}
          title="Add Serial Numbers"
        >
          ☰
        </span>
      )}
    </div>
  )}
</CTableDataCell>

        </CTableRow>
      );
    })
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={7} className="text-center">
        No products found
      </CTableDataCell>
    </CTableRow>
  )}
</CTableBody>

                </CTable>
                </div>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <CustomerModel
        visible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerAdded={handleCustomerAdded} 
      />

      <BuildingFormModal
        visible={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onBuildingAdded={handleBuildingAdded}
      />
      <ControlRoomModel
        visible={isControlRoomModalOpen}
        onClose={() => setIsControlRoomModalOpen(false)}
        onControlRoomAdded={handleControlRoomAdded}
      />
      <UsageSerialNumbers
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default AddStockUsage;