// Importez useState et useEffect depuis React
import React, { useState } from 'react';
import axios from "axios";
import $ from 'jquery';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useParams } from 'react-router-dom';

function App() {
    const [type, setType] = useState('');
    const [formIsValid, setFormIsValid] = useState(true);
    const [card, setCard] = useState({});
    const [hasChanged, setHasChanged] = useState(false);

    const handleChangeSelect = (event) => {
      setType(event.target.value);
    };

    const { id } = useParams();

    const checkCard = () => {
        let url = "http://localhost:3001/cards/"+id;
        axios.get(url)
        .then(res => {
            if(hasChanged == false){
                let tempType = res.data[0].type.replaceAll(" ", "_");
                setType(tempType);
                setHasChanged(true);
            }
            setCard(res.data[0]);
        })
        .catch(err => {
            console.log(err);
        })
    }
    checkCard();

    const checkCardId = (e) => {
    $.ajax({
        url: 'http://localhost:8000/src/Back/PHP/component/addCarte.php',
          method: 'POST',
          dataType: 'json',
          data: { checkCardId: e.target.value },
          async: true,
          success: function(response) {
              if (response.exists) {
                // CHANGE THE ALERT STUFF TO A MODAL ?
                  alert("L'ID officiel de la carte existe déjà.");
                  setFormIsValid(false);
              }else{
                setFormIsValid(true);
              }
          },
          error: function(error) {
              console.error(error);
          }
      });
  };

    const handleAddCard = () => {
        if(formIsValid){
            let tempType = document.getElementById('cardCreation-form-type-select').parentNode.childNodes[1].value.replaceAll("_", " ");
        $.ajax({
          url: 'http://localhost:8000/src/Back/PHP/component/modifyCard.php',
          method: 'POST',
          dataType: 'json',
          data: { 
            modifyCard: {
              id: id,
              name: $('#cardCreation-form-name-input').val(),
              desc: $('#cardCreation-form-desc-input').val(),
              imageUrl: $('#cardCreation-form-imageUrl-input').val(),
              race: $('#cardCreation-form-race-input').val(),
              type: tempType,
              cardId: $('#cardCreation-form-cardId-input').val(),
              level: $('#cardCreation-form-level-input').val(),
              atk: $('#cardCreation-form-atk-input').val(),
              def: $('#cardCreation-form-def-input').val(),
              attribute: $('#cardCreation-form-attribute-input').val(),
              archetype: $('#cardCreation-form-archetype-input').val(),
              amazonPrice: $('#cardCreation-form-amazonPrice-input').val(),
              cardmarketPrice: $('#cardCreation-form-cardmarketPrice-input').val(),
              coolstuffincPrice: $('#cardCreation-form-coolstuffincPrice-input').val(),
              ebayPrice: $('#cardCreation-form-ebayPrice-input').val(),
              tcgplayerPrice: $('#cardCreation-form-tcgplayerPrice-input').val()
            }
          },
          success: function (response) {
            console.log(response)
            window.location.href = "http://localhost:3000/";
          },
          error: function (error) {
              console.error(error);
          },
        });
      }else{
        alert("Veuillez remplir correctement les champs.");
      }
    };
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // CHECK IF CARD ALREADY EXIST 
        handleAddCard();
    };


      return (
        <div className="cardCreation">
          <h1>Ajouter une carte</h1>
          <form className='cardCreation-form' onSubmit={handleSubmit}>

            <div className='cardCreation-form-name'>
              <TextField 

                id="cardCreation-form-name-input"
                className='cardCreation-form-name-input creation-input'
                name="cardCreation-form-name-input"
                placeholder='Abaki, etc...'
                fullWidth
                defaultValue={card.name}
                required
                multiline
                disabled
              />
            </div>
            
            <div className='cardCreation-form-desc'>
              <TextField
                id="cardCreation-form-desc-input"
                className='cardCreation-form-desc-input creation-input'
                name="cardCreation-form-desc-input"
                multiline
                rows={6}
                fullWidth
                placeholder='Ecrire la description de la carte ici'
                defaultValue={card.desc}
                required
              />
            </div>
            
            <div className='cardCreation-form-imageUrl'>
              <TextField
                fullWidth
                id="cardCreation-form-imageUrl-input"
                className='cardCreation-form-imageUrl-input creation-input'
                name="cardCreation-form-imageUrl-input"
                defaultValue={card.imageUrl}
                multiline
                required
              />
            </div>
            
            <div  className='cardCreation-form-race'>
              <TextField
                id="cardCreation-form-race-input"
                className='cardCreation-form-race-input creation-input'
                name="cardCreation-form-race-input"
                placeholder='Warrior, Dragon, etc...'
                defaultValue={card.race}
                fullWidth
                multiline
                required
              />
            </div>
            
            <div className='cardCreation-form-type'>
              <FormControl fullWidth>
                <Select
                  className='cardCreation-form-type-select'
                  id="cardCreation-form-type-select"
                  name="cardCreation-form-type-select"
                  value={type}
                  onChange={handleChangeSelect}
                  fullWidth
                  required
                >
                  <MenuItem value={'Normal_Monster'}>Normal Monster</MenuItem>
                  <MenuItem value={'Effect_Monster'}>Effect Monster</MenuItem>
                  <MenuItem value={'Fusion_Monster'}>Fusion Monster</MenuItem>
                  <MenuItem value={'Ritual_Monster'}>Ritual Monster</MenuItem>
                  <MenuItem value={'Synchro_Monster'}>Synchro Monster</MenuItem>
                  <MenuItem value={'Xyz_Monster'}>Xyz Monster</MenuItem>
                  <MenuItem value={'Spell'}>Spell</MenuItem>
                  <MenuItem value={'Trap'}>Trap</MenuItem>
                  <MenuItem value={'Union_Effect_Monster'}>Union Effect</MenuItem>
                  <MenuItem value={'Spirit_Effect_Monster'}>Spirit Effect</MenuItem>
                  <MenuItem value={'Toon_Effect_Monster'}>Toon Effect</MenuItem>
                  <MenuItem value={'Gemini_Effect_Monster'}>Gemini Effect</MenuItem>
                  <MenuItem value={'Pendulum_Effect_Monster'}>Pendulum Effect</MenuItem>
                  <MenuItem value={'Token_Effect_Monster'}>Token Effect</MenuItem>
                  <MenuItem value={'Link_Effect_Monster'}>Link Effect</MenuItem>
                </Select>
              </FormControl>
            </div>
            
            <div className='cardCreation-form-cardId'>
              <TextField
                type="number"
                id="cardCreation-form-cardId-input"
                className='cardCreation-form-cardId-input creation-input'
                name="cardCreation-form-cardId-input"
                placeholder='10493654'
                onChange={checkCardId}
                defaultValue={card.cardId}
                fullWidth
                required
                multiline
              />
            </div>

            <div className='cardCreation-form-level'>
              <TextField
                type="number"
                id="cardCreation-form-level-input"
                className='cardCreation-form-level-input creation-input'
                name="cardCreation-form-level-input"
                placeholder='Niveau'
                defaultValue={card.level}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-atk'>
              <TextField
                type="number"
                id="cardCreation-form-atk-input"
                className='cardCreation-form-atk-input creation-input'
                name="cardCreation-form-atk-input"
                placeholder='Attaque'
                defaultValue={card.atk}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-def'>
              <TextField
                type="number"
                id="cardCreation-form-def-input"
                className='cardCreation-form-def-input creation-input'
                name="cardCreation-form-def-input"
                placeholder='Défense'
                defaultValue={card.def}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-attribute'>
              <TextField
                id="cardCreation-form-attribute-input"
                className='cardCreation-form-attribute-input creation-input'
                name="cardCreation-form-attribute-input"
                placeholder='Fire, Water, etc...'
                defaultValue={card.attribute}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-archetype'>
              <TextField
                id="cardCreation-form-archetype-input"
                className='cardCreation-form-archetype-input creation-input'
                name="cardCreation-form-archetype-input"
                placeholder='A.I., Unchained, etc...'
                defaultValue={card.archetype}
                fullWidth
                multiline
              />
            </div>  

            <div className='cardCreation-form-amazonPrice'>
              <TextField
                type="number"
                id="cardCreation-form-amazonPrice-input"
                className='cardCreation-form-amazonPrice-input creation-input'
                name="cardCreation-form-amazonPrice-input"
                placeholder='0.87'
                defaultValue={card.amazonPrice}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-cardmarketPrice'>
              <TextField
                type="number"
                id="cardCreation-form-cardmarketPrice-input"
                className='cardCreation-form-cardmarketPrice-input creation-input'
                name="cardCreation-form-cardmarketPrice-input"
                placeholder='0.75'
                defaultValue={card.cardmarketPrice}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-coolstuffincPrice'>
              <TextField
                type="number"
                id="cardCreation-form-coolstuffincPrice-input"
                className='cardCreation-form-coolstuffincPrice-input creation-input'
                name="cardCreation-form-coolstuffincPrice-input"
                placeholder='0.78'
                defaultValue={card.coolstuffincPrice}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-ebayPrice'>
              <TextField
                type="number"
                id="cardCreation-form-ebayPrice-input"
                className='cardCreation-form-ebayPrice-input creation-input'
                name="cardCreation-form-ebayPrice-input"
                placeholder='0.81'
                defaultValue={card.ebayPrice}
                fullWidth
                multiline
              />
            </div>

            <div className='cardCreation-form-tcgplayerPrice'>
              <TextField
                type="number"
                id="cardCreation-form-tcgplayerPrice-input"
                className='cardCreation-form-tcgplayerPrice-input creation-input'
                name="cardCreation-form-tcgplayerPrice-input"
                placeholder='0.92'
                defaultValue={card.tcgplayerPrice}
                fullWidth
                multiline
              />
            </div>
            <button type="submit">Modifier la carte</button>
          </form>
        </div>
      );
    }
    
    export default App;