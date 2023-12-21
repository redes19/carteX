import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  useEffect(() => {
    // Exemple de requête GET
    axios.get('http://localhost/src/Back/PHP/index.php')
      .then(response => {
        console.log(response.data);
        // Mettez à jour votre état React avec les données reçues
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Données de PHP :</h1>
    </div>
  );
};

export default App;
