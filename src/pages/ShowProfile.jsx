import { collection, doc, getDoc, getDocs, orderBy, query, where, addDoc, serverTimestamp  } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spinner from '../components/spinner';
import ListingItem from './ListingItem';
import { BsChatLeftTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth} from 'firebase/auth';
export default function ShowProfile() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState(null);
  const [loading,setLoading] = useState(true);
  const auth = getAuth()
  const param = useParams();
  const navigate = useNavigate();
  console.log(param.userId);
   // Get logged-in user ID from Firebase Auth
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.uid);
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);
  useEffect(()=>
    {
        async function getUser(){
            const docRef = doc(db, "users" ,param.userId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setUser(docSnap.data())
                console.log(docSnap.data())
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


    const handleChat = async () => {
      console.log("Chatting with user:", user.id);
      console.log("Current user:", currentUserId);
      if (!currentUserId || !user?.id) {
        alert("User information is missing!");
        return;
      }
  
      try {
        // Check for existing chat
        const chatQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", currentUserId)
        );
        const querySnapshot = await getDocs(chatQuery);
  
        let chatId = null;
  
        querySnapshot.forEach((doc) => {
          const chat = doc.data();
          if (chat.participants.includes(param.userId)) {
            chatId = doc.id; // Found existing chat
          }
        });
  
        // Create new chat if it doesn't exist
        if (!chatId) {
          const chatRef = await addDoc(collection(db, "chats"), {
            participants: [currentUserId, param.userId],
            createdAt: serverTimestamp(),
          });
          chatId = chatRef.id;
        }
  
        // Navigate to chat
        navigate(`/chats/${chatId}`);
      } catch (error) {
        console.error("Error starting chat:", error);
        alert("Error starting chat. Try again later.");
      }
    };
    if(loading){
      return <Spinner/>
  }
  return (
    <>
     <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
     <div className='w-36 h-36 rounded-full overflow-hidden bg-blue-500'>
        <img src={user.Pfp} alt="" className='w-full h-full object-cover'/>
        </div>
      <h1 className="text-3xl text-center mt-6 mb-3 font-bold">{user.fullname}</h1>
      <h3 className='text-gray-400'>{user.bio}</h3>
      {currentUserId !== param.userId && (
  <button onClick={handleChat} className='w-1/2 py-2 my-3 bg-blue-600 flex justify-center items-center hover:bg-blue-800 rounded transition ease-in-out'>
    <BsChatLeftTextFill className="mr-2 text-3xl bg-black rounded-full border-2 border-blue-800 p-1" />
    Chat
  </button>
)}

      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
      {!loading && (
  <>
    {listings.length > 0 ? (
      <>
        <h2 className="text-2xl my-6 text-center font-semibold">Listings</h2>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
          {listings.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      </>
    ) : (
      <p className="text-center text-gray-500">No listings available.</p>
    )}
  </>
)}

   </div>
    </>
  )
}
