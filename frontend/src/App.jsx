// src/App.jsx (REPLACE your existing file with this)
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateListing from './pages/CreateListing'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MyBookings from './pages/MyBookings'
import API from './services/api'

function readInitialUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
}

export default function App() {
  const [user, setUser] = useState(readInitialUser())
  const navigate = useNavigate()

  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  // simple warmup: prefetch a couple endpoints so API is exercised
  useEffect(() => {
    (async () => {
      try {
        await API.get('/listings').catch(()=>{})
      } catch {}
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[rgb(248,250,252)]">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/create" element={<CreateListing user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/login" element={<Login setUser={(u)=>{ localStorage.setItem('user', JSON.stringify(u)); setUser(u)}} />} />
          <Route path="/bookings" element={<MyBookings user={user} />} />
        </Routes>
      </main>

      <footer className="mt-16 py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} Room & Food Finder</footer>
    </div>
  )
}





