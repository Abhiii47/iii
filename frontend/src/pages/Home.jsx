// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from 'react'
import API from '../services/api'
import ListingCard from '../components/ListingCard'
import GoogleMapComponent from '../components/GoogleMap'
import SkeletonCard from '../components/SkeletonCard'
import LottieEmpty from '../components/LottieEmpty'
import FilterDrawer from '../components/FilterDrawer'
import BookingModal from '../components/BookingModal'
import Hero from '../components/Hero'
import { FiFilter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Home({ user }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // modal state for booking
  const [modalOpen, setModalOpen] = useState(false)
  const [activeListing, setActiveListing] = useState(null)

  // reference used by hero CTA to scroll to listings
  const listingsRef = useRef(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await API.get('/listings')
        const data = res.data ?? res
        if (mounted) setListings(data)
      } catch (e) {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
          const r = await fetch(base + '/listings')
          if (r.ok && mounted) setListings(await r.json())
        } catch {}
      } finally { mounted && setLoading(false) }
    }
    load()
    return () => mounted = false
  }, [])

  // open booking modal (instead of prompt)
  const handleBook = (listing) => {
    if (!user) return alert('Please sign in to book')
    setActiveListing(listing)
    setModalOpen(true)
  }

  // confirmed from BookingModal
  const onConfirmBooking = async ({ listing, from, to }) => {
    try {
      await API.post('/bookings', { listingId: listing._id || listing.id, fromDate: from, toDate: to })
      alert('Booking requested')
      setModalOpen(false)
    } catch (e) {
      alert(e.response?.data?.message || e.message)
    }
  }

  // map points for GoogleMapComponent
  const mapPoints = (listings || []).map(l => ({
    lat: Number(l.lat || l.latitude || 0),
    lng: Number(l.lng || l.longitude || l.lon || 0),
    title: l.title,
    price: l.price
  }))

  return (
    <>
      <Hero onSearch={() => { listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <input className="px-4 py-3 rounded-xl border flex-1" placeholder="Search by city, college or locality" />
                <button className="brand-btn" title="Quick filters">
                  <FiFilter className="mr-2" /> Filters
                </button>
                <button onClick={() => setDrawerOpen(true)} className="px-3 py-2 border rounded-md hidden sm:inline">Advanced</button>
              </div>
            </section>

            <section className="fancy-card">
              <GoogleMapComponent listings={mapPoints} />
            </section>

            <section ref={listingsRef}>
              <h3 className="text-xl font-semibold mb-4">All Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))
                  : (listings.length === 0
                      ? <LottieEmpty message="No places found — create the first listing!" />
                      : listings.map(l => (
                          <Link to={`/listing/${l._id || l.id}`} key={l._id || l.id}>
                            <ListingCard listing={l} onBook={handleBook} />
                          </Link>
                        ))
                    )
                }
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold mb-2">Nearby Listings</h4>
              <ul className="space-y-3">
                {listings.slice(0, 6).map(l => (
                  <li key={l._id || l.id} className="flex items-center gap-3">
                    <div className="w-14 h-10 bg-slate-100 rounded-md overflow-hidden">
                      {l.imageUrl ? <img src={(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000') + l.imageUrl} alt='' className="w-full h-full object-cover" /> : null}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{l.title}</div>
                      <div className="text-xs text-slate-400">{l.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold mb-2">Top providers</h4>
              <p className="text-sm text-slate-500">Partner with us to list your property</p>
            </div>
          </aside>

          <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onApply={() => { setDrawerOpen(false) }} />
        </div>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={activeListing}
        onConfirm={(data) => onConfirmBooking({ listing: activeListing, from: data.from, to: data.to })}
      />
    </>
  )
}

