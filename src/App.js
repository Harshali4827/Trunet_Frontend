import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { CSpinner } from '@coreui/react-pro'
import './scss/style.scss'

import './scss/examples.scss'
import ProtectedRoute from './utils/ProtectedRoutes';
import { AlertProvider } from './context/AlertContext';


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const EmailApp = React.lazy(() => import('./views/apps/email/EmailApp'))

const App = () => {
  return (
    <AlertProvider>
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
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/apps/email/*" name="Email App" element={<EmailApp />} />

          <Route path="*" element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </HashRouter>
    </AlertProvider>
  )
}

export default App
