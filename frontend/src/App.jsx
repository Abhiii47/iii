// src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateListing from './pages/CreateListing'
import Dashboard from './pages/Dashboard'
import MyBookings from './pages/MyBookings'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <div>
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-semibold text-slate-900">Room & Food Finder</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-slate-700 hover:text-slate-900">Home</Link>
            <Link to="/bookings" className="text-sm text-slate-700 hover:text-slate-900">My Bookings</Link>
            {user?.role === 'provider' && <Link to="/dashboard" className="text-sm text-slate-700 hover:text-slate-900">Dashboard</Link>}
            {user?.role === 'provider' && <Link to="/create" className="text-sm text-slate-700 hover:text-slate-900">Create Listing</Link>}
            {user ? (
              <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-slate-900 text-white">Sign out</button>
            ) : (
              <Link to="/login" className="text-sm text-slate-700 hover:text-slate-900">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/create" element={<CreateListing user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/bookings" element={<MyBookings user={user} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

