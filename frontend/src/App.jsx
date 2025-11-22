import React, { use } from 'react'
import { Route,Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import {toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'
const App = () => {
  // axios 
  // react query tanstack query

  const {data,isLoading,error} = useQuery({
    queryKey: ['user'],
    queryFn:async()=>{
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false // auth check
  })

  console.log(data);
  
  return (
    <div className="h-screen" data-theme="night">
      <button onClick={()=>{toast.success("Hello World!")}}>Create Toast</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
      <Toaster></Toaster>
    </div>
  )
}

export default App

