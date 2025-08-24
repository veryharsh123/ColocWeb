import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from "lucide-react"; // lightweight icons

export default function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const [menuOpen, setMenuOpen] = useState(false); // track mobile menu
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
    return route === location.pathname;
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Find Flatmate", path: "/find" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Chats", path: "/chats" },
    { name: pageState, path: "/profile" }
  ];

  return (
    <div className='bg-black hover:bg-white hover:text-blue-950 transition ease-in-out duration-150 shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        {/* Logo */}
        <div>
          <img 
            src="https://iili.io/JGxhJIf.png" 
            alt="Coloc Logo" 
            className='lg:h-10 h-7 cursor-pointer' 
            onClick={()=>navigate("/")}
          />
        </div>

        {/* Desktop Nav */}
        <ul className='hidden md:flex space-x-10'>
          {navItems.map((item) => (
            <li 
              key={item.path}
              className={`py-3 text-lg font-light tracking-wide border-b-[2px] cursor-pointer transition 
                ${pathMatch(item.path) && "text-blue-400 border-b-blue-400"}`} 
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center space-y-6 z-50 text-white text-2xl">
          {/* Close button in overlay */}
          <button 
            className="absolute top-5 right-5"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-7 w-7" />
          </button>

          {navItems.map((item) => (
            <div
              key={item.path}
              className={`cursor-pointer transition ${
                pathMatch(item.path) && "text-blue-400"
              }`} 
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false); // close after click
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
