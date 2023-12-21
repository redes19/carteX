import React, { useEffect, useState } from "react";
import { Button, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../Style/header.css';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { cart, removeFromCart,clearCart } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState([]);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const fetchCard = async (cardId) => {
    try {
      const token = localStorage.getItem('token');
      if (token == null) {
        navigate('/');
        return null;
      }

      const response = await axios.get(`http://localhost:3001/cards/${cardId}`);
      console.log(response.data);
      return response.data;  // Utiliser la colonne 'name' pour le nom de la carte
    } catch (error) {
      console.error('Error fetching card:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCardNames = async () => {
      const cardDetailsPromises = cart.map(async (cardId) => {
        return fetchCard(cardId);
      });
  
      const resolvedCardDetails = await Promise.all(cardDetailsPromises);
      setCardDetails(resolvedCardDetails.filter(Boolean).flat()); 
      setLoading(false);
      console.log("///////////////////////////////////////////");
      console.log(cardDetails);
    };
  
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (JSON.stringify(cart) !== JSON.stringify(storedCart)) {
      fetchCardNames();
    }
  }, [cart, navigate]);

  const renderCard = () => {
    return (
      <>
        <List>
          {cardDetails.map((card, index) => (
            <ListItem key={`cardName_${index}`}>
              <ListItemText primary={card.name} />
              <Button variant="outlined" color="secondary" onClick={() => removeFromCart(card.id)}>
                Supprimer
              </Button>
            </ListItem>
            
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={clearCart}>
            Vider le panier
        </Button>
      </>
    );
  };


  if (isLoggedIn) {
    return (
      <AppBar position="sticky" className="header-appbar">
        <Toolbar>
          <div className='searchBar-container'>
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
              <TextField className="searchBar" id="searchBar" label="Recherche" variant="outlined" />
            </Box>
          </div>
          <Button color="inherit" component={Link} to="/">
            Menu
          </Button>
          {isAdmin !== undefined && isAdmin && (
            <Button color="inherit" component={Link} to="/Admin">
              Admin
            </Button>
          )}
          <Button color="inherit" component={Link} to="/Inventaire">
            Inventaire
          </Button>
          <Button color="inherit" component={Link} to="/Deck">
            Deck
          </Button>
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <ShoppingCartIcon />
          </IconButton>
          <Button color="inherit" onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {renderCard()}
      </Drawer>
      </AppBar>
    );
  } else {
    return (
      <AppBar position="sticky" className="header-appbar">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Menu
          </Button>
          <Button color="inherit" component={Link} to="/Inscription">
            Inscription
          </Button>
          <Button color="inherit" component={Link} to="/Connection">
            Connection
          </Button>
          <div className='searchBar-container'>
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
              <TextField className="searchBar" id="searchBar" label="Recherche" variant="outlined" />
            </Box>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
};

export default Header;
