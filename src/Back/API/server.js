const express = require("express"); // récupération express
const app = express(); // variable utilisant la librairie express
const bcrypt = require("bcrypt");
let cors = require("cors");
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const getUserIdFromToken = require('./getUserIdFromToken');

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
      { expiresIn: '10h' } 
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
  let conn; // Déplacez la déclaration ici pour qu'elle soit accessible dans le bloc finally

  try {
    conn = await pool_card.getConnection();
    console.log("Request POST /cards\n");

    req.body.data.forEach(async (card) => {
      const result = await conn.query("SELECT * FROM Carte WHERE cardId = ?", [card.id]);
      if (result.length == 0) {
        const query = "INSERT INTO Carte (name, `desc`, imageUrl, race, type, frameType, cardId) VALUES (?, ?, ?, ?, ?, ?, ?)";
        console.log(card.name);
        const resultInsert = await conn.query(query, [
          card.name,
          card.desc,
          card.card_images[0].image_url,
          card.race,
          card.type,
          card.frameType,
          card.id,
        ]);
        console.log(card);
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


app.get("/user/inventory", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const userId = getUserIdFromToken(token);

    // Utilisez une seule connexion pour effectuer la transaction
    const conn = await pool_user.getConnection();

    try {
      // Sélectionnez l'inventaire de l'utilisateur depuis la base de données principale
      const inventoryQuery = "SELECT * FROM Inventaire WHERE utilisateur_id = ?";
      const inventoryResult = await conn.query(inventoryQuery, [userId]);

      // Sélectionnez les détails des cartes de la base de données des cartes
      const cardDetailsQuery = "SELECT Carte.id, Carte.name, Carte.desc, Carte.imageUrl FROM projet.Carte WHERE Carte.id IN (?)";
      const cardIds = inventoryResult.map((item) => item.carte_id);
      const cardDetailsResult = await conn.query(cardDetailsQuery, [cardIds]);

      // Associez les détails des cartes avec l'inventaire
      const inventoryWithDetails = inventoryResult.map((inventoryItem) => {
        const matchingCard = cardDetailsResult.find((card) => card.id === inventoryItem.carte_id);
        return {
          id: inventoryItem.id,
          utilisateur_id: inventoryItem.utilisateur_id,
          carte_id: inventoryItem.carte_id,
          quantite: inventoryItem.quantite,
          carte_details: matchingCard,
        };
      });

      res.status(200).json(inventoryWithDetails);
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error fetching user inventory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/decks/:deckId/cards", async (req, res) => {
  const { deckId } = req.params;

  const token = req.headers.authorization.split(' ')[1];

  getUserIdFromToken(token);

  let conn;  
  
  try {
    // Assurez-vous que la logique d'accès à la base de données est correcte
    conn = await pool_user.getConnection();  

    // Sélectionnez les cartes associées au deck
    const cardsQuery = `
      SELECT Carte.id, Carte.name, Carte.desc, Carte.imageUrl
      FROM projetUser.CarteDeck
      JOIN projet.Carte ON CarteDeck.carte_id = Carte.id
      WHERE CarteDeck.deck_id = ?;
    `;

    const cardsResult = await conn.query(cardsQuery, [deckId]);

    res.status(200).json(cardsResult);
  } catch (err) {
    console.error("Error fetching deck cards:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});

//ajouter une carte à un deck
app.post("/user/decks/:deckId/:cardId", async (req, res) => {
  const { deckId, cardId } = req.params;
  console.log("lancement requete post ccarte Deck");
  console.log("deckID", deckId);
  console.log("card id", cardId);
  const token = req.headers.authorization.split(' ')[1];

  // Utiliser getUserIdFromToken pour obtenir l'ID de l'utilisateur
  const userId = getUserIdFromToken(token);

  let conn;

  try {
    // Assurez-vous que la logique d'accès à la base de données est correcte
    conn = await pool_user.getConnection();
    console.log("lancement requete post ccarte Deck"); 

    // Vérifier que le deck appartient à l'utilisateur
    const deckOwnershipQuery = `
      SELECT user_id FROM Deck WHERE id = ?;
    `;
    const deckOwnershipResult = await conn.query(deckOwnershipQuery, [deckId]);

    if (deckOwnershipResult.length === 0 || deckOwnershipResult[0].user_id !== userId) {
      // Le deck n'appartient pas à l'utilisateur actuel
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    // Sélectionnez les cartes associées au deck
    const cardsQuery = `
      INSERT INTO CarteDeck (deck_id, carte_id)
      VALUES (?, ?);
    `;

    const cardsResult = await conn.query(cardsQuery, [deckId, cardId]);

    // Vérifier si cardsResult est un tableau avant d'utiliser la méthode map
    const serializedResult = Array.isArray(cardsResult)
      ? cardsResult.map((row) => ({
          deck_id: Number(row.deck_id),
          carte_id: Number(row.carte_id),
        }))
      : null;

    res.status(200).json(serializedResult);
  } catch (err) {
    console.error("Error adding card to deck:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});





app.get("/user/decks", verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization.split(' ')[1]);

    // Utilisez une seule connexion pour effectuer la transaction
    const conn = await pool_user.getConnection();

    try {
      // Sélectionnez tous les decks de l'utilisateur depuis la base de données principale
      const decksQuery = "SELECT * FROM Deck WHERE user_id = ?";
      const decksResult = await conn.query(decksQuery, [userId]);

      res.status(200).json(decksResult);
    } finally {
      // Assurez-vous de libérer la connexion après utilisation
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error fetching user decks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ajouter un deck à un utilisateur

app.post("/user/decks", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization.split(' ')[1]);

    // Utilisez une seule connexion pour effectuer la transaction
    const conn = await pool_user.getConnection();

    try {
      // Sélectionnez tous les decks de l'utilisateur depuis la base de données principale
      const decksQuery = "INSERT INTO Deck (name, user_id) VALUES (?, ?)";
      const decksResult = await conn.query(decksQuery, [req.body.name, userId]);

      res.status(200).json(decksResult);
    } finally {
      // Assurez-vous de libérer la connexion après utilisation
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error fetching user decks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
)

app.listen(3001, () => {
  console.log("Serveur à l'écoute");
});
