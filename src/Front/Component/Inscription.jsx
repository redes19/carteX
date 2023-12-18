import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
} from "@mui/material";


const useStyles = (theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    margin: "auto",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
});

const Inscription = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/Utilisateurs", {
        email,
        password,
        prenom: firstName,
        nom: lastName, 
      });

      console.log(response.data);

      localStorage.setItem("userId", response.data.userId);
      const userId = localStorage.getItem("userId");
      console.log("id user: ", userId);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName(""); 
  };

  return (
    <Container>
      <Typography variant="h2">Inscription</Typography>
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
        <TextField
          className={classes.textField}
          label="Prénom"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          className={classes.textField}
          label="Nom"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
        >
          S'inscrire
        </Button>
      </form>
    </Container>
  );
};

export default Inscription;
