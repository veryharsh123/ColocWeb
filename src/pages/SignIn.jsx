import React, { useState } from 'react'
import { Link } from "react-router-dom";
import image1 from '../3854e91e-372a-4295-9a2b-e8d1190cac74-portrait.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import OAuth from '../components/OAuth';
import {signInWithEmailAndPassword, getAuth} from "firebase/auth";
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });
  const { email ,password } = formData;
  const navigate = useNavigate();
  function onChange(e){
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }));
  }
  function onClick(e){
    e.preventDefault();
    setShowPassword(!showPassword)
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if(userCredential.user){
      navigate('/');
    }
      
    } catch (error) {
      toast.error("Couldn't Sign in")
    }
  }
  return (
  <section class="Sign">
    <h1 class="text" className="text-3xl text-center mt-3 xfont-bold">Sign In</h1>
    <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-[30%] lg:w-[30%] sm:w-[40%] mb-12 md:mb-6 mt-[0.5rem]">
      <img src={image1} alt="photoProp" className="w-full"/>
      </div>
      <div className="w-full lg:w-[40%] lg:ml-20 md:ml-10">
        <form onSubmit={onSubmit}>
          <div>
          <input className="w-3/4 mx-12 rounded transition ease-in-out" placeholder="email" type="email" id="email" value={email} onChange={onChange}/>
          </div>
          <div className="relative w-3/4">
          <input className="w-full mx-12 my-4 font-extrabold rounded transition ease-in-out" placeholder="password"  type ={showPassword ? "text" : "password"} id="password" value={password} onChange={onChange} />
          {showPassword ? <FaEye className="absolute -right-9 top-[16px] text-black" onClick={onClick}/> : <FaEyeSlash className="absolute -right-9 top-[16px] text-black"  onClick={onClick}/>}
          </div>
          <div className="w-3/4 ml-10 pl-2 whitespace-nowrap flex flex-col">
            <p className="mb-1 text-sm">Don't have an account? <Link to="/SignUp" className="text-blue-300 hover:text-blue-500 transition ease-in-out">Register</Link></p> 
            <p className="text-sm"><Link to="/ForgotPassword">Forgot password</Link></p>
          </div>
          <button type='submit' className="w-1/2 ml-28 rounded mt-4 py-1 bg-blue-600 hover:bg-blue-800 transition ease-in-out">Sign In</button>
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
