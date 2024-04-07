import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination, EffectCards } from "swiper/modules";
import "swiper/css/bundle";
import { collection, deleteDoc, doc, getDoc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import Spinner from '../components/spinner';
import { MdIosShare } from "react-icons/md";
export default function Listing() {
    const param = useParams()
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
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
</main>
)}