import React from 'react'
import '../../Style/card.css';


export default function Card( {card}) {
  return (
    <>
        <img className="card-img" src={card.imageUrl} alt="card"/>
    </>
    
  )
}
