import { getAuth, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { IoMdHome } from "react-icons/io";
import { Link } from 'react-router-dom';
import ListingItem from './ListingItem';
export default function Profile() {
  const auth  = getAuth()
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false)
  const[formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const {name, email} = formData;
  async function onLogOut(){
    auth.signOut();
    navigate('/SignIn')
  }
  function onChange(e){
  setFormData((prevState)=>({
    ...prevState, 
    [e.target.id]:e.target.value,
  }))
  }
  async function onSubmit(){
    if(auth.currentUser.displayName!==name){
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
  const docRef = doc(db,"users", auth.currentUser.uid)
  await updateDoc(docRef, {
    fullname: name,
  })
  }
  toast.success("Updated")
  }
  useEffect(()=>{
    async function fetchUserListings(){
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
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
  },[auth.currentUser.uid])
  return (
   <>
   <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
    <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
    <div className="w-full md:w-[50%] mt-6 px-3 ">
      <div className="flex justify-center my-3">
    </div>
      <form>
        <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange} className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${ changeDetail && "bg-red focus:bg-red-200}"}`}/>
        <input type="email" id="email" value={email} disabled className=" w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
      <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
        <p className="">Do you wanna <span onClick={()=>{
          changeDetail && onSubmit()
          setChangeDetail((prevState)=> !prevState)
        }} className='text-red-300 hover:text-red-500 cursor-pointer transition ease-in-out' >{ changeDetail ? "Apply Changes?" : "Edit?"} </span></p>
        <p onClick={onLogOut} className="text-blue-300 hover:text-blue-500 cursor-pointer transition ease-in-out">Sign out</p>
      </div>
      </form>
      <button type="submit" className='w-full py-2 bg-blue-600 hover:bg-blue-800 rounded transition ease-in-out'>
        <Link to="/create-listing" class="flex justify-center items-center">
        <IoMdHome className="mr-2 text-3xl bg-black rounded-full border-2 border-blue-800 p-1" />Put your flat up for display
        </Link>
        </button>
    </div>
   </section>
   <div className="max-w-6xl px-3 mt-6 mx-auto">
    {!loading && listings.length>0 && (
      <>
      <h2 className="text-2xl my-6 text-center font-semibold">My Listings</h2>
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
