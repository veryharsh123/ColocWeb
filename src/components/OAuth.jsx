import React from 'react'
import { FaGoogle } from "react-icons/fa";

export default function OAuth() {
  return (
   <button className="w-full flex items-center justify-center hover:text-red-500">
      <FaGoogle className='mx-2 text-2xl'/>Continue with Google
      </button>
  )
}
