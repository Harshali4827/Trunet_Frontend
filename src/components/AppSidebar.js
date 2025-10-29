

import React, { useContext} from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from '@coreui/react-pro'

import { AppSidebarNav } from './AppSidebarNav'

import getNav from '../_nav'
import { AuthContext } from 'src/context/AuthContext'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { permissions } = useContext(AuthContext)
  const navItems = getNav(permissions)

  return (
    <CSidebar
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      className={unfoldable ? 'sidebar-narrow-unfoldable' : ''}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={{backgroundColor:"#2759a2"}}>
        <CSidebarBrand as={NavLink} to="/" style={{textDecoration:'none'}}>
           <h3 className='sidebar-brand-full' 
           style={{
            height:'1px',fontSize:'20px',textAlign:'center',
            fontFamily:'"Helvetica Neue", Helvetica, Arial, sans-serif',
            marginBottom:'17px',color:'#ffffff'
              
            }}>Trunet Stock</h3>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navItems} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
