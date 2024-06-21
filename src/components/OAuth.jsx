import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
export default function OAuth() {
  const navigate = useNavigate()
 async function onGoogleClick(){
try {
  const auth = getAuth();
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user;

  //checking for user yesssir
const docRef = doc(db, "users", user.uid)
const docSnap = await getDoc(docRef)
if(!docSnap.exists()){
  await setDoc(docRef, {
    fullname:user.displayName,
    email:user.email,
    timestamp:serverTimestamp(),
    id:user.uid,
  })
}
toast.success("Successfully signed in with Google")
navigate('/AdditionalInfo');
} catch (error) {
  const errorMessage = error.message;
  toast.error(errorMessage);
  console.log(errorMessage);
}
  }
  return (
   <button type="button" onClick={onGoogleClick} className="w-full flex items-center justify-center hover:text-red-500">
      <FaGoogle className='mx-2 text-2xl'/>Continue with Google
      </button>
  )
}
