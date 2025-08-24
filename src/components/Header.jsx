import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const auth = getAuth();

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setPageState("Profile");
      }else{
        setPageState("Sign in");
      }
    })
  },[auth])

  const location = useLocation();
  const navigate = useNavigate();

  function pathMatch(route){
    if(route===location.pathname){
      return true;
    }
  }

  return (
    <div id="divv" className='bg-black hover:bg-white hover:text-blue-950 transition ease-in-out duration-150 shadow-sm sticky top-0 z-50'>
      <header className='navbarNav flex justify-between items-center px-3 max-w-6xl mx-auto'>
        {/* Logo */}
        <div>
          <img 
            src="https://iili.io/JGxhJIf.png" 
            alt="Coloc Logo" 
            className='lg:h-10 h-7 cursor-pointer' 
            onClick={()=>navigate("/")}
          />
        </div>

        {/* Nav Links */}
        <div>
          <ul className='flex space-x-10'>
            <li 
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
              ${pathMatch("/") && "text-blue-400 border-b-blue-400"}`} 
              onClick={()=>navigate("/")}
            >
              Home
            </li>
            <li 
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
              ${pathMatch("/find") && "text-blue-400 border-b-blue-400"}`} 
              onClick={()=>navigate("/find")}
            >
              Find Flatmate
            </li>
            <li 
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
              ${pathMatch("/marketplace") && "text-blue-400 border-b-blue-400"}`} 
              onClick={()=>navigate("/marketplace")}
            >
              Marketplace
            </li>
            <li 
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
              ${(pathMatch("/chats")) && "text-blue-400 border-b-blue-400"}`} 
              onClick={()=>navigate("/chats")}
            >
              Chats
            </li>
            <li 
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
              ${(pathMatch("/SignIn") || pathMatch("/profile")) && "text-blue-400 border-b-blue-400"}`} 
              onClick={()=>navigate("/profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  )
}
