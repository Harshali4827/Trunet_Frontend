// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilDescription,
//   cilMoney,
// } from '@coreui/icons'
// import { CNavGroup, CNavItem, } from '@coreui/react-pro'
// import { Translation } from 'react-i18next'

// const _nav = [
//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('dashboard')}</Translation>,
//     to: '/dashboard',
//     icon: <i className="fa fa-dashboard nav-icon"   style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
//   },

//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Stock Request')}</Translation>,
//     to: '/stock-request',
//     icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },

//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Stock Usage')}</Translation>,
//     to:'/stock-usage',
//     icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },
//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
//     to: '/stock-purchase',
//     icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },
//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
//     to: '/stock-transfer',
//     icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },
//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Shifting Request')}</Translation>,
//     to: '/shifting-request',
//     icon: <i className="fa fa-truck nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },
//   {
//     component: CNavItem,
//     name: <Translation>{(t) => t('Report Submission')}</Translation>,
//     to: '/report-submission',
//     icon: <i className="fa fa-check nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//   },
//   // MASTERS 
//   {
//     component: CNavGroup,
//     name: <Translation>{(t) => t('Master')}</Translation>,
//     to: '/base',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,

//     items: [
//       {
//         component: CNavItem,
//         name: 'Customer',
//         to:'/customers-list'
//       },
//       {
//         component: CNavItem,
//         name: 'Building',
//          to:'/building-list'
//       },
//       {
//         component: CNavItem,
//         name: 'Control Room',
//          to:'/controlRoom-list'
//       },
//       {
//         component: CNavItem,
//         name: 'Center',
//          to:'/center-list'
//       },
//        {
//         component: CNavItem,
//         name: 'Challan',
//          to:'/base/challan'
//       },
//   ]},
  

//   {
//     component: CNavGroup,
//     name: <Translation>{(t) => t('Report')}</Translation>,
//     to: '/base',
//      icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Centers Stock',
//         to: '/base/centerStk',
//       },
//       {
//         component: CNavItem,
//         name: 'Available Stock',
//         to:'/base/availableStk',
//       },
//       {
//         component: CNavItem,
//         name: 'Transaction Report',
//         to: '/base/trasaction',
//       },
//       {
//         component: CNavItem,
//         name: 'Purchase Detail',
//         to:'/base/purchaseDtl'
//       },
//       {
//         component: CNavItem,
//         name: 'Indent Summary',
//         to: '/base/indentSummary',
//       },
//       {
//         component: CNavItem,
//         name: 'Indent Detail',
//         to: '/base/indentDetail',
//       },
//       {
//         component: CNavItem,
//         name: 'Transfer Summary',
//         to: '/base/transferSummary',
//       },
//       {
//         component: CNavItem,
//         name: 'Transfer Detail',
//         to: '/base/transferDetail',
//       },
//       {
//         component: CNavItem,
//         name: 'Usage Summary',
//         to: '/base/usageSummary',
//       },
//       {
//         component: CNavItem,
//         name: 'Usage Detail',
//         to: '/base/usageDetail',
//       },
//       {
//         component: CNavItem,
//         name: 'Usage Replace',
//         to: '/base/usageReplace',
//       },
//       {
//         component: CNavItem,
//         name: 'Stolen Report',
//         to: '/base/stolenReport',
//       },
//       {
//         component: CNavItem,
//         name: 'Indent/Usage Summary',
//         to: '/base/indentUsageSummary',
//       },
//       {
//         component: CNavItem,
//         name: 'Purchase Analysis',
//         to:'/base/purchaseAnalysis'
//       },
//       {
//         component: CNavItem,
//         name: 'Product Serial Track',
//         to: '/base/productSerial',
//       },
//       {
//         component: CNavItem,
//         name: 'ONU Track Report',
//         to:'/base/onuTrack',
//       },
//   ]},

//   {
//     component: CNavGroup,
//     name: <Translation>{(t) => t('Settings')}</Translation>,
//     to: '/base',
//     icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Center',
//         to: '/center-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Products',
//         to: '/product-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Product Categories',
//         to:'/product-category'
//       },
//       {
//         component: CNavItem,
//         name: 'Tax',
//         to: '/base/tax',
//       },
//       {
//         component: CNavItem,
//         name: 'Vendor',
//         to: '/vendor-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Package Duration',
//         to: '/package-duration-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Partner',
//         to:'/partner-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Area',
//         to: '/area-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Users',
//         to: '/user-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Role',
//         to: '/role-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Login',
//         to: '/login',
//       },
//   ]},


//   // IMPORT 
//   {
//     component: CNavGroup,
//     name: <Translation>{(t) => t('Import')}</Translation>,
//     to: '/base',
//     icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Import Usage',
//         to:'/base/imageUsage'
//       },
//   ]},
// ]

// export default _nav




import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilMoney } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { Translation } from 'react-i18next'


export const hasPermission = (permissions, module, requiredPermissions = []) => {
  const modulePermissions = permissions.find(p => p.module === module)
  if (!modulePermissions) return false
  return requiredPermissions.some(p => modulePermissions.permissions.includes(p))
}

