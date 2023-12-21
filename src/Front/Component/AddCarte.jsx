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
          url: 'http://localhost:8000/src/Back/PHP/component/CheckCarte.php',
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
            url: 'http://localhost:8000/src/Back/PHP/component/addCarte.php',
            method: 'POST',
            dataType: 'json',
            data: {
                name: formData.name,
                desc: formData.desc,
                imageUrl: formData.imageUrl,
                race: formData.race,
                type: formData.type,
                cardId: formData.cardId,
            },
            success: function (response) {
                // Vérifiez si la carte a été ajoutée avec succès
                if (response.success) {
                    alert("La carte a été ajoutée avec succès.");
                    // Redirigez ou effectuez d'autres actions après l'ajout réussi
                } else {
                    alert("Une erreur s'est produite lors de l'ajout de la carte.");
                }
            },
            error: function (error) {
                console.error(error);
            },
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
            <label htmlFor="type-select">Choose a type:</label>

            <select name="type">
              <option value="">--Please choose an option--</option>
              <option value="Normal_Monster">Normal Monster</option>
              <option value="Effect_Monster">Effect_Monster</option>
              <option value="Fusion_Monster">Fusion_Monster</option>
              <option value="Ritual_Monster">Ritual_Monster</option>
              <option value="Synchro_Monster">Synchro_Monster</option>
              <option value="Xyz_Monster">Xyz_Monster</option>
              <option value="Spell">Spell</option>
              <option value="Trap">Trap</option>
              <option value="Union_Effect">Union_Effect</option>
              <option value="Spirit_Effect">Spirit_Effect</option>
              <option value="Toon_Effect">Toon_Effect</option>
              <option value="Gemini_Effect">Gemini_Effect</option>
              <option value="Pendulum_Effect">Pendulum_Effect</option>
              <option value="Token_Effect">Token_Effect</option>
              <option value="Link_Effect">Link_Effect</option>
            </select>
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