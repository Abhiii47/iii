// src/pages/CreateListing.jsx
import React, { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function CreateListing({ user }) {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!user) return alert('Sign in as provider')
    if (!title || !lat || !lng) return alert('Title, lat and lng required')
    const form = new FormData()
    form.append('title', title); form.append('address', address)
    form.append('lat', lat); form.append('lng', lng)
    if (image) form.append('image', image)
    try {
      await API.post('/listings', form, { headers: {'Content-Type':'multipart/form-data'} })
      alert('Listing created')
      navigate('/dashboard')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Listing</h2>
        <div className="grid gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 border rounded-md" />
          <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="w-full px-3 py-2 border rounded-md" />
          <div className="grid grid-cols-2 gap-2">
            <input value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude" className="w-full px-3 py-2 border rounded-md" />
            <input value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <input type="file" onChange={e=>setImage(e.target.files[0])} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreate} className="px-3 py-1 rounded-md bg-slate-900 text-white">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}


