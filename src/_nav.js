import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilMoney,
} from '@coreui/icons'
import { CNavGroup, CNavItem, } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <i className="fa fa-dashboard nav-icon"   style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
  },

  {
    component: CNavItem,
    name: <Translation>{(t) => t('Stock Request')}</Translation>,
    to: '/stock-request',
    icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },

  {
    component: CNavItem,
    name: <Translation>{(t) => t('Stock Usage')}</Translation>,
    to:'/theme/stockUsg',
    icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
    to: '/stock-purchase',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
    to: '/stock-transfer',
    icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Shifting Request')}</Translation>,
    to: '/shifting-request',
    icon: <i className="fa fa-truck nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Report Submission')}</Translation>,
    to: '/report-submission',
    icon: <i className="fa fa-check nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
  },
  // MASTERS 
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Master')}</Translation>,
    to: '/base',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,

    items: [
      {
        component: CNavItem,
        name: 'Customer',
        to:'/customers-list'
      },
      {
        component: CNavItem,
        name: 'Building',
         to:'/building-list'
      },
      {
        component: CNavItem,
        name: 'Control Room',
         to:'/controlRoom-list'
      },
      {
        component: CNavItem,
        name: 'Center',
         to:'/center-list'
      },
       {
        component: CNavItem,
        name: 'Challan',
         to:'/base/challan'
      },
  ]},
  

  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Report')}</Translation>,
    to: '/base',
     icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
    items: [
      {
        component: CNavItem,
        name: 'Centers Stock',
        to: '/base/centerStk',
      },
      {
        component: CNavItem,
        name: 'Available Stock',
        to:'/base/availableStk',
      },
      {
        component: CNavItem,
        name: 'Transaction Report',
        to: '/base/trasaction',
      },
      {
        component: CNavItem,
        name: 'Purchase Detail',
        to:'/base/purchaseDtl'
      },
      {
        component: CNavItem,
        name: 'Indent Summary',
        to: '/base/indentSummary',
      },
      {
        component: CNavItem,
        name: 'Indent Detail',
        to: '/base/indentDetail',
      },
      {
        component: CNavItem,
        name: 'Transfer Summary',
        to: '/base/transferSummary',
      },
      {
        component: CNavItem,
        name: 'Transfer Detail',
        to: '/base/transferDetail',
      },
      {
        component: CNavItem,
        name: 'Usage Summary',
        to: '/base/usageSummary',
      },
      {
        component: CNavItem,
        name: 'Usage Detail',
        to: '/base/usageDetail',
      },
      {
        component: CNavItem,
        name: 'Usage Replace',
        to: '/base/usageReplace',
      },
      {
        component: CNavItem,
        name: 'Stolen Report',
        to: '/base/stolenReport',
      },
      {
        component: CNavItem,
        name: 'Indent/Usage Summary',
        to: '/base/indentUsageSummary',
      },
      {
        component: CNavItem,
        name: 'Purchase Analysis',
        to:'/base/purchaseAnalysis'
      },
      {
        component: CNavItem,
        name: 'Product Serial Track',
        to: '/base/productSerial',
      },
      {
        component: CNavItem,
        name: 'ONU Track Report',
        to:'/base/onuTrack',
      },
  ]},

  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Settings')}</Translation>,
    to: '/base',
    icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
    items: [
      {
        component: CNavItem,
        name: 'Center',
        to: '/center-list',
      },
      {
        component: CNavItem,
        name: 'Products',
        to: '/product-list',
      },
      {
        component: CNavItem,
        name: 'Product Categories',
        to:'/product-category'
      },
      {
        component: CNavItem,
        name: 'Tax',
        to: '/base/tax',
      },
      {
        component: CNavItem,
        name: 'Vendor',
        to: '/vendor-list',
      },
      {
        component: CNavItem,
        name: 'Package Duration',
        to: '/package-duration-list',
      },
      {
        component: CNavItem,
        name: 'Partner',
        to:'/partner-list',
      },
      {
        component: CNavItem,
        name: 'Area',
        to: '/area-list',
      },
      {
        component: CNavItem,
        name: 'Users',
        to: '/user-list',
      },
      {
        component: CNavItem,
        name: 'Role',
        to: '/role-list',
      },
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
  ]},


  // IMPORT 
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Import')}</Translation>,
    to: '/base',
    icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
    items: [
      {
        component: CNavItem,
        name: 'Import Usage',
        to:'/base/imageUsage'
      },
  ]},
]

export default _nav
