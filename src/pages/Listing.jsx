import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination, EffectCards } from "swiper/modules";
import "swiper/css/bundle";
import { doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { FaBed } from "react-icons/fa6";
import { FaBath } from "react-icons/fa6";
import Spinner from '../components/spinner';
import { MdIosShare } from "react-icons/md";
import {TileLayer, MapContainer, Marker, Popup} from "react-leaflet";
import { FaMapMarkerAlt, FaParking, FaChair } from "react-icons/fa";
import Contact from '../components/Contact';
export default function Listing() {
    const param = useParams()
    const auth = getAuth()
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactOnwer, setContactOwner] = useState(false);
    useEffect(()=>{
        async function fetchListing(){
          const docRef = doc(db, "listings", param.listingId)
          const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing();
    }, [ param.listingId])
    if(loading){
        return <Spinner/>
    }
  return( <main>
<Swiper className='w-4/6'
        modules={[Navigation, Pagination, Autoplay, EffectCards]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        effect="cards"
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full items-center overflow-hidden h-[400px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[18%] z-10 bg-black cursor-pointer border-2 border-blue-400 rounded-full w-10 h-10 flex justify-center items-center' onClick={()=>{navigator.clipboard.writeText(window.location.href); setShareLinkCopied(true); setTimeout(()=>{setShareLinkCopied(false)}, 2000)}}>
       <MdIosShare className="text-lg"/>
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[20%] right-[17%] p-2 text-blue-800 font-bold border-2 border-gray-300 rounded-md bg-gray-400 z-10">Link Copied</p>
      )}
      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg lg:space-x-5">
        <div className="w-full bg-gray-950 ">
          <p className="text-2xl font-extrabold mb-3 text-gray-300 text-nowrap">
            {listing.name} - ₹{listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " /Month" : ""}
          </p>
          <p className='flex items-center align-center mt-6 mb-3 font-semibold '>
          <FaMapMarkerAlt className='text-red-600 mr-1'/>
          {listing.address}
          </p>
          <div className="flex justify-start items-center w-[75%]">
            <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md'> {listing.type === 'rent' ? "Rent" : "Sale"}
            </p>
            </div>
          <p className='mt-3 mb-3 text-gray-400'> <span className='font-extrabold text-white'>Description</span> - {listing.description}</p>
          <ul className="flex items-center space-x-4 sm:space-x-10 text-sm font-semibold mb-6 ">
            <li className="flex items-center text-lg whitespace-nowrap">
            <FaBed className="mr-1"/>
              {+listing.bedroom > 1 ? `${listing.bedroom} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center text-lg whitespace-nowrap">
            <FaBath className="mr-1"/>
              {+listing.bathroom > 1 ? `${listing.bathroom} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center text-sm whitespace-nowrap">
            <FaParking className="mr-1"/>
              {listing.parking ? `Parking` : "Not Parking"}
            </li>
            <li className="flex items-center text-sm whitespace-nowrap">
            <FaChair className="mr-1 text-amber-600"/>
              {listing.furnished ? `Furnished` : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactOnwer && (   <div className="">
          <button onClick={()=>{setContactOwner(true)}}className=" w-3/4 px-7 py-3 bg-blue-600 text-white font-medium rounded shawdow-md hover:bg-blue-800 hover:shadow-lg">Contact Owner</button>
        </div>)}
        {contactOnwer && (<Contact userRef={listing.userRef} listing={listing}/>)}
        </div>
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
        <MapContainer center={[listing.geolocation.lat,listing.geolocation.lng]} zoom={13} scrollWheelZoom={false} style={{height:"100%", width:"100%"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[listing.geolocation.lat,listing.geolocation.lng]}>
      <Popup>
      {listing.address}
      </Popup>
    </Marker>
  </MapContainer>
        </div>
      </div>
</main>
)}