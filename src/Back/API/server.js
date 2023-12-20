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


app.get("/user", verifyToken,async (req, res) => {
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

// delete user

app.delete("/user/:id",verifyToken, async (req, res) => {
  let conn;
  try {
    conn = await pool_user.getConnection();
    console.log("Request DELETE /user/:id");
    const rows = await conn.query("DELETE FROM Utilisateur WHERE id = ?", [
      req.params.id,
    ]);
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
}
);

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
    // console.log("Request GET /cards");
    const rows = await conn.query("SELECT * FROM Carte");
    conn.release();
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
    // console.log("Request GET /cards/:id");
    const rows = await conn.query("SELECT * FROM Carte WHERE id = ?", [req.params.id]);
    conn.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
});

app.post("/cards", async (req, res) => {
  let conn; // Déplacez la déclaration ici pour qu'elle soit accessible dans le bloc finally

  try {
    conn = await pool_card.getConnection();
    // console.log("Request POST /cards\n");

    req.body.data.forEach(async (card) => {
      const result = await conn.query("SELECT * FROM Carte WHERE cardId = ?", [card.id]);
      if (result.length == 0) {
        let query = "INSERT INTO Carte (name, `desc`, imageUrl, race, type, cardId";
        let values = "VALUES (?, ?, ?, ?, ?, ?";
        let array = [
          card.name, 
          card.desc,
          card.card_images[0].image_url,
          card.race,
          card.type,
          card.id,
          ]
        
        if(card.card_prices[0].amazon_price != null){
          query += ", amazonPrice";
          values += ", ?";
          array.push(card.card_prices[0].amazon_price);
        }
        if(card.card_prices[0].cardmarket_price != null){
          query += ", cardmarketPrice";
          values += ", ?";
          array.push(card.card_prices[0].cardmarket_price);
        }
        if(card.card_prices[0].coolstuffinc_price != null){
          query += ", coolstuffincPrice";
          values += ", ?";
          array.push(card.card_prices[0].coolstuffinc_price);
        }
        if(card.card_prices[0].ebay_price != null){
          query += ", ebayPrice";
          values += ", ?";
          array.push(card.card_prices[0].ebay_price);
        }
        if(card.card_prices[0].tcgplayer_price != null){
          query += ", tcgplayerPrice";
          values += ", ?";
          array.push(card.card_prices[0].tcgplayer_price);
        }
        if(card.archetype != null){
          query += ", archetype";
          values += ", ?";
          array.push(card.archetype);
        }
        if(card.atk != null){
          query += ", atk";
          values += ", ?";
          array.push(card.atk);
        }
        if(card.attribute != null){
          query += ", `attribute`";
          values += ", ?";
          array.push(card.attribute);
        }
        if(card.def != null){
          query += ", def";
          values += ", ?";
          array.push(card.def);
        }
        if(card.level != null){
          query += ", level";
          values += ", ?";
          array.push(card.level);
        }

        query += ") ";
        values += ")";
        const finalQuery = query + values;


        const resultInsert = await conn.query(finalQuery, array);
      }
    });
    res.status(200).json("Success");

  } catch (err) {
    console.log("Erreur" + err);
    // res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});



app.get("/cards/search/:name/:type/:minprice/:maxprice/:shop/:rarity/:order/:terms", async (req, res) => { 
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
    
    // GET SHOP AND PRICE
    if(bool){
      if(req.params.shop == "amazonPrice"){
        query += "AND amazonPrice >= ? AND amazonPrice <= ? ";
      }else if(req.params.shop == "cardmarketPrice"){
        query += "AND cardmarketPrice >= ? AND cardmarketPrice <= ? ";
      }else if(req.params.shop == "coolstuffincPrice"){
        query += "AND coolstuffincPrice >= ? AND coolstuffincPrice <= ? ";
      }else if(req.params.shop == "ebayPrice"){
        query += "AND ebayPrice >= ? AND ebayPrice <= ? ";
      }else if(req.params.shop == "tcgplayerPrice"){
        query += "AND tcgplayerPrice >= ? AND tcgplayerPrice <= ? ";
      }
    }else{
      if(req.params.shop == "amazonPrice"){
        query += "WHERE amazonPrice >= ? AND amazonPrice <= ? ";
        bool = true;
      }else if(req.params.shop == "cardmarketPrice"){
        query += "WHERE cardmarketPrice >= ? AND cardmarketPrice <= ? ";
        bool = true;
      }else if(req.params.shop == "coolstuffincPrice"){
        query += "WHERE coolstuffincPrice >= ? AND coolstuffincPrice <= ? ";
        bool = true;
      }else if(req.params.shop == "ebayPrice"){
        query += "WHERE ebayPrice >= ? AND ebayPrice <= ? ";
        bool = true;
      }else if(req.params.shop == "tcgplayerPrice"){
        query += "WHERE tcgplayerPrice >= ? AND tcgplayerPrice <= ? ";
        bool = true;
      }
    }
    params.push(req.params.maxprice);
    params.push(req.params.minprice);

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
