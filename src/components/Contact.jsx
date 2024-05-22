import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { CiLink } from "react-icons/ci";
export default function Contact({userRef, listing}) {
    const [owner, setOwner] = useState(null);
    const [message, setMessage] = useState("");
    useEffect(()=>
    {
        async function getOwner(){
            const docRef = doc(db, "users" ,userRef)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setOwner(docSnap.data())
            }else{
                toast.error("Couldn't get Owner's Info")
            }
        }
        getOwner();
    },[userRef])
    function onChange(e){
        setMessage(e.target.value)
    }
  return (
    <div>
      {owner !== null && (
        <div className=" flex flex-col w-full" id="deets">
            <p className="text-lg mb-1 flex ">Contact <Link className='text-blue-300 flex ml-1 mr-2' to={`/show/${userRef}`}>{owner.fullname}<CiLink className='flex justify-center items-center h-full text-blue-600 size-6'/></Link> for {listing.name}</p>
            <div>
                <textarea name="message" className="text-black w-full px-4 py-2 rounded transition ease-in-out duration-150"id="message" rows="2" value={message} onChange={onChange}></textarea>
            </div>
            <a href={`mailto:${owner.email}?Subject=${listing.name}&body=${message}`}><button type='button' className="px-7 py-3 bg-blue-600 text-white hover:bg-blue-800 hover:shadow-lg mt-2 w-full">Send Me</button></a>
        </div>
      )}
    </div>
  )
}
