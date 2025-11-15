// src/pages/MyBookings.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        const res = await API.get('/bookings/user').catch(()=>API.get('/bookings'))
        setBookings(res.data ?? res)
      } catch {}
    }
    load()
  }, [user])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {bookings.length===0 && <div className="text-sm text-gray-500">No bookings yet.</div>}
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b._id || b.id} className="p-3 border rounded">
              <div className="font-medium">{b.listingTitle || b.listing_title}</div>
              <div className="text-sm text-gray-500">From: {b.start_date || b.fromDate} To: {b.end_date || b.toDate}</div>
              <div>Status: <strong>{b.status}</strong></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
