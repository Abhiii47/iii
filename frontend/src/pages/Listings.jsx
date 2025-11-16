// src/pages/Listings.jsx
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import ListingCard from '../components/ListingCard'
import SkeletonCard from '../components/SkeletonCard'
import BookingModal from '../components/BookingModal'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

export default function Listings({ user }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all') // 'all', 'room', 'food'

  // modal state for booking
  const [modalOpen, setModalOpen] = useState(false)
  const [activeListing, setActiveListing] = useState(null)

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
      } finally { 
        if (mounted) setLoading(false) 
      }
    }
    load()
    return () => mounted = false
  }, [])

  // open booking modal
  const handleBook = (listing) => {
    if (!user) {
      alert('Please sign in to book')
      return
    }
    setActiveListing(listing)
    setModalOpen(true)
  }

  // confirmed from BookingModal
  const onConfirmBooking = async ({ listing, from, to }) => {
    try {
      await API.post('/bookings', { listingId: listing._id || listing.id, fromDate: from, toDate: to })
      alert('Booking requested successfully!')
      setModalOpen(false)
    } catch (e) {
      alert(e.response?.data?.message || e.message || 'Failed to create booking')
    }
  }

  // Filter listings - more precise filtering to avoid duplicates
  const roomListings = listings.filter(l => {
    const listingType = (l.type || '').toLowerCase().trim()
    // Only include if explicitly a room/stay type
    // Exclude food types explicitly
    if (listingType === 'food' || listingType === 'mess' || listingType === 'tiffin' || 
        listingType.includes('food') || listingType.includes('mess') || listingType.includes('tiffin')) {
      return false
    }
    return listingType === 'room' || 
           listingType === 'stay' || 
           listingType.includes('room') ||
           listingType.includes('stay') ||
           listingType === '' // If no type set, default to room
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

  // Apply search filter
  const filterBySearch = (list) => {
    if (!searchQuery.trim()) return list
    const query = searchQuery.toLowerCase()
    return list.filter(l => 
      (l.title || '').toLowerCase().includes(query) ||
      (l.address || '').toLowerCase().includes(query) ||
      (l.description || '').toLowerCase().includes(query)
    )
  }

  // Apply type filter
  const getFilteredListings = () => {
    let filtered = []
    if (selectedType === 'room') {
      filtered = filterBySearch(roomListings)
    } else if (selectedType === 'food') {
      filtered = filterBySearch(foodListings)
    } else {
      filtered = filterBySearch([...roomListings, ...foodListings])
    }
    return filtered
  }

  const filteredListings = getFilteredListings()
  const displayedRoomListings = selectedType === 'all' || selectedType === 'room' 
    ? filterBySearch(roomListings) 
    : []
  const displayedFoodListings = selectedType === 'all' || selectedType === 'food' 
    ? filterBySearch(foodListings) 
    : []

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold rainbow-text mb-4">Browse Listings</h1>
          <p className="text-slate-600">Find the perfect room or food service for your needs</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="fancy-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input w-full pl-12"
                placeholder="Search by title, address, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300'
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setSelectedType('room')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedType === 'room'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300'
                }`}
              >
                🏠 Rooms ({roomListings.length})
              </button>
              <button
                onClick={() => setSelectedType('food')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedType === 'food'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300'
                }`}
              >
                🍽️ Food ({foodListings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Listings Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (<SkeletonCard key={i} />))}
          </div>
        ) : (
          <>
            {/* Show all if no filter, or separate sections */}
            {selectedType === 'all' ? (
              <>
                {/* Rooms Section */}
                {displayedRoomListings.length > 0 && (
                  <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold rainbow-text">🏠 Rooms & Stays</h2>
                      <span className="text-sm text-slate-600 bg-white/80 px-4 py-2 rounded-full border">
                        {displayedRoomListings.length} available
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedRoomListings.map(l => (
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
                      ))}
                    </div>
                  </section>
                )}

                {/* Food Section */}
                {displayedFoodListings.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold rainbow-text">🍽️ Food & Mess Services</h2>
                      <span className="text-sm text-slate-600 bg-white/80 px-4 py-2 rounded-full border">
                        {displayedFoodListings.length} available
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedFoodListings.map(l => (
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
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              /* Show filtered results in single grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-xl text-slate-500 mb-2">No listings found</p>
                    <p className="text-sm text-slate-400">
                      {searchQuery ? 'Try adjusting your search' : 'No listings available yet'}
                    </p>
                  </div>
                ) : (
                  filteredListings.map(l => (
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
                )}
              </div>
            )}
          </>
        )}
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

