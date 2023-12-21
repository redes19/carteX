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
        const token = localStorage.getItem('token');
        // Vérifier si le token est présent
        if (token == null) {
          navigate('/');
        }

        const response = await axios.get(`http://localhost:3001/user/decks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDecks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching decks:', error);
        setError('An error occurred while fetching decks.');
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleDeckClick = async (deckId) => {
    try {
      const response = await axios.get(`http://localhost:3001/user/decks/${deckId}/cards`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSelectedDeck({
        id: deckId,
        cards: response.data,
      });
    } catch (error) {
      console.error('Error fetching deck cards:', error);
      setError('An error occurred while fetching deck cards.');
    }
  };

  const deleteDeck = async (deckId) => {
    try {
      await axios.delete(`http://localhost:3001/user/decks/${deckId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Mettre à jour la liste des decks après la suppression
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
  
      // Réinitialisez selectedDeck après la suppression
      if (selectedDeck && selectedDeck.id === deckId) {
        setSelectedDeck(null);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      setError('An error occurred while deleting the deck.');
    }
  };

  const deleteCard = async (deckId, cardId) => {
    try {
      console.log('deckId:', deckId);
      console.log('cardId:', cardId);
      await axios.delete(`http://localhost:3001/user/decks/${deckId}/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Mettre à jour la liste des cartes après la suppression
      setSelectedDeck((prevSelectedDeck) => ({
        ...prevSelectedDeck,
        cards: prevSelectedDeck.cards.filter((card) => card.id !== cardId),
      }));
    } catch (error) {
      console.error('Error deleting card:', error);
      setError('An error occurred while deleting the card.');
    }
  };

  const settingsCards = {
    className: 'center',
    centerMode: true,
    infinite: false, 
    centerPadding: '1px',
    slidesToShow: 3,
    speed: 500,
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
