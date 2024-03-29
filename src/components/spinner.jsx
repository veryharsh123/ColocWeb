import React from 'react'
import spinner from "../assets/svg/spinner.svg"
export default function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <img src={spinner} alt="Loading.." className="h-24"/>
    </div>
  )
}
