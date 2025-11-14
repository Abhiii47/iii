// src/pages/MyBookings.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (user) {
      API.get('/bookings/user').then(res=>setBookings(res.data)).catch(()=>{})
    }
  }, [user])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {bookings.length===0 && <div className="text-sm text-gray-500">No bookings yet.</div>}
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b._id} className="p-3 border rounded">
              <div className="font-medium">{b.listingTitle}</div>
              <div className="text-sm text-gray-500">From: {b.fromDate} To: {b.toDate}</div>
              <div>Status: <strong>{b.status}</strong></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
