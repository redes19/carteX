import React, { useEffect } from "react";
import { Button, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import '../../Style/header.css';

const Header = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    console.log("Auth State in Header Updated:", isLoggedIn);
  }, [isLoggedIn]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const cartItems = cart.map(itemId => (
    // Vous pouvez afficher les détails de chaque élément du panier ici
    <ListItem key={itemId}>
      <ListItemText primary={`Item ID: ${itemId}`} />
    </ListItem>
  ));

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
          <List>
            {cartItems}
          </List>
        </Drawer>
      </AppBar>
    )
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
    )
  }
}

export default Header;
