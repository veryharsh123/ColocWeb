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
      <div>
        <img src="https://iili.io/JGxhJIf.png" alt="JGxhJIf.png" border="0" className='lg:h-10 h-7 cursor-pointer' onClick={()=>navigate("/")}/>
      </div>
      <div>
       <ul className='flex space-x-10'>
        <li className={`cursor-ponter py-3  text-sm font-semibold border-b-[3px] cursor-pointer text-blue-600 ${pathMatch("/") && "border-b-blue-500 "}`} onClick={()=>navigate("/")}>Home</li>
        <li className={`cursor-ponter py-3  text-sm font-semibold border-b-[3px] cursor-pointer text-blue-600 ${pathMatch("/find") && "border-b-blue-500 "}`} onClick={()=>navigate("/find")}>Find Flatmate</li>
        <li className={`cursor-ponter py-3  text-sm font-semibold border-b-[3px] cursor-pointer text-blue-600 ${(pathMatch("/SignIn") || pathMatch("/profile"))&& "border-b-blue-500 "}`} onClick={()=>navigate("/profile")}>{pageState}</li>
        <li className={`cursor-ponter py-3  text-sm font-semibold border-b-[3px] cursor-pointer text-blue-600 ${(pathMatch("/chats"))&& "border-b-blue-500 "}`} onClick={()=>navigate("/chats")}>Chats</li>
       </ul>
        </div>
      </header>
    </div>
  )
}
