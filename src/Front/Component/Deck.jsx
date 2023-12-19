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
      if (selectedDeck && selectedDeck.id === deckId) {
        setSelectedDeck(null);
      } else {
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
        }
      }
    };
  
    return (
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {decks.map((deck) => (
          <Grid item xs={6} sm={4} md={3} key={deck.id}>
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
                >
                  Voir les cartes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {selectedDeck && (
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: 'white' }}>
              {selectedDeck.name}
            </Typography>
            {selectedDeck.cards.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <Grid container spacing={2}>
                  {selectedDeck.cards.map((card) => (
                    <Grid item key={card.id}>
                      <Card sx={{ border: 'none', bgcolor: 'transparent' }}>
                        <CardContent>
                          <img src={card.imageUrl} alt={card.name} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
              <Typography sx={{ color: 'white' }}>Aucune carte dans ce deck.</Typography>
            )}
          </Grid>
        )}
      </Grid>
    );
  };
  
  export default DeckPage;
  