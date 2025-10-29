import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CContainer,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CInputGroup,
  useColorModes,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
 
import {
  AppHeaderDropdown,
  AppHeaderDropdownNotif,
} from './header/index'
 
const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-pro-react-admin-template-theme-bright')
  const { i18n, t } = useTranslation()
 
  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)
  const sidebarShow = useSelector((state) => state.sidebarShow)

const unfoldable = useSelector((state) => state.sidebarUnfoldable)

const handleMenuClick = () => {
  dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
}

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
 
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef} style={{backgroundColor:'#2759a2'}}>
      <CContainer className="px-4" fluid>
        
        {/* <CHeaderToggler
          className={classNames('d-lg-none', {
            'prevent-hide': !sidebarShow,
          })}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}>
          <CIcon icon={cilMoon} style={{ fontSize: '24px' }} />
        </CHeaderToggler> */}


        {/*   NEW for menu icon.. */}
<CHeaderToggler onClick={handleMenuClick} style={{marginLeft:'-40px'}}>
  <CIcon icon={cilMenu} size="lg" 
  style={{color:'#fff', verticalAlign: 'middle',
    position:'relative',filter:'brightness(150%)',
  // fill:'#fff',filter:'brightness(150%)'
  }}/>
</CHeaderToggler>

<CHeaderNav className="d-none d-md-flex ms-auto align-items-center">
  <CForm className="d-none d-sm-flex me-3">
    <>
  <style>
     {`
       .placeholder-black::placeholder {
         color: #555;
       }
     `}
   </style>

   <CInputGroup className="bg-white text-black">
     <CFormInput
       placeholder="Search"
       aria-label="Search"
       className="bg-white text-black placeholder-black "
        style={{
    border: 'none',
    boxShadow: 'none',
  }}
     />
   </CInputGroup>
 </>
  </CForm>
 
  <AppHeaderDropdownNotif />
</CHeaderNav>
 
        <CHeaderNav className="ms-auto ms-md-0">
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> {t('light')}
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> {t('dark')}
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}
 
export default AppHeader
 
 