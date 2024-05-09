import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner';
import ListingItem from './ListingItem';
import { BsChatLeftTextFill } from "react-icons/bs";
export default function ShowProfile() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState(null);
  const [loading,setLoading] = useState(true);
  const param = useParams()
  console.log(param.userId);
  useEffect(()=>
    {
        async function getUser(){
            const docRef = doc(db, "users" ,param.userId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setUser(docSnap.data())
            }else{
                toast.error("Couldn't get Owner's Info")
            }
        }
        getUser();
    },[param.userId])
    useEffect(()=>{
      setLoading(true);
      async function fetchUserListings(){
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("userRef", "==", param.userId), orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc)=> {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listings);
        setLoading(false);
      }
      fetchUserListings();
    },[param.userId])
    if(loading){
      return <Spinner/>
  }
  return (
    <>
     <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center mt-6 mb-3 font-bold">{user.fullname}</h1>
      <h3 className='text-gray-400'>{user.bio}</h3>
      <button type="submit" className='w-1/2 py-2 my-3 bg-blue-600 hover:bg-blue-800 rounded transition ease-in-out'>
        <Link to={`/chat/${param.userId}`} class="flex justify-center items-center">
        <BsChatLeftTextFill className="mr-2 text-3xl bg-black rounded-full border-2 border-blue-800 p-1" />Chat
        </Link>
        </button>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
    {!loading && listings.length>0 && (
      <>
      <h2 className="text-2xl my-6 text-center font-semibold">Listings</h2>
      <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
        {listings.map((listing)=>(
          <ListingItem key={listing.id} id={listing.id} listing = {listing.data}/>
        ))}
      </ul>
      </>
    )}
   </div>
    </>
  )
}
