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
const pool_user = mariadb.createPool({
  host: process.env.DB_HOST_PROJECTUSER,
  user: process.env.DB_USER_PROJECTUSER,
  password: process.env.DB_PWD_PROJECTUSER,
  database: process.env.DB_DTB_PROJECTUSER,
  connectionLimit: 40,
});

const pool_card = mariadb.createPool({
  host: process.env.DB_HOST_PROJECT,
  user: process.env.DB_USER_PROJECT,
  password: process.env.DB_PWD_PROJECT,
  database: process.env.DB_DTB_PROJECT,
});


app.get("/Utilisateur", async (req, res) => {
  let conn;
  console.log("Request GET /Utilisateur");
  try {
    conn = await pool_user.getConnection();
    console.log("lancement");
    const rows = await conn.query("SELECT * FROM Utilisateur");
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/user", async (req, res) => {
  let conn;

  try {
    conn = await pool_user.getConnection();
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
    const lastInsertId = Number(resultInsert.insertId);
    console.log("ID de l'utilisateur créé:", lastInsertId);

    res.json({
      message: "Utilisateur créé avec succès",
      userId: lastInsertId,
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  } finally {
    if (conn) conn.release();
  }
});

const secretKey = process.env.JWT_SECRET_KEY; // Récupérer la clé secrète depuis une variable d'environnement

app.post("/login", async (req, res) => {
  let conn;

  try {
    conn = await pool_user.getConnection();

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


// CARD PART

app.get("/cards", async (req, res) => {
  let conn;
  try {
    conn = await pool_card.getConnection();
    console.log("Request GET /cards");
    const rows = await conn.query("SELECT * FROM Carte");
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/cards/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool_card.getConnection();
    console.log("Request GET /cards/:id");
    const rows = await conn.query("SELECT * FROM Carte WHERE id = ?", [req.params.id]);
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/cards", async (req, res) => {
  // console.log(req.body)
  try{
    let conn = await pool_card.getConnection();
    console.log("Request POST /cards\n")

    req.body.data.forEach(async (card) => {
      const result = await conn.query("SELECT * FROM Carte WHERE cardId = ?", [card.id]);
      if(result.length == 0){
        const query = "INSERT INTO Carte (name, `desc`, imageUrl, race, type, frameType, cardId) VALUES (?, ?, ?, ?, ?, ?, ?)";
        console.log(card.name)
        const resultInsert = await conn.query(query, [
          card.name, 
          card.desc, 
          card.card_images[0].image_url, 
          card.race, 
          card.type, 
          card.frameType, 
          card.id
        ]);
        console.log(card)
      }      
    });    
    res.status(200).json("Success");

  }
  catch(err){
      console.log("Erreur" + err);
      // res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});



app.listen(3001, () => {
  console.log("Serveur à l'écoute");
});
