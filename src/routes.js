import React from 'react'
import { Translation } from 'react-i18next'

// Masters ..
const StockRequest = React.lazy(() => import('./views/stockRequest/StockRequest'))
const AddStockRequest = React.lazy(() => import('./views/stockRequest/AddStockRequest'))
const StockRequestProfile = React.lazy(() => import('./views/stockRequest/StockProfile'))


const StockPurchase = React.lazy(() => import('./views/stockPurchase/StockPurchase'))
const AddStockPurchase = React.lazy(() => import('./views/stockPurchase/AddStockPurchase'))

const StockTransfer = React.lazy(() => import('./views/stockTransfer/StockTransfer'))
const AddStockTransfer = React.lazy(() => import('./views/stockTransfer/AddStockTransfer'))
const StockTransferDetails = React.lazy(() => import('./views/stockTransfer/StockTransferDetails'))

const ShiftingRequest = React.lazy(() => import('./views/shiftingRequest/ShiftingRequestList'))
const AddShiftingRequest = React.lazy(() => import('./views/shiftingRequest/AddShiftingRequest'))

const ReportSubmissionList = React.lazy(() => import('./views/reportSubmission/ReportSubmissionList'))
const AddReportSubmission = React.lazy(() => import('./views/reportSubmission/AddReportSubmission'))

const CustomersList = React.lazy(() => import('./views/Master/customer/CustomersList'))
const AddCustomer = React.lazy(() => import('./views/Master/customer/AddCustomer'))
const CustomerProfile = React.lazy(() => import('./views/Master/customer/CustomerProfile'))

const BuildingList = React.lazy(() => import('./views/Master/building/BuildingList'))
const AddBuilding = React.lazy(() => import('./views/Master/building/AddBuilding'))
const BuildingProfile = React.lazy(() => import('./views/Master/building/BuildingProfile'))

const AddControlRoom = React.lazy(() => import('./views/Master/control-room/AddControlRoom'))
const ControlRoomList = React.lazy(() => import('./views/Master/control-room/ControlRoomList'))
const ControlRoomProfile = React.lazy(() => import('./views/Master/control-room/ControlRoomProfile'));

const CenterList = React.lazy(() => import('./views/Master/center/CenterList'));
const AddCenter = React.lazy(() => import('./views/Master/center/AddCenter'));

const AddWarehouse = React.lazy(() => import('./views/Master/warehouse/AddWarehouse'));
const WarehouseList = React.lazy(() => import('./views/Master/warehouse/WarehouseList'));

const ProductCategoryList = React.lazy(() => import('./views/Settings/product-category/ProductCategoryList'))

const AddProduct = React.lazy(() => import('./views/Settings/products/AddProducts'));
const ProductList = React.lazy(() => import('./views/Settings/products/ProductsList'));

const AddVendor = React.lazy(() => import('./views/Settings/vendor/AddVendor'));
const VendorList = React.lazy(() => import('./views/Settings/vendor/VendorList'));

const AddPartner = React.lazy(() => import('./views/Settings/partner/AddPartner'));
const PartnerList = React.lazy(() => import('./views/Settings/partner/PartnerList'));

const AddArea = React.lazy(() => import('./views/Settings/area/AddArea'));
const AreaList = React.lazy(() => import('./views/Settings/area/AreaList'));

const UserList = React.lazy(() => import('./views/Settings/user/UserList'));
const AddUser = React.lazy(() => import('./views/Settings/user/AddUser'));

