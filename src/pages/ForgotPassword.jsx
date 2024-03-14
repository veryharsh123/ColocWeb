import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import image1 from '../3854e91e-372a-4295-9a2b-e8d1190cac74-portrait.png'
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
export default function ForgotPassword0() {
  const [ email , setEmail ] = useState("");
  const navigate = useNavigate();
  function onChange(e){
  setEmail(e.target.value);
  }
  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent")
      navigate("/SignIn");
    } catch (error) {
      toast.error("Couldn't send password-reset email")
    }
  }
  return (
  <section class="Sign">
    <h1 className="text-3xl text-center mt-3 xfont-bold">Reset Password</h1>
    <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-[30%] lg:w-[30%] sm:w-[40%] mb-12 md:mb-6 mt-[0.5rem]">
      <img src={image1} alt="photoProp" className="w-full"/>
      </div>
      <div className="w-full lg:w-[40%] lg:ml-20 md:ml-10">
        <form onSubmit={onSubmit}>
          <div>
          <input className="w-3/4 mx-12 rounded transition ease-in-out" placeholder="email" type="email" id="email" value={email} onChange={onChange}/>
          </div>
          <div className="w-3/4 ml-10 pl-2 whitespace-nowrap flex flex-col">
            <p className="mb-1 mt-2 text-sm"><Link to="/SignIn" className="text-blue-300 hover:text-blue-500 transition ease-in-out">Log In instead</Link></p> 
          </div>
          <button type='submit' className="w-1/2 ml-28 rounded mt-4 py-1 bg-blue-600 hover:bg-blue-800 transition ease-in-out">Send reset email</button>
        <div className="w-3/4 ml-12 my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
        <p className="text-center mx-2">or</p>
        </div>
        <OAuth />
        </form>
      </div>
    </div>
  </section>
  )
}
