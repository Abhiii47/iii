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

  // Separate listings by type - more precise filtering
  const roomListings = listings.filter(l => {
    const listingType = (l.type || '').toLowerCase().trim()
    // Only include if explicitly a room/stay type
    return listingType === 'room' || 
           listingType === 'stay' || 
           listingType.includes('room') ||
           listingType.includes('stay') ||
           (listingType === '' && !l.type) // If no type set, default to room
  })
  
  const foodListings = listings.filter(l => {
    const listingType = (l.type || '').toLowerCase().trim()
    // Only include if explicitly a food type
    return listingType === 'food' || 
           listingType === 'mess' || 
           listingType === 'tiffin' ||
           listingType.includes('food') ||
           listingType.includes('mess') ||
           listingType.includes('tiffin')
  })

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
            <section className="fancy-card p-6">
              <div className="flex items-center gap-4">
                <input className="input flex-1" placeholder="Search by city, college or locality" />
                <button className="brand-btn" title="Quick filters">
                  <FiFilter className="mr-2 inline" /> Filters
                </button>
                <button onClick={() => setDrawerOpen(true)} className="px-4 py-3 border-2 rounded-xl hover:bg-white/50 transition-all hidden sm:inline">Advanced</button>
              </div>
            </section>

            <section className="fancy-card">
              <GoogleMapComponent listings={mapPoints} />
            </section>

            {/* Rooms Section */}
            <section ref={listingsRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold rainbow-text">🏠 Rooms & Stays</h2>
                <span className="text-sm text-slate-600 bg-white/80 px-3 py-1 rounded-full border">
                  {roomListings.length} available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))
                  : (roomListings.length === 0
                      ? <div className="col-span-full text-center py-12 text-slate-500">
                          <p className="text-lg mb-2">No rooms available yet</p>
                          <p className="text-sm">Be the first to list a room!</p>
                        </div>
                      : roomListings.map(l => (
                          <div key={l._id || l.id} className="relative group">
                            <Link to={`/listing/${l._id || l.id}`} className="block">
                              <ListingCard listing={l} onBook={handleBook} />
                            </Link>
                            {user && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleBook(l)
                                }}
                                className="absolute bottom-4 right-4 z-10 brand-btn text-sm px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Book Now
                              </button>
                            )}
                          </div>
                        ))
                    )
                }
              </div>
            </section>

            {/* Food Section */}
            <section className="space-y-4 mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold rainbow-text">🍽️ Food & Mess Services</h2>
                <span className="text-sm text-slate-600 bg-white/80 px-3 py-1 rounded-full border">
                  {foodListings.length} available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (<SkeletonCard key={`food-${i}`} />))
                  : (foodListings.length === 0
                      ? <div className="col-span-full text-center py-12 text-slate-500">
                          <p className="text-lg mb-2">No food services available yet</p>
                          <p className="text-sm">Be the first to list a mess or tiffin service!</p>
                        </div>
                      : foodListings.map(l => (
                          <div key={l._id || l.id} className="relative group">
                            <Link to={`/listing/${l._id || l.id}`} className="block">
                              <ListingCard listing={l} onBook={handleBook} />
                            </Link>
                            {user && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleBook(l)
                                }}
                                className="absolute bottom-4 right-4 z-10 brand-btn text-sm px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Book Now
                              </button>
                            )}
                          </div>
                        ))
                    )
                }
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="fancy-card p-6">
              <h4 className="font-bold text-lg mb-4 rainbow-text">Quick View</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Rooms</div>
                  <div className="text-2xl font-bold text-purple-600">{roomListings.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Available stays</div>
                </div>
                <div className="border-t border-purple-200/50 pt-4">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Food Services</div>
                  <div className="text-2xl font-bold text-blue-600">{foodListings.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Mess & tiffin</div>
                </div>
              </div>
            </div>

            <div className="fancy-card p-6">
              <h4 className="font-bold mb-4">Recently Added</h4>
              <ul className="space-y-3">
                {listings.slice(0, 5).map(l => (
                  <li key={l._id || l.id}>
                    <Link to={`/listing/${l._id || l.id}`} className="flex items-center gap-3 hover:bg-white/50 p-2 rounded-lg transition-all">
                      <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {l.imageUrl ? (
                          <img 
                            src={(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000') + l.imageUrl} 
                            alt={l.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{l.title}</div>
                        <div className="text-xs text-slate-500">₹{l.price || 'N/A'}</div>
                        <div className="text-xs text-purple-600 mt-1">
                          {l.type === 'food' || l.type?.toLowerCase().includes('food') ? '🍽️ Food' : '🏠 Room'}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {!user && (
              <div className="fancy-card p-6 text-center">
                <h4 className="font-bold mb-2">Ready to book?</h4>
                <p className="text-sm text-slate-600 mb-4">Sign in to start booking rooms and food services</p>
                <Link to="/login" className="brand-btn inline-block">
                  Sign In
                </Link>
              </div>
            )}
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

