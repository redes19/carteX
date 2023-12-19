import React, { useEffect } from "react";
import { Button, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Cette fonction sera appelée chaque fois que l'état d'authentification change
    console.log("Auth State in Header Updated:", isLoggedIn);
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/Admin">
            Admin
          </Button>
          <Button color="inherit" onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/Inscription">
            Inscription
          </Button>
          <Button color="inherit" component={Link} to="/Connection">
            Connection
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
};

export default Header;
