import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function SearchFilters() {
    const [alignment, setAlignment] = React.useState('DESC');
    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    const calculateValue = (value) => {
        if(value<1){
            return value;
        }else{
            return Math.round((2 **value) * Math.pow(10, 2 || 0)) / Math.pow(10, 2 || 0);            
        }
    }

    const minDistance = 0.10;
    const [value1, setValue1] = React.useState([0, 50]);
    const handleChange1 = (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }
  
      if (activeThumb === 0) {
        setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      } else {
        setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      }
    };

  return (
    <div className='searchFilters-container'>

        <ToggleButtonGroup
            id='searchFilters-order-container'
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
        >   
          <ToggleButton value="DESC">Descendant</ToggleButton>
          <ToggleButton value="ASC">Ascendant</ToggleButton>
        </ToggleButtonGroup>
        <input type="hidden" id="searchFilters-order" name="searchFilters-order" value={alignment}/>

        <div className='searchFilters-price-container searchFilters-container-box'>
            <div>Prix : </div>
            <Box sx={{ width: 240 }}>
                <Slider
                    id='searchFilters-distance'
                    getAriaLabel={() => 'Minimum distance'}
                    value={value1}
                    onChange={handleChange1}
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={9}
                    scale={calculateValue}
                    disableSwap
                />
            </Box>
            <div className="searchFilters-price-container-shop">
                <div className='searchFilters-price-shop'>
                    <input type="radio" id="searchFilters-price-shop" name="searchFilters-price-shop" value="amazonPrice" defaultChecked={true}/>
                    <label for="searchFilters-price-shop">Amazon</label>
                </div>
                <div className='searchFilters-price-shop'>
                    <input type="radio" id="searchFilters-price-shop" name="searchFilters-price-shop" value="cardmarketPrice"/>
                    <label for="searchFilters-price-shop">CardMarket</label>
                </div>
                <div className='searchFilters-price-shop'>
                    <input type="radio" id="searchFilters-price-shop" name="searchFilters-price-shop" value="coolstuffincPrice"/>
                    <label for="searchFilters-price-shop">Cool Stuff Inc</label>
                </div>
                <div className='searchFilters-price-shop'>
                    <input type="radio" id="searchFilters-price-shop" name="searchFilters-price-shop" value="ebayPrice"/>
                    <label for="searchFilters-price-shop">Ebay</label>
                </div>
                <div className='searchFilters-price-shop'>
                    <input type="radio" id="searchFilters-price-shop" name="searchFilters-price-shop" value="tcgplayerPrice"/>
                    <label for="searchFilters-price-shop">TCG Player</label>
                </div>
            </div>
        </div>

        <div className='searchFilters-type-container searchFilters-container-box'>
            <div>Type : </div>
            {/* TYPES ARE HARDCODED, AS THERE CAN BE NO MORE NO LESS THAN THOSE LISTED */}
            <div className='searchFilters-type-radio-container'>
                <div className='searchFilters-type-radio'>
                    <input type="radio" id="searchFilters-type" name="searchFilters-type" value="default" defaultChecked={true}/>
                    <label for="searchFilters-type">Tout</label>
                </div>
                <div className='searchFilters-type-radio-container-title'>Monster</div>
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

                <div className='searchFilters-type-radio-container-title'>Spell</div>
                <div className='searchFilters-type-radio'>
                    <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Spell"/>
                    <label for="searchFilters-type">Spell</label>
                </div>

                <div className='searchFilters-type-radio-container-title'>Trap</div>
                <div className='searchFilters-type-radio'>
                    <input type="radio" id="searchFilters-type" name="searchFilters-type" value="Trap"/>
                    <label for="searchFilters-type">Trap</label>
                </div>

                <div className='searchFilters-type-radio-container-title'>Special </div>
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
        </div>
    </div>
  )
}
