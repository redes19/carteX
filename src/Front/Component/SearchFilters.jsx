import React from 'react'

export default function SearchFilters() {

    // CHECK IF MAX PRICE IS SUPERIOR TO MIN PRICE and CHECK IF MIN PRICE IS INFERIOR TO MAX PRICE
    let filterMaxPrice = document.getElementById('searchFilters-maxprice');
    let filterMinPrice = document.getElementById('searchFilters-minprice');
    // if(filterMaxPrice != null && filterMinPrice != null && (filterMaxPrice.value < filterMinPrice.value)){
    //     filterMaxPrice.value = document.getElementById('searchFilters-minprice').value;
    // }else if(filterMaxPrice != null && filterMinPrice != null && (filterMaxPrice.value == filterMinPrice.value)){
    //     filterMaxPrice.value = parseInt(document.getElementById('searchFilters-minprice').value)+1;
    // }
    // if(filterMaxPrice != null && filterMinPrice != null){
    //     filterMaxPrice.addEventListener('change', () => {
    //         if(filterMaxPrice.value < filterMinPrice.value){
    //             filterMaxPrice.value = filterMinPrice.value;
    //         }
    //     });
    //     filterMinPrice.addEventListener('change', () => {
    //         if(filterMinPrice.value > filterMaxPrice.value){
    //             filterMinPrice.value = filterMaxPrice.value;
    //         }
    //     });
    // }
    
  return (
    <div className='searchFilters-container'>

        <div className='searchFilters-name-container'>
            <label for="searchFilters-name">Chercher par nom uniquement</label>
            <input type="checkbox" id="searchFilters-name" name="searchFilters-name" value="searchFilters-name"/>
        </div>

        <div className='searchFilters-type-container'>
            {/* TYPES ARE HARDCODED, AS THERE CAN BE NO MORE NO LESS THAN THOSE LISTED */}
            <label for="searchFilters-type">Type</label>
            <select name="searchFilters-type" id="searchFilters-type">
                <option value="default">Aucun filtre</option>
                <option value="searchFilters-type">searchFilters-type</option>
                <option value="searchFilters-type">searchFilters-type</option>
                <option value="searchFilters-type">searchFilters-type</option>
            </select>
        </div>

        <div className='searchFilters-price'>
            <div className='searchFilters-minprice-container'>
                <label for="searchFilters-minprice">Prix min</label>
                <input type="number" id="searchFilters-minprice" name="searchFilters-minprice" min="0" max="10000" defaultValue="0"/>
            </div>
            <div className='searchFilters-maxprice-container'>
                <label for="searchFilters-maxprice">Prix max</label>
                <input type="number" id="searchFilters-maxprice" name="searchFilters-maxprice" min="0" max="10000" defaultValue="10000"/>
            </div>
        </div>

        <div className='searchFilters-rarity-container'>
            {/* RARITY IS HARDCODED, AS THERE CAN BE NO MORE NO LESS THAN THOSE LISTED */}
            <label for="searchFilters-rarity">Rareté</label>
            <select name="searchFilters-rarity" id="searchFilters-rarity">
                <option value="default">Aucun filtre</option>
                <option value="searchFilters-rarity">searchFilters-rarity1</option>
                <option value="searchFilters-rarity">searchFilters-rarity2</option>
                <option value="searchFilters-rarity">searchFilters-rarity3</option>
            </select>
        </div>

        <div className='searchFilters-order-container'>
            <label for="searchFilters-order">Ordre</label>
            <select name="searchFilters-order" id="searchFilters-order">
                <option value="desc">Descendant</option>
                <option value="asc">Ascendant</option>
            </select>
        </div>

    </div>
  )
}
