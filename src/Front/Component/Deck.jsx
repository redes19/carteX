import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const DeckPage = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/decks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setDecks(response.data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchDecks();
  }, []);

  const handleDeckClick = async (deckId) => {
    // Récupérer les cartes associées au deck
    try {
      const response = await axios.get(`http://localhost:3001/user/decks/${deckId}/cards`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Mettez à jour l'état pour afficher les cartes du deck sélectionné
      setSelectedDeck({
        id: deckId,
        cards: response.data,
      });
    } catch (error) {
      console.error('Error fetching deck cards:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {decks.map((deck) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={deck.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{deck.name}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleDeckClick(deck.id)}>
                Voir les cartes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      {selectedDeck && (
        <Grid item xs={12}>
          <Typography variant="h5">{selectedDeck.name}</Typography>
          <div style={{ overflowX: 'auto' }}>
            <Grid container spacing={2}>
              {selectedDeck.cards.map((card) => (
                <Grid item key={card.id}>
                  {/* Afficher les détails de la carte ici */}
                  <Card>
                    <CardContent>
                      <Typography>{card.name}</Typography>
                      {/* Ajoutez d'autres détails de carte si nécessaire */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default DeckPage;
