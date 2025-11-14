// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function Home({ user }) {
  const [listings, setListings] = useState([])

  useEffect(() => {
    API.get('/listings').then(res => setListings(res.data)).catch(()=>{})
  }, [])

  const handleBook = async (listing) => {
    if (!user) return alert('Please sign in to book')
    const fromDate = prompt('From date (YYYY-MM-DD)') || ''
    const toDate = prompt('To date (YYYY-MM-DD)') || ''
    try {
      await API.post('/bookings', { listingId: listing._id, fromDate, toDate, message: '' })
      alert('Booking requested')
    } catch (e) { alert(e.response?.data?.message || e.message) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg h-96 flex items-center justify-center text-gray-500">Map Area (Google Maps)</div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">All Listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(l => (
              <div key={l._id} className="bg-white rounded-lg shadow p-4">
                <div className="h-40 mb-3 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {l.imageUrl ? <img src={`${API.defaults.baseURL.replace('/api','')}${l.imageUrl}`} alt='' className="w-full h-full object-cover" /> : <div className="text-gray-400">No image</div>}
                </div>
                <div className="font-semibold">{l.title}</div>
                <div className="text-sm text-gray-500">{l.address}</div>
                <div className="mt-3"><button onClick={()=>handleBook(l)} className="px-3 py-1 rounded-md bg-slate-900 text-white">Book</button></div>
              </div>
            ))}
            {listings.length===0 && <div className="text-gray-500">No listings found.</div>}
          </div>
        </div>
      </div>

      <aside className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Nearby Listings</h3>
        <ul className="space-y-3">
          {listings.map(l => (
            <li key={l._id} className="py-2 border-b last:border-b-0">
              <div className="font-medium">{l.title}</div>
              <div className="text-sm text-gray-500">{l.address}</div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

