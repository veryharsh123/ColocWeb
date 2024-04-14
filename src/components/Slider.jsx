import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from '../components/spinner'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination, EffectCards } from "swiper/modules";
import "swiper/css/bundle";
import { useNavigate } from 'react-router';
export default function Slider() {
const [listings, setListings] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate()
  useEffect(()=>{
    async function fetchListings(){
      const listingsRef = collection(db,"listings")
      const q = query(listingsRef, orderBy("timestamp", 'desc'), limit(5))
      const querySnap = await getDocs(q)
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  },[setLoading]);
  if(loading){
    return <Spinner/>
  }
  if(listings.length === 0){
    return <></>;
  }
  return (listings && <>
  <Swiper className='w-4/6 mt-3'
     modules={[Navigation, Pagination, Autoplay, EffectCards]}
     slidesPerView={1}
     navigation
     pagination={{ clickable: true, type: "progressbar" }}
     effect="cards"
     autoplay={{ delay: 3000 }}
   >
  {listings.map(({data,id})=> (
       <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
         <div
           className="w-full relative items-center overflow-hidden h-[400px]"
           style={{
             background: `url(${data.imgUrls[0]}) center no-repeat`,
             backgroundSize: "cover",
           }}
         ></div>
        <p className='text-white absolute left-1 top-3 font-bold max-w-[90%] bg-black rounded-md px-2 py-1 text-sm'>{data.name}</p>
       </SwiperSlide>
     ))}
   </Swiper>
    </>)
}
