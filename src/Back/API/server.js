const express = require("express"); // récupération express
const app = express(); // variable utilisant la librairie express
const bcrypt = require("bcrypt");
let cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const mariadb = require("mariadb");
const pool_user = mariadb.createPool({
  host: process.env.DB_HOST_PROJECTUSER,
  user: process.env.DB_USER_PROJECTUSER,
  password: process.env.DB_PWD_PROJECTUSER,
  database: process.env.DB_DTB_PROJECTUSER,
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
  }
});

app.post("/Utilisateur", async (req, res) => {
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

    // Ajouter le nom d'utilisateur à la réponse
    res.json({
      message: "Connexion réussie",
      userId: user.id,
      userName: user.nom,
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
    // console.log("Request GET /cards");
    const rows = await conn.query("SELECT * FROM Carte");
    conn.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/cards/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool_card.getConnection();
    // console.log("Request GET /cards/:id");
    const rows = await conn.query("SELECT * FROM Carte WHERE id = ?", [req.params.id]);
    conn.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/cards", async (req, res) => {
  // console.log(req.body)
  try{
    let conn = await pool_card.getConnection();
    // console.log("Request POST /cards\n")

    req.body.data.forEach(async (card) => {
      const result = await conn.query("SELECT * FROM Carte WHERE cardId = ?", [card.id]);
      if(result.length == 0){
        const query = "INSERT INTO Carte (name, `desc`, imageUrl, race, type, frameType, cardId) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const resultInsert = await conn.query(query, [
          card.name, 
          card.desc, 
          card.card_images[0].image_url, 
          card.race, 
          card.type, 
          card.frameType, 
          card.id
        ]);
      }      
    });    
    conn.release();
  }
  catch(err){
      console.log("Erreur" + err);
      // res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/cards/search/:name/:type/:minprice/:maxprice/:rarity/:order/:terms", async (req, res) => { 
  try{
    let conn = await pool_card.getConnection();
    let query = "SELECT * FROM Carte "; 
    let params = [];
    let bool = false;
    let terms = "";

    // IS THERE A TYPE ?  
    if(req.params.type != "default"){
      if(bool){
        query += "AND type LIKE ? ";
      }
      else{
        query += "WHERE type LIKE ? ";
        bool = true;
      }
      params.push("%" + req.params.type + "%");
    }
    
    // IS THERE A RARITY GIVEN ?
    if(req.params.rarity != "default"){
      if(bool){
        query += "AND rarity LIKE ? ";
      }
      else{
        query += "WHERE rarity LIKE ? ";
        bool = true;
      }
      params.push("%" + req.params.rarity + "%");
    }

    // ARE THERE SEARCHTERMS ?
    if(req.params.terms != "nosearch"){
      if(bool){
        query += "AND (name LIKE ? OR `desc` LIKE ?) ";
      }
      else{
        query += "WHERE (name LIKE ? OR `desc` LIKE ?) ";
        bool = true;
      }
      terms = req.params.terms.split(" ");
      let termsString = "";
      terms.forEach((term) => {
        termsString += "%" + term + "%";
      });
      params.push(termsString);
      params.push(termsString);
    }

    // PRICE TBA
    // if(bool){
    //   query += "AND price >= ? AND price <= ? ";
    // }
    // else{
    //   query += "WHERE price >= ? AND price <= ? ";
    //   bool = true;
    // }
    // params.push(req.params.minprice);
    // params.push(req.params.maxprice);


    // IS THERE A NAME ?
    if(req.params.name != "false"){
      if(bool){
        query += "AND name LIKE ? ";
      }
      else{
        query += "WHERE name LIKE ? ";
        bool = true;
      }
      params.push("%" + terms + "%");
    }

    // ORDER
    query += "ORDER BY name " + req.params.order ;
    // params.push(req.params.order);
    console.log(query, params)
    const rows = await conn.query(query, params);
    conn.release();
    res.status(200).json(rows);
  }
  catch (err){
    console.log("Erreur " + err);
  }
});



app.listen(3001, () => {
  console.log("Serveur à l'écoute");
});
