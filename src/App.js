import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { CSpinner } from '@coreui/react-pro'
import './scss/style.scss'

import './scss/examples.scss'
import ProtectedRoute from './utils/ProtectedRoutes';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './context/AuthContext';
import CenterSelection from './views/pages/center-selection/CenterSelection';


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))


const App = () => {
  return (
    <AlertProvider>
       <AuthProvider> 
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/select-center" name="Select Your Branch" element={<CenterSelection />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route path="*" element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </HashRouter>
    </AuthProvider>
    </AlertProvider>
  )
}

export default App
