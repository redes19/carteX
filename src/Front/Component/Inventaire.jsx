import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [addToDeckDialogOpen, setAddToDeckDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');

  const handleCardHover = (card) => {
    setHoveredCard(card);
  };

  const handleAddToDeckClick = async () => {
    if (selectedDeck === 'createNew') {
      // Logique pour créer un nouveau deck ici
      console.log('Créer un nouveau deck:', newDeckName);

      // Mettez à jour l'état ou effectuez une requête pour créer le nouveau deck
    } else {
      // Logique pour ajouter la carte au deck existant ici
      console.log('Ajouter la carte au deck:', hoveredCard, 'Deck sélectionné:', selectedDeck);
    }

    setAddToDeckDialogOpen(false);
  };

  const handleDialogClose = () => {
    setHoveredCard(null);
    setAddToDeckDialogOpen(false);
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
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

    const fetchDecks = async () => {
      try {
        // Fetch decks from the server
        const response = await axios.get('http://localhost:3001/user/decks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setDecks(response.data);
        // Assumez que le premier deck est sélectionné par défaut
        if (response.data.length > 0) {
          setSelectedDeck(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchInventory();
    fetchDecks();
  }, []);

  return (
    <Grid container spacing={2}>
      {inventory.map((item) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
          <img
            src={item.carte_details.imageUrl}
            alt={`Card ${item.carte_id}`}
            style={{ maxWidth: '100%', opacity: 1, cursor: 'pointer' }}
            onClick={() => setAddToDeckDialogOpen(true)}
            onMouseEnter={() => handleCardHover(item.carte_details)}
            onMouseLeave={() => handleCardHover(null)}
          />
        </Grid>
      ))}

      {/* Dialog pour ajouter à un deck */}
      <Dialog open={addToDeckDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Ajouter à un deck</DialogTitle>
        <DialogContent>
          <p>{hoveredCard && `Nom de la carte: ${hoveredCard.name}`}</p>
          <FormControl fullWidth>
            <InputLabel id="deck-select-label">Sélectionner un deck</InputLabel>
            <Select
              labelId="deck-select-label"
              id="deck-select"
              value={selectedDeck}
              onChange={(e) => setSelectedDeck(e.target.value)}
            >
              {decks.map((deck) => (
                <MenuItem key={deck.id} value={deck.id}>
                  {deck.name}
                </MenuItem>
              ))}
              <MenuItem value="createNew">Créer un nouveau deck</MenuItem>
            </Select>
          </FormControl>
          {selectedDeck === 'createNew' && (
            <TextField
              label="Nom du nouveau deck"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={handleAddToDeckClick}>Ajouter au deck</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default InventoryPage;