const getNav = (permissions = []) => {
  const _nav = []

  _nav.push({
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <i className="fa fa-dashboard nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
  })


  if (hasPermission(permissions, 'Indent', ['indent_own_center', 'indent_all_center'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Request')}</Translation>,
      to: '/stock-request',
      icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })
  }


  if (hasPermission(permissions, 'Usage', ['view_usage_own_center', 'manage_usage_own_center'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Usage')}</Translation>,
      to: '/stock-usage',
      icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })
  }

  if (hasPermission(permissions, 'Purchase', ['add_purchase_stock', 'view_all_purchase_stock','view_own_purchase_stock'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
      to: '/stock-purchase',
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })
  }

  if (hasPermission(permissions, 'Transfer', ['view_stock_transfer_own_center', 'manage_stock_transfer_own_center'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
      to: '/stock-transfer',
      icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })
  }

  if (hasPermission(permissions, 'Shifting', ['view_shifting_own_center', 'view_shifting_all_center'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Shifting Request')}</Translation>,
      to: '/shifting-request',
      icon: <i className="fa fa-truck nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })
  }


  if (hasPermission(permissions, 'Closing', ['view_closing_stock_own_center', 'view_closing_stock_all_center'])) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Report Submission')}</Translation>,
      to: '/report-submission',
      icon: <i className="fa fa-check nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })
  }

  // ===== MASTERS =====
  const masterItems = []

  if (hasPermission(permissions, 'Customer', ['view_customer_all_center','view_customer_own_center','manage_customer_all_center'])) {
    masterItems.push({ component: CNavItem, name: 'Customer', to: '/customers-list' })
  }

  if (hasPermission(permissions, 'Settings', ['view_building_all_center','view_building_own_center', 'manage_building_all_center'])) {
    masterItems.push({ component: CNavItem, name: 'Building', to: '/building-list' })
  }

  if (hasPermission(permissions, 'Settings', ['view_control_room_all_center','view_control_room_own_center','manage_control_room_all_center'])) {
    masterItems.push({ component: CNavItem, name: 'Control Room', to: '/controlRoom-list' })
  }

  if (hasPermission(permissions, 'Center', ['view_all_center','view_own_center', 'manage_all_center'])) {
    masterItems.push({ component: CNavItem, name: 'Center', to: '/center-list' })
  }

  // if (hasPermission(permissions, 'Indent', ['view_own_center', 'manage_indent'])) {
  //   masterItems.push({ component: CNavItem, name: 'Challan', to: '/base/challan' })
  // }


  if (masterItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: <Translation>{(t) => t('Master')}</Translation>,
      to: '/base',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
      items: masterItems,
    })
  }

  // ===== REPORT =====
  const reportItems = []

  if (hasPermission(permissions, 'Report', ['view_outlet_stock','view_all_report','view_own_report'])) {
    reportItems.push({ component: CNavItem, name: 'Centers Stock', to: '/center-stock' })
    reportItems.push({ component: CNavItem, name: 'Available Stock', to: '/available-stock' })
    reportItems.push({ component: CNavItem, name: 'Transaction Report', to: '/transaction-report' })
    reportItems.push({ component: CNavItem, name: 'Purchase Detail', to: '/purchase-detail' })
    reportItems.push({ component: CNavItem, name: 'Indent Summary', to: '/indent-summary' })
    reportItems.push({ component: CNavItem, name: 'Indent Detail', to: '/indent-detail' })
    reportItems.push({ component: CNavItem, name: 'Transfer Summary', to: '/transfer-summary' })
    reportItems.push({ component: CNavItem, name: 'Transfer Detail', to: '/transfer-detail' })
    reportItems.push({ component: CNavItem, name: 'Usage Summary', to: '/usage-summary' })
    reportItems.push({ component: CNavItem, name: 'Usage Detail', to: '/usage-detail' })
    reportItems.push({ component: CNavItem, name: 'Usage Replace', to: '/usage-replace' })
    reportItems.push({ component: CNavItem, name: 'Stolen Report', to: '/stolen-report' })
    reportItems.push({ component: CNavItem, name: 'Indent/Usage Summary', to: '/base/indentUsageSummary' })
    reportItems.push({ component: CNavItem, name: 'Purchase Analysis', to: '/base/purchaseAnalysis' })
    reportItems.push({ component: CNavItem, name: 'Product Serial Track', to: '/product-serial-track' })
    reportItems.push({ component: CNavItem, name: 'ONU Track Report', to: '/base/onuTrack' })
  }

  if (reportItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: <Translation>{(t) => t('Report')}</Translation>,
      to: '/',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
      items: reportItems,
    })
  }

  // ===== SETTINGS =====
  const settingsItems = []

  if (hasPermission(permissions, 'Settings', ['manage_user', 'manage_masters_data', 'manage_vendors'])) {
    settingsItems.push({ component: CNavItem, name: 'Center', to: '/center-list' })
    settingsItems.push({ component: CNavItem, name: 'Products', to: '/product-list' })
    settingsItems.push({ component: CNavItem, name: 'Product Categories', to: '/product-category' })
    settingsItems.push({ component: CNavItem, name: 'Tax', to: '/base/tax' })
    settingsItems.push({ component: CNavItem, name: 'Vendor', to: '/vendor-list' })
    settingsItems.push({ component: CNavItem, name: 'Package Duration', to: '/package-duration-list' })
    settingsItems.push({ component: CNavItem, name: 'Partner', to: '/partner-list' })
    settingsItems.push({ component: CNavItem, name: 'Area', to: '/area-list' })
    settingsItems.push({ component: CNavItem, name: 'Users', to: '/user-list' })
    settingsItems.push({ component: CNavItem, name: 'Role', to: '/role-list' })
  
  }

  if (settingsItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: <Translation>{(t) => t('Settings')}</Translation>,
      to: '/base',
      icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
      items: settingsItems,
    })
  }


  // ===== IMPORT =====
  if (hasPermission(permissions, 'Usage', ['manage_import_usage'])) {
    _nav.push({
      component: CNavGroup,
      name: <Translation>{(t) => t('Import')}</Translation>,
      to: '/base',
      icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
      items: [
        { component: CNavItem, name: 'Import Usage', to:'/base/imageUsage' },
      ],
    })
  }

  return _nav
}

export default getNav
