// import React from 'react'
// import { useTranslation } from 'react-i18next'
// import {
//   CAvatar,
//   CDropdown,
//   CDropdownHeader,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react-pro'
// import avatar8 from './../../assets/images/avatars/8.jpg'
// import avatar10 from './../../assets/images/avatars/10.png'
// const AppHeaderDropdown = () => {
//   const { t } = useTranslation()
//   return (
//     <CDropdown variant="nav-item" alignment="end">
//       <CDropdownToggle className="py-0" caret={false}>
//         {/* <CAvatar src={avatar8} size="md" status="success" /> */}
//          <CAvatar src={avatar10} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0">
//         <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
//           {t('account')}            
//             <div className="flex justify-between items-center bg-[#2759A2] text-white px-4 w-[800px] fixed top-0 z-40 h-8">
//   <div className="flex items-center h-full">
    
//     <div className="fixed right-0 w-72 bg-[#2759A2] shadow-lg z-50 border border-gray-300">
//       <div className="p-4 flex flex-col items-center">
//         <div className="h-20 w-20 rounded-full border-2 border-white overflow-hidden mb-2">
//           <img
//             src={avatar10}
//             alt="Profile"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <p className="text-gray-300 font-light text-xs">
//           Infocus.VashiHO@trunet.co.in
//         </p>
//         <p className="text-gray-200 text-light">Center - VASHI HO</p>
//       </div>

//       <div className="bg-gray-100 px-4 py-3 flex justify-between">
//         <button className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 py-1 px-2">
//           Change Password
//         </button>
//         <button className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 px-2 py-1">
//           Sign Out
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

            
//         </CDropdownHeader>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default AppHeaderDropdown

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import avatar10 from './../../assets/images/avatars/10.png'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userCenter')
    navigate('/login')
  }
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0 d-flex align-items-center" caret={false}  style={{ height: '100%' }}  >
  <CAvatar src={avatar10} size="sm" />
  <span
    className="ms-2"
    style={{
      color: 'white',fontWeight: '400',fontSize: '14px',}}>
    Doulati Jagtap
  </span>
</CDropdownToggle>


      <CDropdownMenu className="pt-1 w-[300px]">
        <CDropdownHeader
         className="bg-[#2759A2] text-white fw-semibold text-center py-1"
          style={{ backgroundColor: '#2759A2',height:'5px',padding:'10px' }}
         >
          
        </CDropdownHeader>
        <div style={{backgroundColor: '#2759A2',color: 'white',textAlign: 'center',padding: '16px',width: '300px',height: '170px',}}>
  
  <div
    style={{height: '84px', width: '84px',borderRadius: '50%',border: '3px solid #ffffff33',
      overflow: 'hidden',margin: '0 auto 8px auto', }}>
    <img
      src={avatar10}
      alt="Profile"
      style={{width: '100%',height: '100%',objectFit: 'cover',borderRadius: '50%',border: '2px solid #2759A2',}}/>
  </div>

  <p style={{ color: '#ffffffcc', fontWeight: '300', fontSize: '12px', margin: 0 }}>
    TESTID@trunet.co.in
  </p>
  <p style={{ color: '#ffffffcc', fontSize: '17px', marginTop: '10px'}}>
    Outlet - VASHI HO(TEST)
  </p>
</div>
          <div style={{backgroundColor:'light', paddingTop:'4px',paddingBottom:'2px',display:'flex',gap:'4',justifyContent:'space-between',margin:'5px'}}>
          <button className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 py-1 px-2">Change Password</button>
          <button className="text-gray-700 hover:text-gray-900 text-sm border border-gray-300 px-2 py-1" onClick={handleSignOut}>Sign Out</button>
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}
export default AppHeaderDropdown
