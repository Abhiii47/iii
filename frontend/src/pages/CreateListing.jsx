// src/pages/CreateListing.jsx
import React, { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function CreateListing({ user }) {
  const [title,setTitle] = useState('')
  const [address,setAddress] = useState('')
  const [lat,setLat] = useState('')
  const [lng,setLng] = useState('')
  const [image,setImage] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!user) return alert('Sign in as provider')
    if (!title || !lat || !lng) return alert('Please add title, lat and lng')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('address', address)
      form.append('lat', lat)
      form.append('lng', lng)
      if (image) form.append('image', image)

      await API.post('/listings', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Created')
      navigate('/dashboard')
    } catch (e) { alert(e.response?.data?.message || e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Listing</h2>

        <div className="grid gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="input" />
          <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="input" />
          <div className="grid grid-cols-2 gap-2">
            <input value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude" className="input" />
            <input value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude" className="input" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Image</label>
            <input type="file" onChange={e=>setImage(e.target.files[0])} className="mt-2" />
            {image && <div className="mt-2"><img alt="preview" src={URL.createObjectURL(image)} className="w-48 h-32 object-cover rounded-md" /></div>}
          </div>

          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={loading} className="brand-btn">
              {loading ? 'Creating…' : 'Create listing'}
            </button>
            <button onClick={()=>{ setTitle(''); setAddress(''); setLat(''); setLng(''); setImage(null) }} className="px-3 py-1 rounded-md border">Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}
