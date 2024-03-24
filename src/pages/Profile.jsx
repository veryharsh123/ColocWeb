import { getAuth, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { db } from '../firebase';
import { toast } from 'react-toastify';
export default function Profile() {
  const auth  = getAuth()
  const navigate = useNavigate();
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
    </div>
   </section>
   </>
  )
}
