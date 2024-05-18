import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { collection, query, where, getDocs,orderBy, limit, startAfter } from 'firebase/firestore'
import {db} from '../firebase'
import Spinner from '../components/spinner'
import ListingItem from './ListingItem'
import { useParams } from 'react-router'
export default function Category() {
  const[listings, setListings] = useState(null)
  const[loading, setLoading] = useState(true)
  const[lastFetchListing, setLastFetchListing] = useState(null)
  const param = useParams()
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db,'listings')
        const listingQuery = query(listingRef, where('type', '==', param.categoryName), orderBy('timestamp', 'desc'), limit(8))
        const listingSnapshot = await getDocs(listingQuery)
        const lastVisible = listingSnapshot.docs[listingSnapshot.docs.length - 1]
        setLastFetchListing(lastVisible)
        const listing = []
        listingSnapshot.forEach(doc => {
          listing.push({
            id: doc.id,
            data: doc.data()
          })
          setListings(listing)
          setLoading(false)
        })
      } catch (error) {
        toast.error('Error fetching listings', error)
      }
    }
    fetchListings();
  }, [param.categoryName]);
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db,'listings')
      const listingQuery = query(listingRef, where('type', '==', param.categoryName), orderBy('timestamp', 'desc'), limit(4), startAfter(lastFetchListing))
      const listingSnapshot = await getDocs(listingQuery)
      const lastVisible = listingSnapshot.docs[listingSnapshot.docs.length - 1]
      setLastFetchListing(lastVisible)
      const listing = []
      listingSnapshot.forEach(doc => {
        listing.push({
          id: doc.id,
          data: doc.data()
        })
        setListings((prevState)=>[...prevState, ...listing])
      })
    } catch (error) {
      toast.error('Error fetching listings', error)
    }

  }
  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center my-6 font-bold'>
        {param.categoryName === 'rent' ? 'Rentals' : 'Sales'}
      </h1>
        {loading ? (<Spinner/>) : listings && listings.length > 0 ? (
        <>
      <main>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-col-3 xl:grid-cols-4 2xl:grid-cols-5">
          {listings.map((listing) => (
           <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      </main>
      {lastFetchListing && (
        <div className="flex justify-center items-center">
          <button onClick={onFetchMoreListings} className='bg-blue-600 px-3 py-1.5 text-white mb-6 mt-6 rounded-md hover:bg-blue-800 duration-150 transition ease-in-out'>Load more</button>
        </div>)}
        </>) : (
          <p>There are no listings to display</p>
        )} 
    </div>
  )
}
