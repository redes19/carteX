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

        <div>Type : </div>
        <div className='searchFilters-type-container'>
            {/* TYPES ARE HARDCODED, AS THERE CAN BE NO MORE NO LESS THAN THOSE LISTED */}
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="default" defaultChecked={true}/>
                <label for="searchFilters-type">Tout</label>
            </div>
            <div>Monster</div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Normal_Monster"/>
                <label for="searchFilters-type">Normal Monster</label>
            </div> 
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Effect_Monster"/>
                <label for="searchFilters-type">Effect Monster</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Fusion_Monster"/>
                <label for="searchFilters-type">Fusion Monster</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Ritual_Monster"/>
                <label for="searchFilters-type">Ritual Monster</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Synchro_Monster"/>
                <label for="searchFilters-type">Synchro Monster</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Xyz_Monster"/>
                <label for="searchFilters-type">Xyz Monster</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Link_Monster"/>
                <label for="searchFilters-type">Link Monster</label>
            </div>

            <div>Spell</div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Spell"/>
                <label for="searchFilters-type">Spell</label>
            </div>

            <div>Trap</div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Trap"/>
                <label for="searchFilters-type">Trap</label>
            </div>

            <div>Special </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Union_Effect"/>
                <label for="searchFilters-type">Union Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Spirit_Effect"/>
                <label for="searchFilters-type">Spirit Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Toon_Effect"/>
                <label for="searchFilters-type">Toon Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Gemini_Effect"/>
                <label for="searchFilters-type">Gemini Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Pendulum_Effect"/>
                <label for="searchFilters-type">Pendulum Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Token_Effect"/>
                <label for="searchFilters-type">Token Effect</label>
            </div>
            <div className='searchFilters-type-radio'>
                <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Link_Effect"/>
                <label for="searchFilters-type">Link Effect</label>
            </div>
        </div>

        <div>Prix : </div>
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

        {/* RARITY IS HARDCODED, AS THERE CAN BE NO MORE NO LESS THAN THOSE LISTED */}
        {/* <div>Rareté : </div>
        <div className='searchFilters-rarity-container'>
            <div className='searchFilters-rarity-radio'>
                <input type="radio" id="searchFilters-rarity" name="searchFilters-rarity" value="default" defaultChecked={true}/>
                <label for="searchFilters-rarity">Tout</label>
            </div>
            <div className='searchFilters-rarity-radio'>
                <input type="radio" id="searchFilters-rarity" name="searchFilters-rarity" value="Rarity_1"/>
                <label for="searchFilters-rarity">Rarity 1</label>
            </div>
            <div className='searchFilters-rarity-radio'>
                <input type="radio" id="searchFilters-rarity" name="searchFilters-rarity" value="Rarity_2"/>
                <label for="searchFilters-rarity">Rarity 2</label>
            </div>
            <div className='searchFilters-rarity-radio'>
                <input type="radio" id="searchFilters-rarity" name="searchFilters-rarity" value="Rarity_3"/>
                <label for="searchFilters-rarity">Rarity 3</label>
            </div>
            <div className='searchFilters-rarity-radio'>
                <input type="radio" id="searchFilters-rarity" name="searchFilters-rarity" value="Rarity_4"/>
                <label for="searchFilters-rarity">Rarity 4</label>
            </div>
        </div> */}

        <div className='searchFilters-order-container'>
            <label for="searchFilters-order">Ordre</label>
            <select name="searchFilters-order" id="searchFilters-order">
                <option value="DESC">Descendant</option>
                <option value="ASC">Ascendant</option>
            </select>
        </div>

    </div>
  )
}
