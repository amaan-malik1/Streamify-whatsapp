import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Notification from './pages/Notification.jsx'
import Call from './pages/Call.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Chat from './pages/Chat.jsx'
import PageLoader from './components/pageLoader.jsx'
import Layout from './components/Layout.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js'


function App() {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboard;

  //showing loader while authUser is loading
  if (isLoading) return (<PageLoader />);

  return (
    <div className='h-screen' data-theme={theme}>
      {/* Added toaster */}
      <Toaster position="top-center" />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element=
          {
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Home />
              </Layout>

            ) : (<Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />)
          }
        />


        {/* Signup */}
        <Route
          path="/signup"
          element=
          {
            !isAuthenticated ? <Signup /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element=
          {
            !isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />
          }
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element=
          {
            isAuthenticated ? (
              !isOnboarded ? (
                <Onboarding />
              ) : (<Navigate to={'/'} replace />)
            ) : (
              <Navigate to={'/login'} replace />
            )
          }
        />

        {/* Chat */}
        <Route
          path="/chat"
          element=
          {
            isAuthenticated ? <Chat /> : <Navigate to="/login" replace />
          }
        />

        {/* Call */}
        <Route
          path="/call"
          element=
          {
            isAuthenticated ? <Call /> : <Navigate to="/login" replace />
          }
        />

        {/* Notification */}
        <Route
          path="/notification"
          element=
          {
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Notification />
              </Layout>

            ) : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
          }
        />
      </Routes>
    </div>
  )
}

export default App
