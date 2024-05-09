import React from 'react'
import { useParams } from 'react-router'

export default function Chat() {
    const param = useParams();

  return (
    <div>
   <h1>{param.userId}</h1>
    </div>
  )
}
