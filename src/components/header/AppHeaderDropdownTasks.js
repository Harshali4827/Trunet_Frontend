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
import { cilListRich } from '@coreui/icons'

const AppHeaderDropdownTasks = () => {
  const { t } = useTranslation()
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilListRich} size="lg" />
          <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
            <span className="visually-hidden">{itemsCount} new alerts</span>
          </CBadge>
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          {t('taskCounter', { counter: itemsCount })}
        </CDropdownHeader>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownTasks
