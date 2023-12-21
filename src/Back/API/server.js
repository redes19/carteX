const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
let cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const getUserIdFromToken = require("./getUserIdFromToken");

require("dotenv").config();

app.use(express.json());
app.use(cors());

// database connection
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

// Define a route that listens for GET requests at the "/user" endpoint and uses the 'verifyToken' middleware
// verifyToken checks if user is admin
app.get("/user", verifyToken, async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_user'
    conn = await pool_user.getConnection();

    // Log a message to indicate that the route is being accessed
    console.log("lancement");

    // Execute a SQL query to select all records from the 'Utilisateur' table
    const rows = await conn.query("SELECT * FROM Utilisateur");

    // Log the retrieved rows to the console
    console.log(rows);

    // Respond to the client with a status code of 200 (OK) and send the retrieved rows as JSON
    res.status(200).json(rows);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error(err);
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// Define a route that listens for POST requests at the "/user" endpoint
app.post("/user", async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_user'
    conn = await pool_user.getConnection();

    // Log a message to indicate that the route is processing a request
    console.log("lancement requete");

    // Check if the email already exists in the database
    const result = await conn.query(
      "SELECT * FROM Utilisateur WHERE Email = ?",
      [req.body.email]
    );

    // Log the email being checked
    console.log("email", req.body.email);

    if (result.length > 0) {
      // If the email already exists, send an appropriate response
      return res.status(400).json({ error: "Cet email existe déjà" });
    }

    // Log a message indicating that the password is being processed
    console.log("mdp");

    // The email does not exist, proceed with password hashing and user insertion
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const query =
      "INSERT INTO Utilisateur (email, mdp, prenom, nom) VALUES (?, ?, ?, ?)";

    const resultInsert = await conn.query(query, [
      req.body.email,
      hashedPassword,
      req.body.prenom,
      req.body.nom,
    ]);

    // Get the ID of the newly created user
    const lastInsertId = Number(resultInsert.insertId);
    console.log("ID de l'utilisateur créé:", lastInsertId);

    // Respond to the client with a success message and the ID of the created user
    res.json({
      message: "Utilisateur créé avec succès",
      userId: lastInsertId,
    });
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Erreur lors de la création de l'utilisateur:", err);

    // Respond to the client with an error status and message
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// delete user
// verifyToken checks if user is admin
// Define a route that listens for DELETE requests at the "/user/:id" endpoint and uses the 'verifyToken' middleware
app.delete("/user/:id", verifyToken, async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_user'
    conn = await pool_user.getConnection();

    // Log a message to indicate that the route is processing a DELETE request for a user with a specific ID
    console.log("Request DELETE /user/:id");

    // Execute a SQL query to delete a user with the specified ID from the 'Utilisateur' table
    const rows = await conn.query("DELETE FROM Utilisateur WHERE id = ?", [
      req.params.id,
    ]);

    // Log the result of the delete operation to the console
    console.log(rows);

    // Respond to the client with a status code of 200 (OK) and the result of the delete operation
    res.status(200).json(rows);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error(err);
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

const secretKey = process.env.JWT_SECRET_KEY; // Recovering the secret key from an environment variable

// Define a route that listens for POST requests at the "/login" endpoint
app.post("/login", async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_user'
    conn = await pool_user.getConnection();

    // Execute a SQL query to retrieve user information based on the provided email
    const result = await conn.query(
      "SELECT * FROM Utilisateur WHERE email = ?",
      [req.body.email]
    );

    // Check if the user with the provided email exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Retrieve the user information from the query result
    const user = result[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(req.body.password, user.mdp);

    // If the passwords do not match, return an authentication error
    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Create a JWT token containing user information
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secretKey,
      { expiresIn: "10h" }
    );

    // Add the username, user ID, isAdmin status, and token to the response
    res.json({
      message: "Connexion réussie",
      userId: user.id,
      userName: user.nom,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Erreur lors de la connexion:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Erreur lors de la connexion" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// CARD PART

// Define a route that listens for GET requests at the "/cards" endpoint
app.get("/cards", async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_card'
    conn = await pool_card.getConnection();

    // Execute a SQL query to retrieve all rows from the 'Carte' table
    const rows = await conn.query("SELECT * FROM Carte");

    // Release the database connection after executing the query
    conn.release();

    // Respond to the client with a status code of 200 (OK) and the retrieved rows
    res.status(200).json(rows);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error(err);
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// Define a route that listens for GET requests at the "/cards/:id" endpoint
app.get("/cards/:id", async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_card'
    conn = await pool_card.getConnection();

    // Execute a SQL query to retrieve a specific row from the 'Carte' table based on the provided ID
    const rows = await conn.query("SELECT * FROM Carte WHERE id = ?", [
      req.params.id,
    ]);

    // Release the database connection after executing the query
    conn.release();

    // Respond to the client with a status code of 200 (OK) and the retrieved row(s)
    res.status(200).json(rows);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error(err);
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// Define a route that listens for POST requests at the "/cards" endpoint
app.post("/cards", async (req, res) => {
  let conn; // Declare a variable to hold the database connection

  try {
    // Attempt to get a connection from the 'pool_card'
    conn = await pool_card.getConnection();

    // Iterate over each card in the request body
    req.body.data.forEach(async (card) => {
      // Check if a card with the same cardId already exists in the 'Carte' table
      const result = await conn.query("SELECT * FROM Carte WHERE cardId = ?", [
        card.id,
      ]);

      // If the card does not exist, insert it into the database
      if (result.length === 0) {
        let query =
          "INSERT INTO Carte (name, `desc`, imageUrl, race, type, cardId";
        let values = "VALUES (?, ?, ?, ?, ?, ?";
        let array = [
          card.name,
          card.desc,
          card.card_images[0].image_url,
          card.race,
          card.type,
          card.id,
        ];

        // Check for additional properties and add them to the query if present
        if (card.card_prices[0].amazon_price != null) {
          query += ", amazonPrice";
          values += ", ?";
          array.push(card.card_prices[0].amazon_price);
        }
        if (card.card_prices[0].cardmarket_price != null) {
          query += ", cardmarketPrice";
          values += ", ?";
          array.push(card.card_prices[0].cardmarket_price);
        }
        if (card.card_prices[0].coolstuffinc_price != null) {
          query += ", coolstuffincPrice";
          values += ", ?";
          array.push(card.card_prices[0].coolstuffinc_price);
        }
        if (card.card_prices[0].ebay_price != null) {
          query += ", ebayPrice";
          values += ", ?";
          array.push(card.card_prices[0].ebay_price);
        }
        if (card.card_prices[0].tcgplayer_price != null) {
          query += ", tcgplayerPrice";
          values += ", ?";
          array.push(card.card_prices[0].tcgplayer_price);
        }
        if (card.archetype != null) {
          query += ", archetype";
          values += ", ?";
          array.push(card.archetype);
        }
        if (card.atk != null) {
          query += ", atk";
          values += ", ?";
          array.push(card.atk);
        }
        if (card.attribute != null) {
          query += ", `attribute`";
          values += ", ?";
          array.push(card.attribute);
        }
        if (card.def != null) {
          query += ", def";
          values += ", ?";
          array.push(card.def);
        }
        if (card.level != null) {
          query += ", level";
          values += ", ?";
          array.push(card.level);
        }

        query += ") ";
        values += ")";
        const finalQuery = query + values;

        // Execute the final insert query
        const resultInsert = await conn.query(finalQuery, array);
      }
    });

    // Respond to the client with a status code of 200 (OK) and a success message
    res.status(200).json("Success");
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.log("Erreur" + err);
    // Uncomment the line below if you want to send an error response to the client
    // res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// Define a route that listens for GET requests at the "/user/inventory" endpoint
app.get("/user/inventory", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Get the user ID from the token using a custom function (getUserIdFromToken)
    const userId = getUserIdFromToken(token);

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Select the user's inventory from the main database
      const inventoryQuery =
        "SELECT * FROM Inventaire WHERE utilisateur_id = ?";
      const inventoryResult = await conn.query(inventoryQuery, [userId]);

      // Select details of the cards from the cards database
      const cardDetailsQuery =
        "SELECT Carte.id, Carte.name, Carte.desc, Carte.imageUrl FROM projet.Carte WHERE Carte.id IN (?)";
      const cardIds = inventoryResult.map((item) => item.carte_id);
      const cardDetailsResult = await conn.query(cardDetailsQuery, [cardIds]);

      // Associate card details with the inventory
      const inventoryWithDetails = inventoryResult.map((inventoryItem) => {
        const matchingCard = cardDetailsResult.find(
          (card) => card.id === inventoryItem.carte_id
        );
        return {
          id: inventoryItem.id,
          utilisateur_id: inventoryItem.utilisateur_id,
          carte_id: inventoryItem.carte_id,
          quantite: inventoryItem.quantite,
          carte_details: matchingCard,
        };
      });

      // Respond to the client with a status code of 200 (OK) and the inventory with card details
      res.status(200).json(inventoryWithDetails);
    } finally {
      // Release the connection in the 'finally' block to ensure it happens regardless of success or failure
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error fetching user inventory:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ajoutez cette route pour gérer l'ajout des cartes à l'inventaire
app.post("/user/inventory/add", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = getUserIdFromToken(token);
    const { cart } = req.body;

    const conn = await pool_user.getConnection();

    try {
      // Boucle sur chaque carte du panier et ajoute-la à l'inventaire
      for (const cardId of cart) {
          const insertInventoryQuery =
            "INSERT INTO Inventaire (utilisateur_id, carte_id, quantite) VALUES (?, ?, 1)";
          await conn.query(insertInventoryQuery, [userId, cardId]);
      }

      res.status(200).json({ message: "Cartes ajoutées à l'inventaire avec succès" });
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Erreur lors de l'ajout des cartes à l'inventaire:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Define a route that listens for DELETE requests at the "/user/inventory/remove/:inventoryId" endpoint
app.delete("/user/inventory/remove/:inventoryId", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Get the user ID from the token using a custom function (getUserIdFromToken)
    const userId = getUserIdFromToken(token);

    // Get the inventory ID from the request parameters
    const inventoryId = req.params.inventoryId;

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Check if the inventory item exists and belongs to the user
      const checkOwnershipQuery =
        "SELECT utilisateur_id, carte_id FROM Inventaire WHERE id = ?";
      const checkOwnershipResult = await conn.query(checkOwnershipQuery, [
        inventoryId,
      ]);

      // If the inventory item does not exist or does not belong to the user, return a forbidden response
      if (
        checkOwnershipResult.length === 0 ||
        checkOwnershipResult[0].utilisateur_id !== userId
      ) {
        return res
          .status(403)
          .json({ error: "Forbidden: Invalid inventory item" });
      }

      // Delete the card from the inventory
      const deleteInventoryQuery = "DELETE FROM Inventaire WHERE id = ?";
      await conn.query(deleteInventoryQuery, [inventoryId]);

      // Delete the card from CardDeck
      const deleteCardDeckQuery = "DELETE FROM CarteDeck WHERE carte_id = ?";
      await conn.query(deleteCardDeckQuery, [checkOwnershipResult[0].carte_id]);

      // Respond to the client with a status code of 200 (OK) and a success message
      res
        .status(200)
        .json({ message: "Card removed from inventory successfully" });
    } finally {
      // Release the connection in the 'finally' block to ensure it happens regardless of success or failure
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error removing card from inventory:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route that listens for POST requests at the "/user/inventory/add" endpoint
app.post("/user/inventory/add", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Get the user ID from the token using a custom function (getUserIdFromToken)
    const userId = getUserIdFromToken(token);

    // Extract the necessary information from the request body
    const { carte_id, quantite } = req.body;

    // Validate the request body
    if (!carte_id || !quantite || isNaN(quantite) || quantite <= 0) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Check if the card exists
      const checkCardQuery = "SELECT id FROM projet.Carte WHERE id = ?";
      const checkCardResult = await conn.query(checkCardQuery, [carte_id]);

      // If the card does not exist, return a not found response
      if (checkCardResult.length === 0) {
        return res.status(404).json({ error: "Card not found" });
      }

      // Check if the user already has this card in their inventory
      const checkInventoryQuery =
        "SELECT id, quantite FROM Inventaire WHERE utilisateur_id = ? AND carte_id = ?";
      const checkInventoryResult = await conn.query(checkInventoryQuery, [
        userId,
        carte_id,
      ]);

      if (checkInventoryResult.length > 0) {
        // The card already exists in the inventory, update the quantity
        const updatedQuantite = checkInventoryResult[0].quantite + quantite;
        const updateInventoryQuery =
          "UPDATE Inventaire SET quantite = ? WHERE id = ?";
        await conn.query(updateInventoryQuery, [
          updatedQuantite,
          checkInventoryResult[0].id,
        ]);
      } else {
        // Add the card to the inventory
        const addInventoryQuery =
          "INSERT INTO Inventaire (utilisateur_id, carte_id, quantite) VALUES (?, ?, ?)";
        await conn.query(addInventoryQuery, [userId, carte_id, quantite]);
      }

      // Respond to the client with a status code of 200 (OK) and a success message
      res.status(200).json({ message: "Card added to inventory successfully" });
    } finally {
      // Release the connection in the 'finally' block to ensure it happens regardless of success or failure
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error adding card to inventory:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route that listens for GET requests at the "/user/decks/:deckId/cards" endpoint
app.get("/user/decks/:deckId/cards", async (req, res) => {
  // Extract the deckId and token from request parameters and headers
  const { deckId } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  console.log("token", token);

  // Use getUserIdFromToken to obtain the user ID
  const userId = getUserIdFromToken(token);

  // If the user ID is null, return an unauthorized response
  if (userId == null) {
    res.status(403).json({ error: "Unauthorized" });
    return null;
  }

  let conn; // Declare a variable to hold the database connection

  try {
    // Ensure that the database access logic is correct
    conn = await pool_user.getConnection();

    // Select the cards associated with the deck
    const cardsQuery = `
      SELECT Carte.id, Carte.name, Carte.desc, Carte.imageUrl
      FROM projetUser.CarteDeck
      JOIN projet.Carte ON CarteDeck.carte_id = Carte.id
      WHERE CarteDeck.deck_id = ?;
    `;

    const cardsResult = await conn.query(cardsQuery, [deckId]);

    // Respond to the client with a status code of 200 (OK) and the cards associated with the deck
    res.status(200).json(cardsResult);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error fetching deck cards:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// add a card to a deck
// Define a route that listens for POST requests at the "/user/decks/:deckId/:cardId" endpoint
app.post("/user/decks/:deckId/:cardId", async (req, res) => {
  // Extract the deckId, cardId, and token from request parameters and headers
  const { deckId, cardId } = req.params;
  console.log("lancement requete post ccarte Deck");
  console.log("deckID", deckId);
  console.log("card id", cardId);
  const token = req.headers.authorization.split(" ")[1];

  // Use getUserIdFromToken to obtain the user ID
  const userId = getUserIdFromToken(token);

  let conn; // Declare a variable to hold the database connection

  try {
    // Obtain a database connection
    conn = await pool_user.getConnection();

    // Verify that the deck belongs to the user
    const deckOwnershipQuery = `
      SELECT user_id FROM Deck WHERE id = ?;
    `;
    const deckOwnershipResult = await conn.query(deckOwnershipQuery, [deckId]);

    // If the deck doesn't belong to the user, return an unauthorized response
    if (
      deckOwnershipResult.length === 0 ||
      deckOwnershipResult[0].user_id !== userId
    ) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    // Insert the card into the deck
    const cardsQuery = `
      INSERT INTO CarteDeck (deck_id, carte_id)
      VALUES (?, ?);
    `;

    const cardsResult = await conn.query(cardsQuery, [deckId, cardId]);

    // Serialize the result for response
    const serializedResult = Array.isArray(cardsResult)
      ? cardsResult.map((row) => ({
          deck_id: Number(row.deck_id),
          carte_id: Number(row.carte_id),
        }))
      : null;

    // Respond to the client with a status code of 200 (OK) and the serialized result
    res.status(200).json(serializedResult);
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error adding card to deck:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// Remove a card from a deck by ID
// Define a route that listens for DELETE requests at the "/user/decks/:deckId/cards/:cardId" endpoint
app.delete("/user/decks/:deckId/cards/:cardId", async (req, res) => {
  // Extract the deckId, cardId, and token from request parameters and headers
  const { deckId, cardId } = req.params;
  const token = req.headers.authorization.split(" ")[1];

  console.log("userID", userId);
  console.log("deckID", deckId);
  console.log("card id", cardId);

  // Use getUserIdFromToken to obtain the user ID
  const userId = getUserIdFromToken(token);

  let conn; // Declare a variable to hold the database connection

  try {
    // Obtain a database connection
    conn = await pool_user.getConnection();

    // Verify that the deck belongs to the user
    const deckOwnershipQuery = `
      SELECT user_id FROM Deck WHERE id = ?;
    `;
    const deckOwnershipResult = await conn.query(deckOwnershipQuery, [deckId]);

    // If the deck doesn't belong to the user, return an unauthorized response
    if (
      deckOwnershipResult.length === 0 ||
      deckOwnershipResult[0].user_id !== userId
    ) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    // Delete the specific card from the deck
    const deleteCardQuery = `
      DELETE FROM CarteDeck
      WHERE deck_id = ? AND carte_id = ?;
    `;
    await conn.query(deleteCardQuery, [deckId, cardId]);

    // Respond to the client with a status code of 200 (OK) and a success message
    res.status(200).json({ message: "Card deleted from deck successfully" });
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error deleting card from deck:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the database connection in the 'finally' block to ensure it happens regardless of success or failure
    if (conn) conn.release();
  }
});

// verifyToken checks if user is admin
// Define a route that listens for GET requests at the "/user/decks" endpoint, with token verification middleware
app.get("/user/decks", async (req, res) => {
  try {
    // Obtain the user ID from the token using the getUserIdFromToken function
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Select all decks belonging to the user from the main database
      const decksQuery = "SELECT * FROM Deck WHERE user_id = ?";
      const decksResult = await conn.query(decksQuery, [userId]);

      // Respond to the client with a status code of 200 (OK) and the user's decks
      res.status(200).json(decksResult);
    } finally {
      // Ensure to release the connection after use in the 'finally' block
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error fetching user decks:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add a deck to a user
// Define a route that listens for POST requests at the "/user/decks" endpoint
app.post("/user/decks", async (req, res) => {
  try {
    // Obtain the user ID from the token using the getUserIdFromToken function
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Insert a new deck for the user into the main database
      const decksQuery = "INSERT INTO Deck (name, user_id) VALUES (?, ?)";
      const decksResult = await conn.query(decksQuery, [req.body.name, userId]);

      // Retrieve the ID of the last inserted deck
      const newDeckId = Number(decksResult.insertId);
      console.log("ID du nouveau deck:", newDeckId);

      // Respond to the client with a status code of 200 (OK) and the ID of the new deck
      res.status(200).json({ id: newDeckId });
    } finally {
      // Ensure to release the connection after use in the 'finally' block
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error fetching user decks:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a deck by ID
// verifyToken checks if user is admin
// Define a route that listens for DELETE requests at the "/user/decks/:deckId" endpoint, with token verification middleware
app.delete("/user/decks/:deckId", verifyToken, async (req, res) => {
  try {
    // Obtain the user ID and deck ID from the token and request parameters
    const userId = getUserIdFromToken(req.headers.authorization.split(" ")[1]);
    const deckId = req.params.deckId;

    // Use a single connection for the entire transaction
    const conn = await pool_user.getConnection();

    try {
      // Verify if the deck belongs to the user
      const checkOwnershipQuery =
        "SELECT * FROM Deck WHERE id = ? AND user_id = ?";
      const checkOwnershipResult = await conn.query(checkOwnershipQuery, [
        deckId,
        userId,
      ]);

      // If the deck doesn't belong to the user, return a forbidden response
      if (checkOwnershipResult.length === 0) {
        return res
          .status(403)
          .json({ error: "Forbidden: Deck does not belong to the user" });
      }

      // Delete the deck from the database
      const deleteDeckQuery = "DELETE FROM Deck WHERE id = ?";
      await conn.query(deleteDeckQuery, [deckId]);

      // Respond to the client with a status code of 200 (OK) and a success message
      res.status(200).json({ message: "Deck deleted successfully" });
    } finally {
      // Ensure to release the connection after use in the 'finally' block
      if (conn) conn.release();
    }
  } catch (err) {
    // Handle any errors that may occur during the execution of the try block
    console.error("Error deleting user deck:", err);

    // Respond to the client with an error status and message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route that listens for GET requests at the "/cards/search/:name/:type/:minprice/:maxprice/:shop/:rarity/:order/:terms" endpoint
app.get(
  "/cards/search/:name/:type/:minprice/:maxprice/:shop/:rarity/:order/:terms",
  async (req, res) => {
    try {
      // Establish a database connection
      let conn = await pool_card.getConnection();

      // Initialize the SQL query and parameters
      let query = "SELECT * FROM Carte ";
      let params = [];
      let bool = false;
      let terms = "";

      // Check if there is a specified card type
      if (req.params.type != "default") {
        if (bool) {
          query += "AND type LIKE ? ";
        } else {
          query += "WHERE type LIKE ? ";
          bool = true;
        }
        params.push("%" + req.params.type + "%");
      }

      // Check if there is a specified rarity
      if (req.params.rarity != "default") {
        if (bool) {
          query += "AND rarity LIKE ? ";
        } else {
          query += "WHERE rarity LIKE ? ";
          bool = true;
        }
        params.push("%" + req.params.rarity + "%");
      }

      // Check if there are search terms
      if (req.params.terms != "nosearch") {
        if (bool) {
          query += "AND (name LIKE ? OR `desc` LIKE ?) ";
        } else {
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

      // Get shop and price information
      if (bool) {
        if (req.params.shop == "amazonPrice") {
          query += "AND amazonPrice >= ? AND amazonPrice <= ? ";
        } else if (req.params.shop == "cardmarketPrice") {
          query += "AND cardmarketPrice >= ? AND cardmarketPrice <= ? ";
        } else if (req.params.shop == "coolstuffincPrice") {
          query += "AND coolstuffincPrice >= ? AND coolstuffincPrice <= ? ";
        } else if (req.params.shop == "ebayPrice") {
          query += "AND ebayPrice >= ? AND ebayPrice <= ? ";
        } else if (req.params.shop == "tcgplayerPrice") {
          query += "AND tcgplayerPrice >= ? AND tcgplayerPrice <= ? ";
        }
      } else {
        if (req.params.shop == "amazonPrice") {
          query += "WHERE amazonPrice >= ? AND amazonPrice <= ? ";
          bool = true;
        } else if (req.params.shop == "cardmarketPrice") {
          query += "WHERE cardmarketPrice >= ? AND cardmarketPrice <= ? ";
          bool = true;
        } else if (req.params.shop == "coolstuffincPrice") {
          query += "WHERE coolstuffincPrice >= ? AND coolstuffincPrice <= ? ";
          bool = true;
        } else if (req.params.shop == "ebayPrice") {
          query += "WHERE ebayPrice >= ? AND ebayPrice <= ? ";
          bool = true;
        } else if (req.params.shop == "tcgplayerPrice") {
          query += "WHERE tcgplayerPrice >= ? AND tcgplayerPrice <= ? ";
          bool = true;
        }
      }
      params.push(req.params.maxprice);
      params.push(req.params.minprice);

      // Check if there is a specified name
      if (req.params.name != "false") {
        if (bool) {
          query += "AND name LIKE ? ";
        } else {
          query += "WHERE name LIKE ? ";
          bool = true;
        }
        params.push("%" + terms + "%");
      }

      // Specify the order of the results
      query += "ORDER BY name " + req.params.order;

      // Execute the query and release the connection
      const rows = await conn.query(query, params);
      conn.release();

      // Respond to the client with a status code of 200 (OK) and the query results
      res.status(200).json(rows);
    } catch (err) {
      // Handle any errors that may occur during the execution of the try block
      console.log("Erreur " + err);
    }
  }
);

// Start the server and make it listen on port 3001
app.listen(3001, () => {
  // Log a message to the console when the server is successfully listening
  console.log("Server is listening");
});
