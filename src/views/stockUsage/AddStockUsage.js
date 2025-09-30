import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import { CButton } from '@coreui/react';
import { cilPlus, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import BuildingFormModal from './BuildingModel';
import CustomerModel from './CustomerModel';
import ControlRoomModel from './ControlRoomModel';

const AddStockUsage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: '',
    usageType: '',
    remark: '',
    customer: '',
    customer_id: '',
    previousConnectionType: '',
    packageAmount: '',
    packageDuration: '',
    onuCharges: '',
    installationCharges: '',
    reason: '',
    fromBuilding: '',
    fromBuilding_id: '',
    toBuilding: '',
    toBuilding_id: '',
    controlRoom: '',
    controlRoom_id: '',
    stolenFrom: '',
    address: '',
    shiftingAmount: '',
    wireChangeAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
  const [currentBuildingField, setCurrentBuildingField] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [buildingSearchTerm, setBuildingSearchTerm] = useState('');
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [currentBuildingType, setCurrentBuildingType] = useState(''); 
  const [controlRooms, setControlRooms] = useState([]);
  const [filteredControlRooms, setFilteredControlRooms] = useState([]);
  const [controlRoomSearchTerm, setControlRoomSearchTerm] = useState('');
  const [showControlRoomDropdown, setShowControlRoomDropdown] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStockUsage(id);
    }
    fetchCustomers();
    fetchBuildings();
    fetchControlRooms();
  }, [id]);

  const fetchStockUsage = async (usageId) => {
    try {
      const res = await axiosInstance.get(`/stock-usage/${usageId}`);
      setFormData(res.data.data);
      if (res.data.data.customer) setCustomerSearchTerm(res.data.data.customer);
      if (res.data.data.fromBuilding) setBuildingSearchTerm(res.data.data.fromBuilding);
      if (res.data.data.controlRoom) setControlRoomSearchTerm(res.data.data.controlRoom);
    } catch (error) {
      console.error('Error fetching stock usage:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/customers');
      setCustomers(res.data.data || []);
      setFilteredCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get('/buildings');
      setBuildings(res.data.data || []);
      setFilteredBuildings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const fetchControlRooms = async () => {
    try {
      const res = await axiosInstance.get('/controlRooms');
      setControlRooms(res.data.data || []);
      setFilteredControlRooms(res.data.data || []);
    } catch (error) {
      console.error('Error fetching control rooms:', error);
    }
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
        controlRoom.name?.toLowerCase().includes(controlRoomSearchTerm.toLowerCase()) ||
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
      customer_id: ''
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer.name || customer.username,
      customer_id: customer.id
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
        fromBuilding: value,
        fromBuilding_id: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: value,
        toBuilding_id: ''
      }));
    }
  };

  const handleBuildingSelect = (building, type = 'from') => {
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromBuilding: building.buildingName,
        fromBuilding_id: building.id
      }));
      setBuildingSearchTerm(building.buildingName);
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: building.buildingName,
        toBuilding_id: building.id
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
      controlRoom_id: ''
    }));
  };

  const handleControlRoomSelect = (controlRoom) => {
    setFormData(prev => ({
      ...prev,
      controlRoom: controlRoom.name,
      controlRoom_id: controlRoom.id
    }));
    setControlRoomSearchTerm(controlRoom.name);
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
    
    if (formData.usageType === 'Customer') {
      if (!formData.customer) newErrors.customer = 'Customer is required';
      if (!formData.previousConnectionType) newErrors.previousConnectionType = 'Previous Connection Type is required';
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
      if (id) {
        await axiosInstance.put(`/stock-usage/${id}`, formData);
      } else {
        await axiosInstance.post('/stock-usage', formData);
      }
      navigate('/stock-usage-list');
    } catch (error) {
      console.error('Error saving stock usage:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      date: '',
      usageType: '',
      remark: '',
      customer: '',
      customer_id: '',
      previousConnectionType: '',
      packageAmount: '',
      packageDuration: '',
      onuCharges: '',
      installationCharges: '',
      reason: '',
      fromBuilding: '',
      fromBuilding_id: '',
      toBuilding: '',
      toBuilding_id: '',
      controlRoom: '',
      controlRoom_id: '',
      stolenFrom: '',
      address: '',
      shiftingAmount: '',
      wireChangeAmount: ''
    });
    setCustomerSearchTerm('');
    setBuildingSearchTerm('');
    setControlRoomSearchTerm('');
    setErrors({});
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
      customer: newCustomer.name || newCustomer.username,
      customer_id: newCustomer.id
    }));
    setCustomerSearchTerm(newCustomer.name || newCustomer.username);
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
        fromBuilding: newBuilding.name,
        fromBuilding_id: newBuilding.id
      }));
      setBuildingSearchTerm(newBuilding.name);
    } else {
      setFormData((prev) => ({
        ...prev,
        toBuilding: newBuilding.name,
        toBuilding_id: newBuilding.id
      }));
    }
  };

  const handleAddControlRoom = () => {
    setIsControlRoomModalOpen(true);
  };

  const handleControlRoomAdded = (newControlRoom) => {
    setBuildings((prev) => [...prev, newControlRoom]);
    setFilteredBuildings((prev) => [...prev, newControlRoom]);

    if (currentBuildingType === 'from') {
      setFormData((prev) => ({
        ...prev,
        fromBuilding: newControlRoom.buildingName,
        fromBuilding_id: newControlRoom.id
      }));
      setBuildingSearchTerm(newControlRoom.buildingName);
    } else {
      setFormData((prev) => ({
        ...prev,
        toBuilding: newControlRoom.buildingName,
        toBuilding_id: newControlRoom.id
      }));
    }
  };

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
                            key={customer.id}
                            className="select-item"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="select-name">{customer.name || customer.username}</div>
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
                <label className={`form-label ${errors.previousConnectionType ? 'error-label' : formData.previousConnectionType ? 'valid-label' : ''}`}>
                  Connection Type <span className="required">*</span>
                </label>
                <select
                  name="previousConnectionType"
                  className={`form-input ${errors.previousConnectionType ? 'error-input' : formData.previousConnectionType ? 'valid-input' : ''}`}
                  value={formData.previousConnectionType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="NC">NC</option>
                  <option value="Convert">Convert</option>
                  <option value="Shifting">Shifting</option>
                  <option value="Repair">Repair</option>
                </select>
                {errors.previousConnectionType && <span className="error">{errors.previousConnectionType}</span>}
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
              <input
                type="text"
                name="stolenFrom"
                className={`form-input ${errors.stolenFrom ? 'error-input' : formData.stolenFrom ? 'valid-input' : ''}`}
                value={formData.stolenFrom}
                onChange={handleChange}
                placeholder="Stolen From"
              />
              {errors.stolenFrom && <span className="error">{errors.stolenFrom}</span>}
            </div>
            <div className="form-group"></div>
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
    </div>
  );
};

export default AddStockUsage;