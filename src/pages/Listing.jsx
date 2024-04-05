import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination, EffectCards } from "swiper/modules";
import "swiper/css/bundle";
import { collection, deleteDoc, doc, getDoc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import Spinner from '../components/spinner';
export default function Listing() {
    const param = useParams()
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
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
</main>
)}