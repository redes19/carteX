import React, { useEffect, useState } from 'react'
import Card from './Card';
import SearchFilters from './SearchFilters';
import axios from 'axios';

import '../../Style/menu.css';


export default function Menu() {
    const [cardList, setCardList] = useState([{}]);
    
    let url;
    
    // FILTERS 
    let filterName = document.getElementById('searchFilters-name');
    let filterType = document.querySelector("input[name='searchFilters-type']:checked");
    
    // à traiter
    let filterRarity = document.querySelector("input[name='searchFilters-rarity']:checked");
  
    let filterOrder = document.getElementById('searchFilters-order');
  
    useEffect(() => {
      const fetchCards= () => {
        let filterMaxPrice = (document.getElementById('searchFilters-distance').childNodes[2].childNodes[0].value < 1) ? document.getElementById('searchFilters-distance').childNodes[2].childNodes[0].value :  Math.round((2 **document.getElementById('searchFilters-distance').childNodes[2].childNodes[0].value) * Math.pow(10, 2 || 0)) / Math.pow(10, 2 || 0);
        let filterMinPrice = (document.getElementById('searchFilters-distance').childNodes[3].childNodes[0].value < 1) ? document.getElementById('searchFilters-distance').childNodes[3].childNodes[0].value :  Math.round((2 **document.getElementById('searchFilters-distance').childNodes[3].childNodes[0].value) * Math.pow(10, 2 || 0)) / Math.pow(10, 2 || 0);
        let shop = document.querySelector("input[name='searchFilters-price-shop']:checked").value;
        let terms;
        let searchBar = document.getElementById('searchBar');
        if(searchBar != null && searchBar.value != ""){
          terms = searchBar.value;
        }else{
          terms = "nosearch";
        }
  
        let name;
        if(filterName != null){
          name = filterName.checked;
        }else{
          name = "false";
        }
  
        let type;
        if(filterType != null){
          type = filterType.value;
        }else{
          type = "default";
        }
  
        let minprice;
        if(filterMinPrice != null){
          minprice = filterMinPrice;
        }else{
          minprice = "0";
        }
  
        let maxprice;
        if(filterMaxPrice != null){
          maxprice = filterMaxPrice;
        }else{
          maxprice = "10000";
        }
  
        let rarity;
        if(filterRarity != null){
          rarity = filterRarity.value;
        }else{
          rarity = "default";
        }
  
        let order;
        if(filterOrder != null){
          order = filterOrder.value;
        }else{
          order = "desc";
        }

        url="http://localhost:3001/cards/search/"+ name +"/"+ type +"/"+ minprice +"/"+ maxprice +"/" + shop + "/" + rarity +"/"+ order +"/"+ terms;
        axios.get(url)
          .then(res => {
            setCardList(res.data);
          })
          .catch(err => console.error(err));
      };
      fetchCards();
      }, [cardList]);


  return (
    <>
    <div className="mainPage">
      <SearchFilters/>
      <div className="mainPage-container">
        <div className="mainPage-container-header">
          {/* HERE BE TITLE OF PAGE : résultat de la recherche/liste de cartes */}
        </div>
        <div className="cardsList">
          {/* HERE BE CARDS */}
          {cardList.map( (card,i) =>
            <div className='cardsList-card'>
                <Card card={card}/>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
