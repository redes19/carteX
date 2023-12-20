import React, { useEffect } from "react";
import { Button, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import '../../Style/header.css';

const Header = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    // Cette fonction sera appelée chaque fois que l'état d'authentification change
    console.log("Auth State in Header Updated:", isLoggedIn);
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <AppBar position="sticky" >
        <Toolbar>
          <div className='searchBar-container'>
            <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
              <TextField className="searchBar" id="searchBar" label="Recherche" variant="outlined"/>
            </Box>  
          </div>
          {isAdmin && (
            <Button color="inherit" component={Link} to="/Admin">
              Admin
            </Button>
          )}
          <Button color="inherit" onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
    )
  } else {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Button color="inherit" component={Link} to="/Inscription">
            Inscription
          </Button>
          <Button color="inherit" component={Link} to="/Connection">
            Connection
          </Button>
          <div className='searchBar-container'>
            <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
              <TextField className="searchBar" id="searchBar" label="Recherche" variant="outlined"/>
            </Box>  
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}
  
export default Header;
