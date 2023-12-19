import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Connexion = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      const { token, userId, userName, isAdmin } = response.data;

      login(userName, token, isAdmin);

      // Trigger a navigation to the current page to reload the header
      navigate(window.location.pathname);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <Container>
      <Typography variant="h2">Connexion</Typography>
      {isLoggedIn ? (
        <Typography variant="h2">
          <form onSubmit={handleSubmit}>
            Vous êtes connecté en tant que : {isLoggedIn}
          </form>
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            Se connecter
          </Button>
        </form>
      )}
    </Container>
  );
};

export default Connexion;
