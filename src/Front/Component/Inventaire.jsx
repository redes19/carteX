import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Remplacez 'userId' par l'ID de l'utilisateur actuellement connecté
        const userId = 'userId'; 

        const response = await axios.get(`http://localhost:3001/user/inventory`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Card ID</th>
            <th>Quantity</th>
            {/* Ajoutez d'autres colonnes en fonction de vos besoins */}
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.carte_id}</td>
              <td>{item.quantite}</td>
              {/* Ajoutez d'autres colonnes en fonction de vos besoins */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
