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
        // Ajouter la logique pour vérifier si la carte existe déjà
        $.ajax({
            url: '../../Back/PHP/DisplayCarte.php',
            method: 'POST',
            dataType: 'json',
            data: { name: formData.name },
            success: function(response) {
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
            url: '../../Back/PHP/addCarte.php',
            method: 'POST',
            dataType: 'json',
            data: formData,
            success: function(response) {
                console.log(response);      
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Vérifiez d'abord si la carte existe
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