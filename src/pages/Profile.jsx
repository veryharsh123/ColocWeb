import { getAuth } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
export default function Profile() {
  const auth  = getAuth()
  const navigate = useNavigate()
  const[formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const {name, email} = formData;
  async function onLogOut(){
    auth.signOut();
    navigate('/SignIn')
  }
  return (
   <>
   <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
    <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
    <div className="w-full md:w-[50%] mt-6 px-3 ">
      <form>
        <input type="text" id="name" value={name} disabled className=" w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
        <input type="email" id="email" value={email} disabled className=" w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>
      
      <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
        <p className="">Do you wanna <span className='text-red-300 hover:text-red-500 cursor-pointer transition ease-in-out'>Edit</span> your name?</p>
        <p onClick={onLogOut} className="text-blue-300 hover:text-blue-500 cursor-pointer transition ease-in-out">Sign out</p>
      </div>
      </form>
    </div>
   </section>
   </>
  )
}
