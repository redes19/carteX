import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const useStyles = (theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    margin: "auto",
  },
});

const Connexion = () => {
  const classes = useStyles();
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
      const { userId, userName } = response.data;

      // Enregistrez l'ID de l'utilisateur dans le local storage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);

      login(userName);

      // Trigger a navigation to the current page to reload the header
      navigate(window.location.pathname);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
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
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className={classes.textField}
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Se connecter
          </Button>
        </form>
      )}
    </Container>
  );
};

export default Connexion;
