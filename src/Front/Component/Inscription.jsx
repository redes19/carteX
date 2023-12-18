import axios from "axios";
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";


const useStyles = (theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    margin: "auto",
  },
});

const Inscription = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = (event) => {
    const regex = /(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    const isValidPassword = regex.test(event.target.value);

    if (!isValidPassword) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre et au moins 8 caractères"
      );
    } else {
      setPasswordError("");
    }
    setPassword(event.target.value);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/Utilisateur", {
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

  const isFormValid = () => {
    return email.trim() !== "" &&
      password.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      !passwordError;
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
          onChange={handleChangePassword}
        />
        {passwordError && (
          <FormHelperText error>{passwordError}</FormHelperText>
        )}
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
          disabled={!isFormValid()}

        >
          S'inscrire
        </Button>
      </form>
    </Container>
  );
};

export default Inscription;
