import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Customers from './pages/Customers'
import Calendar from './pages/Calendar'
import Invoices from './pages/Invoices'
import Quotes from './pages/Quotes'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="customers" element={<Customers />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
