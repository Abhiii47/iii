// src/pages/Login.jsx
import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('user')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (setUser) setUser(res.data.user)
      navigate('/')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (setUser) setUser(res.data.user)
      navigate('/')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Login / Register</h2>
        <div className="grid gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (register)" className="w-full px-3 py-2 border rounded-md" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-2">
            <button onClick={handleLogin} className="px-3 py-1 rounded-md bg-slate-900 text-white">Login</button>
            <button onClick={handleRegister} className="px-3 py-1 rounded-md border">Register</button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Role:</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="px-2 py-1 border rounded-md">
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

