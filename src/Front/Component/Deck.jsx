import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import Slider from 'react-slick';
import { useNavigate } from "react-router-dom";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DeckPage = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Check if the token is present
        if (token == null) {
          // If no token is present, navigate to the home page
          navigate('/');
        }

        // Fetch the list of decks from the server using axios
        const response = await axios.get('http://localhost:3001/user/decks', {
          headers: {
            // Include the token in the Authorization header
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Set the fetched decks in the state
        setDecks(response.data);

        // Set loading to false as the data has been fetched
        setLoading(false);
      } catch (error) {
        // Handle errors during the fetch operation
        console.error('Error fetching decks:', error);
        setError('An error occurred while fetching decks.');
        setLoading(false);
      }
    };

    // Invoke the fetchDecks function when the component mounts
    fetchDecks();
  }, []); // Empty dependency array ensures the effect runs only once on mount


  const handleDeckClick = async (deckId) => {
    try {
      // Fetch the cards of the selected deck from the server
      const response = await axios.get(`http://localhost:3001/user/decks/${deckId}/cards`, {
        headers: {
          // Include the token in the Authorization header
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Set the selected deck with its cards in the component state
      setSelectedDeck({
        id: deckId,
        cards: response.data,
      });
    } catch (error) {
      // Handle errors during the fetch operation
      console.error('Error fetching deck cards:', error);
      setError('An error occurred while fetching deck cards.');
    }
  };

  const deleteDeck = async (deckId) => {
    try {
      // Send a DELETE request to the server to delete the specified deck
      await axios.delete(`http://localhost:3001/user/decks/${deckId}`, {
        headers: {
          // Include the user's token in the Authorization header
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Update the list of decks after the deletion
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
  
      // Reset selectedDeck after the deletion
      if (selectedDeck && selectedDeck.id === deckId) {
        setSelectedDeck(null);
      }
    } catch (error) {
      // Handle errors during the delete operation
      console.error('Error deleting deck:', error);
      setError('An error occurred while deleting the deck.');
    }
  };
  

  const deleteCard = async (deckId, cardId) => {
    try {
      // Send a DELETE request to the server to delete the specified card from the deck
      await axios.delete(`http://localhost:3001/user/decks/${deckId}/cards/${cardId}`, {
        headers: {
          // Include the user's token in the Authorization header
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Update the list of cards in the selected deck after the deletion
      setSelectedDeck((prevSelectedDeck) => ({
        ...prevSelectedDeck,
        cards: prevSelectedDeck.cards.filter((card) => card.id !== cardId),
      }));
    } catch (error) {
      // Handle errors during the delete operation
      console.error('Error deleting card:', error);
      setError('An error occurred while deleting the card.');
    }
  };
  

  const settingsCards = {
    className: 'center',   // Set the class name for the slider
    centerMode: true,      // Enable center mode, where the center slide is larger
    infinite: false,       // Disable infinite loop, so the slider won't continue endlessly
    centerPadding: '1px',  // Set padding on the sides when in center mode
    slidesToShow: 3,       // Number of slides to show at a time
    speed: 500,            // Transition speed in milliseconds
  };
  

  return (
    <Grid container spacing={2}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading &&
        !error &&
        decks.map((deck) => (
          <Grid item xs={12} key={deck.id}>
            <Card sx={{ border: 'none', bgcolor: 'transparent' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {deck.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleDeckClick(deck.id)}
                  sx={{ color: 'white', border: 'none' }}
                  data-deck-id={deck.id}
                >
                  Voir les cartes
                </Button>
                <Button
                  size="small"
                  onClick={() => deleteDeck(deck.id)}
                  sx={{ color: 'red', border: 'none' }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
            {selectedDeck && selectedDeck.id === deck.id && (
            <Slider {...settingsCards} key={deck.id} className="custom-slick-list">
              {selectedDeck.cards.map((card) => (
              <Card key={card.id} sx={{ border: 'none', bgcolor: 'transparent' }}>
                <CardContent>
                  <img src={card.imageUrl} alt={card.name} />
                  <Button
                    size="small"
                    onClick={() => deleteCard(deck.id, card.id)}  // Passer l'id du deck et de la carte
                    sx={{ color: 'red', border: 'none' }}
                  >
                    Supprimer
                  </Button>
                </CardContent>
              </Card>
            ))}
            </Slider>
          )}
          </Grid>
        ))}
    </Grid>
  );
};

export default DeckPage;
