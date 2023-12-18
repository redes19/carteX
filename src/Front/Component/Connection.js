import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
}));

const Connexion = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userName, setUserName] = useState("");

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

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

      console.log(response.data.userId);

      setIsLoggedIn(true);
      setUserName(response.data.userName);
      console.log(localStorage);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h2">Connexion</Typography>
      {isLoggedIn ? (
        <Typography variant="h2">
          Bonjour, {userName} ! Vous êtes connecté.
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
