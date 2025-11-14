// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [listings, setListings] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    API.get('/listings').then(res=>setListings(res.data)).catch(()=>{})
    if (user) {
      API.get('/bookings/provider').then(res=>setRequests(res.data)).catch(()=>{})
    }
  }, [user])

  const handleAction = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/status`, { status })
      alert('Updated')
      API.get('/bookings/provider').then(res=>setRequests(res.data))
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Provider Dashboard</h2>
        <Link to="/create" className="px-3 py-1 rounded-md bg-slate-900 text-white">Create Listing</Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
        <h3 className="font-semibold mb-3">My Listings</h3>
        {listings.filter(l=>l.owner && l.owner._id === (user && user.id)).length === 0 && <div className="text-sm text-gray-500">No listings yet.</div>}
        <ul className="space-y-3">
          {listings.filter(l=>l.owner && l.owner._id === (user && user.id)).map(l=>(
            <li key={l._id} className="flex items-center gap-4 p-2 border rounded">
              <img src={l.imageUrl ? `${API.defaults.baseURL.replace('/api','')}${l.imageUrl}` : 'https://via.placeholder.com/80'} alt='' className="w-20 h-14 object-cover rounded" />
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-sm text-gray-500">{l.address}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-3">Booking Requests</h3>
        {requests.length===0 && <div className="text-sm text-gray-500">No requests yet.</div>}
        <ul className="space-y-3">
          {requests.map(r => (
            <li key={r._id} className="p-3 border rounded flex justify-between items-start">
              <div>
                <div className="font-medium">{r.listingTitle}</div>
                <div className="text-sm text-gray-500">From: {r.fromDate} To: {r.toDate}</div>
                <div className="mt-2">{r.message}</div>
                <div className="text-sm text-gray-500 mt-2">User: {r.userId}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="font-semibold">{r.status}</div>
                {r.status==='pending' && (
                  <>
                    <button onClick={()=>handleAction(r._id,'accepted')} className="px-3 py-1 rounded-md bg-slate-900 text-white">Accept</button>
                    <button onClick={()=>handleAction(r._id,'declined')} className="px-3 py-1 rounded-md border">Decline</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


