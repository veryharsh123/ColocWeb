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
console.log(Location.pathname);
function pathMatch(route){
    if(route===location.pathname){
        return true;
    }
}
  return (
    <div id="divv" className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
        <img src="https://iili.io/JGxhJIf.png" alt="JGxhJIf.png" border="0" className='h-10 cursor-pointer' onClick={()=>navigate("/")}/>
        </div>
        <div>
       <ul className='flex space-x-10'>
        <li className={`cursor-ponter py-3  text-sm font-semibold text-black border-b-[3px] cursor-pointer ${pathMatch("/") && "border-b-orange-500 text-black"}`} onClick={()=>navigate("/")}>Home</li>
        <li className={`cursor-ponter py-3  text-sm font-semibold text-black border-b-[3px] cursor-pointer ${pathMatch("/find") && "border-b-orange-500 text-black"}`} onClick={()=>navigate("/find")}>Find Flatmate</li>
        <li className={`cursor-ponter py-3  text-sm font-semibold text-black border-b-[3px] cursor-pointer ${(pathMatch("/SignIn") || pathMatch("/profile"))&& "border-b-orange-500 text-black"}`} onClick={()=>navigate("/profile")}>{pageState}</li>
       </ul>
        </div>
      </header>
    </div>
  )
}
