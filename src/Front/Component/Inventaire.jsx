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
  // State variables
  const [inventory, setInventory] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [addToDeckDialogOpen, setAddToDeckDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Fetch inventory and decks on component mount
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
        const response = await axios.get('http://localhost:3001/user/decks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDecks(response.data);
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

  // Handle card hover
  const handleCardHover = (card) => {
    setHoveredCard(card);
  };

  // Handle card click
  const handleCardClick = async (card) => {
    const cardID = card.id;
    setHoveredCardId(cardID);
    setAddToDeckDialogOpen(true);
  };

// Handle adding card to deck
const handleAddToDeckClick = async () => {
  try {
    // Utiliser hoveredCardId au lieu de cardId
    const cardId = hoveredCardId;
    console.log(cardId);

    if (!cardId) {
      console.error('Card ID is undefined');
      return;
    }

    if (selectedDeck === 'createNew') {
      // Créer un nouveau deck
      const response = await axios.post(
        'http://localhost:3001/user/decks',
        { name: newDeckName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log("newDeckId",newDeckId);
      console.log("cardId",cardId);
      const newDeckId = response.data.insertId;

      // Ajouter la carte au nouveau deck
      await axios.post(
        `http://localhost:3001/user/decks/${newDeckId}/${cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } else {
      // Ajouter la carte à un deck existant
      await axios.post(
        `http://localhost:3001/user/decks/${selectedDeck}/${cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('Error adding card to deck:', error);
  } finally {
    setAddToDeckDialogOpen(false);
  }
};



  // Handle dialog close
  const handleDialogClose = () => {
    setHoveredCard(null);
    setAddToDeckDialogOpen(false);
  };

  return (
    <Grid container spacing={2}>
      {inventory.map((item) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
          <img
            src={item.carte_details.imageUrl}
            alt={`Card ${item.carte_id}`}
            style={{ maxWidth: '100%', opacity: 1, cursor: 'pointer' }}
            onClick={() => handleCardClick(item.carte_details)} 
            onMouseEnter={() => handleCardHover(item.carte_details)}
            onMouseLeave={() => handleCardHover(null)}
          />
        </Grid>
      ))}

      {/* Dialog for adding to a deck */}
      <Dialog open={addToDeckDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add to Deck</DialogTitle>
        <DialogContent>
          <p>{hoveredCard && `Card Name: ${hoveredCard.name}`}</p>
          <FormControl fullWidth>
            <InputLabel id="deck-select-label">Select a deck</InputLabel>
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
              <MenuItem value="createNew">Create a new deck</MenuItem>
            </Select>
          </FormControl>
          {selectedDeck === 'createNew' && (
            <TextField
              label="New Deck Name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddToDeckClick}>Add to Deck</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default InventoryPage;
