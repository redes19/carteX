// Importez useState et useEffect depuis React
import React, { useState } from 'react';
import $ from 'jquery';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function App() {
    const [type, setType] = React.useState('');
    const [formIsValid, setFormIsValid] = useState(false);

    const handleChangeSelect = (event) => {
      setType(event.target.value);
    };

    const checkName = (e) => {
        $.ajax({
          url: 'http://localhost:8000/src/Back/PHP/component/addCarte.php',
            method: 'POST',
            dataType: 'json',
            data: { checkName: e.target.value },
            async: true,
            success: function(response) {
              console.log(response);
                if (response.exists) {
                  // CHANGE THE ALERT STUFF TO A MODAL ?
                    alert("Le nom de la carte existe déjà.");
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

    const checkCardId = (e) => {
      $.ajax({
        url: 'http://localhost:8000/src/Back/PHP/component/addCarte.php',
          method: 'POST',
          dataType: 'json',
          data: { checkCardId: e.target.value },
          async: true,
          success: function(response) {
            console.log(response);
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
        $.ajax({
          url: 'http://localhost:8000/src/Back/PHP/component/addCarte.php',
          method: 'POST',
          dataType: 'json',
          data: { 
            submitCard: {
              name: $('#cardCreation-form-name-input').val(),
              desc: $('#cardCreation-form-desc-input').val(),
              imageUrl: $('#cardCreation-form-imageUrl-input').val(),
              race: $('#cardCreation-form-race-input').val(),
              type: $('#cardCreation-form-type-select').val(),
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
                label="Nom de la carte"
                placeholder='Abaki, etc...'
                onChange={checkName}
                required
              />
            </div>
            
            <div className='cardCreation-form-desc'>
              <TextField
                id="cardCreation-form-desc-input"
                className='cardCreation-form-desc-input creation-input'
                name="cardCreation-form-desc-input"
                label="Description"
                multiline
                rows={6}
                placeholder='Ecrire la description de la carte ici'
                required
              />
            </div>
            
            <div className='cardCreation-form-imageUrl'>
              <TextField
                id="cardCreation-form-imageUrl-input"
                className='cardCreation-form-imageUrl-input creation-input'
                name="cardCreation-form-imageUrl-input"
                label="URL de l'image"
                placeholder="https://www.example.com/image.jpg"
                required
              />
            </div>
            
            <div  className='cardCreation-form-race'>
              <TextField
                id="cardCreation-form-race-input"
                className='cardCreation-form-race-input creation-input'
                name="cardCreation-form-race-input"
                label="Race de la carte"
                placeholder='Warrior, Dragon, etc...'
                required
              />
            </div>
            
            <div className='cardCreation-form-type'>
              <FormControl fullWidth>
                <InputLabel id="cardCreation-form-type-label">Type de la carte</InputLabel>
                <Select
                  labelId="cardCreation-form-type-label"
                  className='cardCreation-form-type-select'
                  id="cardCreation-form-type-select"
                  name="cardCreation-form-type-select"
                  value={type}
                  label="Type de la carte"
                  onChange={handleChangeSelect}
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
                  <MenuItem value={'Union_Effect'}>Union Effect</MenuItem>
                  <MenuItem value={'Spirit_Effect'}>Spirit Effect</MenuItem>
                  <MenuItem value={'Toon_Effect'}>Toon Effect</MenuItem>
                  <MenuItem value={'Gemini_Effect'}>Gemini Effect</MenuItem>
                  <MenuItem value={'Pendulum_Effect'}>Pendulum Effect</MenuItem>
                  <MenuItem value={'Token_Effect'}>Token Effect</MenuItem>
                  <MenuItem value={'Link_Effect'}>Link Effect</MenuItem>
                </Select>
              </FormControl>
            </div>
            
            <div className='cardCreation-form-cardId'>
              <TextField
                type="number"
                id="cardCreation-form-cardId-input"
                className='cardCreation-form-cardId-input creation-input'
                name="cardCreation-form-cardId-input"
                label="ID officiel de la carte"
                placeholder='10493654'
                onChange={checkCardId}
                required
              />
            </div>

            <div className='cardCreation-form-level'>
              <TextField
                type="number"
                id="cardCreation-form-level-input"
                className='cardCreation-form-level-input creation-input'
                name="cardCreation-form-level-input"
                label="Niveau de la carte"
                placeholder='Niveau'
              />
            </div>

            <div className='cardCreation-form-atk'>
              <TextField
                type="number"
                id="cardCreation-form-atk-input"
                className='cardCreation-form-atk-input creation-input'
                name="cardCreation-form-atk-input"
                label="Attaque de la carte"
                placeholder='Attaque'
              />
            </div>

            <div className='cardCreation-form-def'>
              <TextField
                type="number"
                id="cardCreation-form-def-input"
                className='cardCreation-form-def-input creation-input'
                name="cardCreation-form-def-input"
                label="Défense de la carte"
                placeholder='Défense'
              />
            </div>

            <div className='cardCreation-form-attribute'>
              <TextField
                id="cardCreation-form-attribute-input"
                className='cardCreation-form-attribute-input creation-input'
                name="cardCreation-form-attribute-input"
                label="Attribut de la carte"
                placeholder='Fire, Water, etc...'
              />
            </div>

            <div className='cardCreation-form-archetype'>
              <TextField
                id="cardCreation-form-archetype-input"
                className='cardCreation-form-archetype-input creation-input'
                name="cardCreation-form-archetype-input"
                label="Archetype de la carte"
                placeholder='A.I., Unchained, etc...'
              />
            </div>  

            <div className='cardCreation-form-amazonPrice'>
              <TextField
                type="number"
                id="cardCreation-form-amazonPrice-input"
                className='cardCreation-form-amazonPrice-input creation-input'
                name="cardCreation-form-amazonPrice-input"
                label="Prix Amazon"
                placeholder='0.87'
              />
            </div>

            <div className='cardCreation-form-cardmarketPrice'>
              <TextField
                type="number"
                id="cardCreation-form-cardmarketPrice-input"
                className='cardCreation-form-cardmarketPrice-input creation-input'
                name="cardCreation-form-cardmarketPrice-input"
                label="Prix CardMarket"
                placeholder='0.75'
              />
            </div>

            <div className='cardCreation-form-coolstuffincPrice'>
              <TextField
                type="number"
                id="cardCreation-form-coolstuffincPrice-input"
                className='cardCreation-form-coolstuffincPrice-input creation-input'
                name="cardCreation-form-coolstuffincPrice-input"
                label="Prix Cool Stuff Inc"
                placeholder='0.78'
              />
            </div>

            <div className='cardCreation-form-ebayPrice'>
              <TextField
                type="number"
                id="cardCreation-form-ebayPrice-input"
                className='cardCreation-form-ebayPrice-input creation-input'
                name="cardCreation-form-ebayPrice-input"
                label="Prix Ebay"
                placeholder='0.81'
              />
            </div>

            <div className='cardCreation-form-tcgplayerPrice'>
              <TextField
                type="number"
                id="cardCreation-form-tcgplayerPrice-input"
                className='cardCreation-form-tcgplayerPrice-input creation-input'
                name="cardCreation-form-tcgplayerPrice-input"
                label="Prix TCG Player"
                placeholder='0.92'
              />
            </div>
            <button type="submit">Ajouter la carte</button>
          </form>
        </div>
      );
    }
    
    export default App;