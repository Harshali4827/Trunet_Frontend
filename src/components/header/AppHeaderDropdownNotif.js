import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
} from '@coreui/icons'
const AppHeaderDropdownNotif = () => {
  const { t } = useTranslation()
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
  <span className="d-inline-block my-1 mx-2 position-relative">
    <CIcon icon={cilBell} size="lg" className="text-white" />
    <CBadge position="top-end" shape="rounded-circle" className="p-1">
      <span className="visually-hidden">{itemsCount} new alerts</span>
    </CBadge>
  </span>
</CDropdownToggle>
      <CDropdownMenu className="py-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          {t('notificationsCounter', { counter: itemsCount })}
        </CDropdownHeader>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownNotif
