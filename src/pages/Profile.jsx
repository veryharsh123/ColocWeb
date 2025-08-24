import { getAuth, updateProfile } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { IoMdHome } from "react-icons/io";
import { FaStore } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ListingItem from './ListingItem';
import MarketplaceItem from './MarketplaceItem'; // <-- new component like ListingItem but for products
import Modal from 'react-modal';
import { HiCamera } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function Profile() {
  const auth  = getAuth()
  const navigate = useNavigate();

  const [dp, setDp] = useState(null);
  const [listings, setListings] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]); // marketplace products
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [changeDetail, setChangeDetail] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email:'',
    bio:''
  })
  const {name, email, bio} = formData;

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

  function addDisplayPicture(e){
    const file = e.target.files[0];
    if(file){
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(()=>{
    if(selectedFile){
      uploadImageToStorage()
    }
  },[selectedFile, ])

  async function uploadImageToStorage(){
    setImageFileUploading(true);
    const fileName = new Date().getTime()+ '-' + selectedFile.name;
    const storage = getStorage()
    const storageRef = ref(storage, `pfp/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef,selectedFile);

    uploadTask.on('state_changed',
      (snapshot) => {},
      (error) => {
        console.error(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false)
        });
      }
    )
  }

  // Fetch user info
  useEffect(()=>{
    async function fetchUser(){
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setFormData({
          email:userDoc.data().email,
          name:userDoc.data().fullname,
          bio:userDoc.data().bio
        })
      }
    }
    fetchUser();
  },[auth.currentUser.uid])

  async function onSubmit(){
    if(auth.currentUser.displayName!==name){
      await updateProfile(auth.currentUser, { displayName: name })
      const docRef = doc(db,"users", auth.currentUser.uid)
      await updateDoc(docRef, {
        fullname: name,
        bio: bio,
      })
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    if(userDoc.data().bio!==bio){
      await updateDoc(userRef, { bio: bio })
    }
    toast.success("Updated")
  }

  async function handleSubmit(){
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef,{ Pfp: imageFileUrl })
    setDp(imageFileUrl);
    toast.success("Uploaded")
    setIsOpen(false)
  }

  // Fetch flat listings
  useEffect(()=>{
    async function fetchUserListings(){
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc)=> {
        return listings.push({ id: doc.id, data: doc.data() })
      })
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  },[auth.currentUser.uid])

  // Fetch marketplace listings
  useEffect(()=>{
    async function fetchMarketplaceListings(){
      const marketplaceRef = collection(db, "marketplace");
      const q = query(marketplaceRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let items = [];
      querySnap.forEach((doc)=> {
        return items.push({ id: doc.id, data: doc.data() })
      })
      setMarketplaceListings(items);
    }
    fetchMarketplaceListings();
  },[auth.currentUser.uid])

  // Delete handlers
  async function onDelete(listingId, collectionName){
    if(window.confirm("Are you sure you want to delete?")){
      await deleteDoc(doc(db, collectionName, listingId))
      if(collectionName==="listings"){
        setListings((prev)=> prev.filter((l)=> l.id !== listingId))
      } else {
        setMarketplaceListings((prev)=> prev.filter((i)=> i.id !== listingId))
      }
      toast.success("Deleted.")
    }
  }

  function onEdit(listingId, collectionName){
    navigate(`/edit-${collectionName}/${listingId}`)
  }

  return (
   <>
   <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
    <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
    <div className="w-full md:w-[50%] mt-6 px-3 ">
      {/* Profile Picture */}
      <div className="flex justify-center my-3">
        <div className='w-36 h-36 rounded-full overflow-hidden bg-blue-500' onClick={()=> setIsOpen(true)}>
          <img src={dp} alt="" className='w-full h-full object-cover'/>
        </div>
      </div>

      {/* Profile Form */}
      <form>
        <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange} className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
        <input type="text" id="bio" value={bio} placeholder="bio" disabled={!changeDetail} onChange={onChange} className="w-full px-4 py-3 mb-6 text-sm text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
        <input type="email" id="email" value={email} disabled className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
        
        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
          <p className="">Do you wanna <span onClick={()=>{
            changeDetail && onSubmit()
            setChangeDetail((prevState)=> !prevState)
          }} className='text-red-300 hover:text-red-500 cursor-pointer transition ease-in-out' >
            { changeDetail ? "Apply Changes?" : "Edit?"}
          </span></p>
          <p onClick={onLogOut} className="text-blue-300 hover:text-blue-500 cursor-pointer transition ease-in-out">Sign out</p>
        </div>
      </form>

      {/* Buttons */}
      <div className="space-y-3">
        <button type="button" className='w-full py-2 bg-blue-600 hover:bg-blue-800 rounded transition ease-in-out'>
          <Link to="/create-listing" className="flex justify-center items-center">
            <IoMdHome className="mr-2 text-3xl bg-black rounded-full border-2 border-blue-800 p-1" />
            Put your flat up for display
          </Link>
        </button>

        <button type="button" className='w-full py-2 bg-green-600 hover:bg-green-800 rounded transition ease-in-out'>
          <Link to="/create-marketplacelisting" className="flex justify-center items-center">
            <FaStore className="mr-2 text-3xl bg-black rounded-full border-2 border-green-800 p-1" />
            Sell a product on Marketplace
          </Link>
        </button>
      </div>
    </div>
   </section>

   {/* Listings Section */}
   <div className="max-w-6xl px-3 mt-6 mx-auto">
    {/* Flats */}
    {!loading && listings.length>0 && (
      <>
      <h2 className="text-2xl my-6 text-center font-semibold">My Flat Listings</h2>
      <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
        {listings.map((listing)=>(
          <ListingItem key={listing.id} id={listing.id} listing = {listing.data} onDelete={()=>onDelete(listing.id,"listings")} onEdit={()=>onEdit(listing.id,"listings")}/>
        ))}
      </ul>
      </>
    )}

    {/* Marketplace */}
    {!loading && marketplaceListings.length>0 && (
      <>
      <h2 className="text-2xl my-6 text-center font-semibold">My Marketplace Items</h2>
      <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
        {marketplaceListings.map((item)=>(
          <MarketplaceItem key={item.id} id={item.id} item={item.data} onDelete={()=>onDelete(item.id,"marketplace")} onEdit={()=>onEdit(item.id,"marketplace")}/>
        ))}
      </ul>
      </>
    )}
   </div>

   {/* Modal for profile picture */}
   {isOpen && (
    <Modal isOpen={isOpen} className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] text-blue-600 bg-white border-2 rounded-md' onRequestClose={()=>setIsOpen(false)} ariaHideApp={false}>
      <div className='flex flex-col justify-center items-center h-[100%]'>
        {selectedFile ? (
          <img src={imageFileUrl} alt='selected file' onClick={()=> filePickerRef.current.click()} className={`w-full max-h-[250px] object-cover cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`}/>
        ) : (
          <HiCamera onClick={()=> filePickerRef.current.click()} className='text-3xl text-gray-400 cursor-pointer'/>
        )}
        <input hidden ref={filePickerRef} type="file" accept='image/*' onChange={addDisplayPicture} />
      </div>
      <button onClick={handleSubmit} className='w-full bg-blue-600 text-white p-2 shadow-md rounded-lg my-3'>Upload Profile Picture</button>
      <AiOutlineClose className='cursor-pointer absolute top-2 right-2 hover:text-red-200 duration-300' onClick={()=> setIsOpen(false)}/>
    </Modal>
   )}
   </>
  )
}
