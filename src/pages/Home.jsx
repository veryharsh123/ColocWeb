import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import ListingItem from './ListingItem';
import MarketplaceItem from './MarketplaceItem';

export default function Home() {
  // rent listings
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchRentListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRentListings();
  }, []);

  // marketplace items
  const [marketItems, setMarketItems] = useState(null);
  useEffect(() => {
    async function fetchMarketItems() {
      try {
        const marketRef = collection(db, "marketplace");
        const q = query(marketRef, orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const items = [];
        querySnap.forEach((doc) => {
          items.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setMarketItems(items);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMarketItems();
  }, []);

  return (
    <div>
      <Slider />

      {/* Rentals Section */}
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-0 font-bold">For Rent</h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition ease-in-out">
                Show more rentals
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Marketplace Section */}
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {marketItems && marketItems.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-0 font-bold">Marketplace</h2>
            <Link to="/marketplace">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition ease-in-out">
                Show more marketplace items
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {marketItems.map((item) => (
                <MarketplaceItem
                  key={item.id}
                  item={item.data}
                  id={item.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
