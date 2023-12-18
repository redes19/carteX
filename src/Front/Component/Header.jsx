import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    // Attach the event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/Admin">
                Admin
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/Inscription">
                Inscription
              </Button>
              <Button color="inherit" component={RouterLink} to="/Connection">
                Connection
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
