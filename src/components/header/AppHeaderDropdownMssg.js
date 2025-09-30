import React from 'react'
import { useTranslation } from 'react-i18next'
import {
 
  CDropdown,

} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeOpen } from '@coreui/icons'

const AppHeaderDropdownMssg = () => {
  const { t } = useTranslation()
  const itemsCount = 4
  return (
    <CDropdown variant="nav-item" alignment="end">

       
    </CDropdown>
  )
}

export default AppHeaderDropdownMssg
