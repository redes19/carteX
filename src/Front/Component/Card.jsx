import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../Component/CartProvider';

export default function Card( {card}) {
  const [isHovered, setIsHovered] = useState(false);
  const [pageCount, setPageCount] = useState(1);

    const handleMouseOverImg = (e) => {
      setIsHovered(true);
    }
    const handleMouseOutImg = (e) => {
      setIsHovered(false);
    }

    const { addToCart } = useCart();

  return (
    <>
        <div className='cardsList-card' onMouseOver={handleMouseOverImg} onMouseOut={handleMouseOutImg}>
            <img className="card-img" src={card.imageUrl} alt="card"/>
            {isHovered && (
              <div className="card-hover" >
                <div className="card-hover-text-title">
                      {card.name}
                  </div>
                  {pageCount == 1 && (
                    <div className="card-hover-text-content" style={{fontSize:10+'px'}}>
                      <div className='card-hover-text-content-text'>{card.desc}</div>
                      {card.atk != null && (
                        <div className='card-hover-text-content-text'>Attaque: {card.atk}</div>
                      )}
                      {card.def != null && (
                        <div className='card-hover-text-content-text'>Défense: {card.def}</div>
                      )}

                    </div>
                  )}

                  {pageCount == 2 && (
                    <div className="card-hover-text-content" style={{fontSize:10+'px'}}>
                      {card.race != null && (
                        <div className='card-hover-text-content-text'>Race: {card.race}</div>
                      )}
                      {card.race == null && (
                        <div className='card-hover-text-content-text'>Race: -</div>
                      )}

                      {card.type != null && (
                        <div className='card-hover-text-content-text'>Type: {card.type}</div>
                      )}
                      {card.type == null && (
                        <div className='card-hover-text-content-text'>Type: -</div>
                      )}
                      
                      {card.attribut != null && (
                        <div className='card-hover-text-content-text'>Attribut: {card.attribut}</div>
                      )}
                      {card.attribut == null && (
                        <div className='card-hover-text-content-text'>Attribut: -</div>
                      )}
                      
                      {card.level != null && (
                        <div className='card-hover-text-content-text'>Niveau: {card.level}</div>
                      )}
                      {card.level == null && (
                        <div className='card-hover-text-content-text'>Niveau: -</div>
                      )}
                    </div>
                  )}
                  {pageCount == 3 && (
                    <div className="card-hover-text-content" style={{fontSize:10+'px'}}>
                      <div className='card-hover-text-content-text'>Prix Amazon : {card.amazonPrice}</div>
                      <div className='card-hover-text-content-text'>Prix CardMarket: {card.cardmarketPrice}</div>
                      <div className='card-hover-text-content-text'>Prix Cool Stuff Inc: {card.coolstuffincPrice}</div>
                      <div className='card-hover-text-content-text'>Prix Ebay: {card.ebayPrice}</div>
                      <div className='card-hover-text-content-text'>Prix TCG Player: {card.tcgplayerPrice}</div>
                      <IconButton color="primary" onClick={() => addToCart(card.id, card.amazonPrice, card.cardmarketPrice, card.coolstuffincPrice, card.ebayPrice, card.tcgplayerPrice)}>
                        <ShoppingCartIcon />
                      </IconButton>

                    </div>
                  )}
                  
                  <div className='card-hover-text-pageCount'>
                    {pageCount > 1 && (
                      <Button variant="text" onClick={() => setPageCount(pageCount - 1)}> Précedent </Button>
                    )}
                    {pageCount < 3 && (
                      <Button variant="text" onClick={() => setPageCount(pageCount + 1)}> Suivant </Button>
                    )}  
                  </div>


              </div>
            )}
        </div>
    </>
    
  )
}
