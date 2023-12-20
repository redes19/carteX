// Importez useState et useEffect depuis React
import React, { useState } from 'react';
import $ from 'jquery';


function App() {
    const [formData, setFormData] = useState({
      name: '',
      desc: '',
      imageUrl: '',
      race: '',
      type: '',
      cardId: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData, 
          [name]: value,
        });
    };

    const handleCheckCard = () => {
        // IS THE CARD ALREADY IN THE DATABASE ?
        console.log(formData)
        $.ajax({
            url: 'http://localhost:8000/src/Back/PHP/Component/CheckCarte.php',
            method: 'POST',
            dataType: 'json',
            data: { cardName: formData.name },
            async: true,
            success: function(response) {
              console.log(response);
                if (response.exists) {
                    alert("La carte existe déjà.");
                } else {    
                    // La carte n'existe pas, procéder à l'ajout
                    handleAddCard();
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };
    
    const handleAddCard = () => {
        $.ajax({
            url: 'http://localhost:8000/src/Back/PHP/Component/addCarte.php', 
            method: 'POST',
            dataType: 'json',
            data: formData,
            success: function(response) {
              // CARD ADDED, SHOW ALERT AND REDIRECT
                console.log(response);      
            },
            error: function(error) {
                console.error(error);
            }
        });
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // CHECK IF CARD ALREADY EXIST 
        handleCheckCard();
    };


      return (
        <div className="App">
          <h1>Ajouter une carte</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Nom:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              URL de l'image:
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Race:
              <input
                type="text"
                name="race"
                value={formData.race}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Type:
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              ID de la carte:
              <input
                type="text"
                name="cardId"
                value={formData.cardId}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Ajouter la carte</button>
          </form>
        </div>
      );
    }
    
    export default App;