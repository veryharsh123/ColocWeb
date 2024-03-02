import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
console.log(Location.pathname);
function pathMatch(route){
    if(route===location.pathname){
        return true;
    }
}
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
        <img src="https://iili.io/JGxhJIf.png" alt="JGxhJIf.png" border="0" className='h-10 cursor-pointer' onClick={()=>navigate("/")}/>
        </div>
        <div>
       <ul className='flex space-x-10'>
        <li className={`py-3  text-sm font-semibold text-gray-400 border-b-[3px] cursor-pointer ${pathMatch("/") && "text-black border-b-orange-500"}`} onClick={()=>navigate("/")}>Home</li>
        <li className={`py-3  text-sm font-semibold text-gray-400 border-b-[3px] cursor-pointer ${pathMatch("/Offers") && "text-black border-b-orange-500"}`} onClick={()=>navigate("/Offers")}>Offers</li>
        <li className={`py-3  text-sm font-semibold text-gray-400 border-b-[3px] cursor-pointer ${pathMatch("/SignIn") && "text-black border-b-orange-500"}`} onClick={()=>navigate("/SignIn")}>Sign In</li>
       </ul>
        </div>
      </header>
    </div>
  )
}