const PackageDurationList = React.lazy(() => import('./views/Settings/package-duration/PackageDurationList'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const StockUsage = React.lazy(() => import('./views/stockUsage/StockUsage'))
const AddStockUsage = React.lazy(() => import('./views/stockUsage/AddStockUsage'))

const Cards = React.lazy(() => import('./views/base/cards/Cards'))


const routes = [

  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    element: Dashboard,
  },

  //MASTERS
{ 
    path:'/add-customer', 
    exact:true, 
    name:<Translation>{(t) => t('Add customer')}</Translation>,
    element: AddCustomer,
  },
  { 
    path:'/customers-list', 
    exact:true, 
    name:<Translation>{(t) => t('Customers List')}</Translation>,
    element: CustomersList,
  },

  { 
    path:'/edit-customer/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit customer')}</Translation>,
    element: AddCustomer,
  },
  { 
    path:'/customer-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('customer profile')}</Translation>,
    element: CustomerProfile,
  },
  { 
    path:'/add-building', 
    exact:true, 
    name:<Translation>{(t) => t('Add Building')}</Translation>,
    element: AddBuilding,
  },
  { 
    path:'/building-list', 
    exact:true, 
    name:<Translation>{(t) => t('Building List')}</Translation>,
    element: BuildingList,
  },

  { 
    path:'/edit-building/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Building')}</Translation>,
    element: AddBuilding,
  },
  { 
    path:'/building-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Building Profile')}</Translation>,
    element: BuildingProfile,
  },
  { 
    path:'/add-controlRoom', 
    exact:true, 
    name:<Translation>{(t) => t('Add Control Room')}</Translation>,
    element: AddControlRoom,
  },
  { 
    path:'/controlRoom-list', 
    exact:true, 
    name:<Translation>{(t) => t('Control Room List')}</Translation>,
    element: ControlRoomList,
  },
  { 
    path:'/edit-controlRoom/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Control Room')}</Translation>,
    element: AddControlRoom,
  },
  { 
    path:'/controlRoom-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Control Room Profile')}</Translation>,
    element: ControlRoomProfile,
  },
  { 
    path:'/add-center', 
    exact:true, 
    name:<Translation>{(t) => t('Add Center')}</Translation>,
    element: AddCenter,
  },
  { 
    path:'/center-list', 
    exact:true, 
    name:<Translation>{(t) => t('Center List')}</Translation>,
    element: CenterList,
  },
  { 
    path:'/edit-center/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Center')}</Translation>,
    element: AddCenter,
  },

  { 
    path:'/add-warehouse', 
    exact:true, 
    name:<Translation>{(t) => t('Add Warehouse')}</Translation>,
    element: AddWarehouse,
  },
  { 
    path:'/warehouse-list', 
    exact:true, 
    name:<Translation>{(t) => t('Warehouse List')}</Translation>,
    element: WarehouseList,
  },
  //***********************   SETTINGS    **********************************//
  { 
    path:'/product-category', 
    exact:true, 
    name:<Translation>{(t) => t('Product Category')}</Translation>,
    element: ProductCategoryList,
  },
  { 
    path:'/add-product', 
    exact:true, 
    name:<Translation>{(t) => t('Add Product')}</Translation>,
    element: AddProduct,
  },
  { 
    path:'/product-list', 
    exact:true, 
    name:<Translation>{(t) => t('Product List')}</Translation>,
    element: ProductList,
  },
  { 
    path:'/edit-product/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Product')}</Translation>,
    element: AddProduct,
  },
  { 
    path:'/add-vendor', 
    exact:true, 
    name:<Translation>{(t) => t('Add Vendor')}</Translation>,
    element: AddVendor,
  },
  { 
    path:'/vendor-list', 
    exact:true, 
    name:<Translation>{(t) => t('Vendor List')}</Translation>,
    element: VendorList,
  },
  { 
    path:'/edit-vendor/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Update Vendor')}</Translation>,
    element: AddVendor,
  },
  { 
    path:'/add-partner', 
    exact:true, 
    name:<Translation>{(t) => t('Add Partner')}</Translation>,
    element: AddPartner,
  },
  { 
    path:'/partner-list', 
    exact:true, 
    name:<Translation>{(t) => t('Partner List')}</Translation>,
    element: PartnerList,
  },
  { 
    path:'/update-partner/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Update Partner')}</Translation>,
    element: AddPartner,
  },
  { 
    path:'/add-area', 
    exact:true, 
    name:<Translation>{(t) => t('Add Area')}</Translation>,
    element: AddArea,
  },
  { 
    path:'/area-list', 
    exact:true, 
    name:<Translation>{(t) => t('Area List')}</Translation>,
    element: AreaList,
  },
  { 
    path:'/add-user', 
    exact:true, 
    name:<Translation>{(t) => t('Add Area')}</Translation>,
    element: AddUser,
  },
  { 
    path:'/user-list', 
    exact:true, 
    name:<Translation>{(t) => t('Area List')}</Translation>,
    element: UserList,
  },
  { 
    path:'/package-duration-list', 
    exact:true, 
    name:<Translation>{(t) => t('Package Duration List')}</Translation>,
    element: PackageDurationList,
  },

  {
    path: '/add-stockRequest',
    name: <Translation>{(t) => t('Add Stock Request')}</Translation>,
    element: AddStockRequest,
    exact: true,
  },
  {
    path: '/stock-request',
     name: <Translation>{(t) => t('Stock Request List')}</Translation>,
    element: StockRequest,
    exact: true,
  },
  {
    path: '/edit-stockRequest/:id',
    name: <Translation>{(t) => t('Edit Stock Request')}</Translation>,
    element: AddStockRequest,
    exact: true,
  },
  {
    path: '/stockRequest-profile/:id',
     name: <Translation>{(t) => t('Stock Request Profile')}</Translation>,
    element: StockRequestProfile,
    exact: true,
  },

  {
    path:'/theme/stockUsg',
    name: <Translation>{(t) => t('Stock Usage')}</Translation>,
    element:StockUsage,
    exact: true,
  },
  {
    path:'/add-stockUsage',
    name: <Translation>{(t) => t('Add Stock Usage')}</Translation>,
    element:AddStockUsage,
    exact: true,
  },


  {
    path: '/stock-purchase',
    name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
    element: StockPurchase,
    exact: true,
  },
  {
    path: '/add-stockPurchase',
    name: <Translation>{(t) => t('Add Stock Purchase')}</Translation>,
    element: AddStockPurchase,
    exact: true,
  },
  {
    path: '/edit-stockPurchase/:id',
    name: <Translation>{(t) => t('Edit Stock Purchase')}</Translation>,
    element: AddStockPurchase,
    exact: true,
  },

 {
    path: '/stock-transfer',
    name: <Translation>{(t) => t('Stock Transfer Request List')}</Translation>,
    element: StockTransfer,
    exact: true,
  },
  {
    path: '/add-stockTransfer',
    name: <Translation>{(t) => t('Stock Transfer Request')}</Translation>,
    element: AddStockTransfer,
    exact: true,
  },
  {
    path: '/stockTransfer-details/:id',
    name: <Translation>{(t) => t('Stock Transfer Request Details')}</Translation>,
    element: StockTransferDetails,
    exact: true,
  },
  {
    path: '/edit-stockTransfer/:id',
    name: <Translation>{(t) => t('Stock Transfer Request')}</Translation>,
    element: AddStockTransfer,
    exact: true,
  },

   {
    path: '/shifting-request',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: ShiftingRequest,
    exact: true,
  },
  {
    path: '/add-shiftingRequest',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: AddShiftingRequest,
    exact: true,
  },
  {
    path: '/edit-shiftingRequest/:id',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: AddShiftingRequest,
    exact: true,
  },

 {
    path: '/report-submission',
    name: <Translation>{(t) => t('Closing Stock Logs')}</Translation>,
    element: ReportSubmissionList,
    exact: true,
  },
  {
    path: '/add-reportSubmission',
    name: <Translation>{(t) => t('Closing Stock Logs')}</Translation>,
    element: AddReportSubmission,
    exact: true,
  },
  {
    path:'/master',
    name: <Translation>{(t) => t('master')}</Translation>,
    element: Cards,
    exact: true,
  }
]

export default routes
