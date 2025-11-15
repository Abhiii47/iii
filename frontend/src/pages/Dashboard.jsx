// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [listings, setListings] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/listings')
        setListings(res.data ?? res)
      } catch {}
      try {
        const r = await API.get('/bookings/provider')
        setRequests(r.data ?? r)
      } catch {}
    }
    load()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Provider Dashboard</h2>
        <Link to="/create" className="brand-btn">Create Listing</Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-3">My Listings</h3>
        {listings.length === 0 ? <div className="text-sm text-slate-500">No listings yet.</div> :
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map(l=>(
              <div key={l._id || l.id} className="flex items-center gap-4 p-3 border rounded-md">
                <div className="w-28 h-20 overflow-hidden rounded-md bg-slate-100">
                  {l.imageUrl ? <img src={(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000') + l.imageUrl} alt='' className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-slate-500">{l.address}</div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-3">Booking Requests</h3>
        {requests.length === 0 ? <div className="text-sm text-slate-500">No requests yet.</div> :
          <ul className="space-y-3">
            {requests.map(r=>(
              <li key={r._id || r.id} className="p-3 border rounded-md flex justify-between items-start">
                <div>
                  <div className="font-medium">{r.listingTitle || r.listing_title}</div>
                  <div className="text-sm text-slate-500 mt-1">From: {r.fromDate || r.start_date} To: {r.toDate || r.end_date}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="text-sm font-semibold">{r.status}</div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-md bg-green-600 text-white">Accept</button>
                      <button className="px-3 py-1 rounded-md border">Decline</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  )
}
