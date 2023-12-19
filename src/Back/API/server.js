const express = require("express"); // récupération express
const app = express(); // variable utilisant la librairie express
const bcrypt = require("bcrypt");
let cors = require("cors");
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

require("dotenv").config();

app.use(express.json());
app.use(cors());

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_DTB,
});

app.get("/Utilisateur", async (req, res) => {
  let conn;
  console.log("Route /Utilisateur appelée");
  console.log("User Data:", req.userData);
  console.log("User ID:", req.userData.userId);
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Utilisateur");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/Utilisateur", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    console.log("lancement requete");
    // Vérifiez si l'email existe déjà
    const result = await conn.query(
      "SELECT * FROM Utilisateur WHERE Email = ?",
      [req.body.email]
    );
    console.log("email", req.body.email);
    if (result.length > 0) {
      // L'email existe déjà, renvoyer une réponse appropriée
      return res.status(400).json({ error: "Cet email existe déjà" });
    }
    console.log("mdp");
    // L'email n'existe pas, procéder à l'insertion
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const query =
      "INSERT INTO Utilisateur (email, mdp, prenom, nom) VALUES (?, ?, ?,?)";

    const resultInsert = await conn.query(query, [
      req.body.email,
      hashedPassword,
      req.body.prenom,
      req.body.nom,
    ]);
    console.log(req.body.id);

    res.json({
      message: "Utilisateur créé avec succès",
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

const secretKey = process.env.JWT_SECRET_KEY; // Récupérer la clé secrète depuis une variable d'environnement

app.post("/login", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      "SELECT * FROM Utilisateur WHERE email = ?",
      [req.body.email]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(req.body.password, user.mdp);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }


    // Créer un token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin, 
      },
      secretKey,
      { expiresIn: '1h' } 
    );


    // Ajouter le nom d'utilisateur et le token à la réponse
    res.json({
      message: "Connexion réussie",
      userId: user.id,
      userName: user.nom,
      token : token,
    });
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  } finally {
    if (conn) conn.release();
  }
});


app.listen(3001, () => {
  console.log("Serveur à l'écoute");
});
