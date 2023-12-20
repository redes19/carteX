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
    let filterMaxPrice = document.getElementById('searchFilters-maxprice');
    let filterMinPrice = document.getElementById('searchFilters-minprice');
   
    // à traiter
    let filterRarity = document.querySelector("input[name='searchFilters-rarity']:checked");
  
    let filterOrder = document.getElementById('searchFilters-order');
  
    useEffect(() => {
      const fetchCards= () => {
        if(filterRarity != null){
          console.log(filterRarity.value);
        }
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
          minprice = filterMinPrice.value;
        }else{
          minprice = "0";
        }
  
        let maxprice;
        if(filterMaxPrice != null){
          maxprice = filterMaxPrice.value;
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

        url="http://localhost:3001/cards/search/"+ name +"/"+ type +"/"+ minprice +"/"+ maxprice +"/"+ rarity +"/"+ order +"/"+ terms;

        console.log(rarity)
        console.log(url);
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
