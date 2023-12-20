import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DeckPage = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
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
              </CardActions>
            </Card>
            {selectedDeck && selectedDeck.id === deck.id && (
              <Slider {...settingsCards} key={deck.id} className="custom-slick-list">
                {selectedDeck.cards.map((card) => (
                  <Card key={card.id} sx={{ border: 'none', bgcolor: 'transparent' }}>
                    <CardContent>
                      <img src={card.imageUrl} alt={card.name} />
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