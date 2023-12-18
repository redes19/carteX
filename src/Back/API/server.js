const express = require("express"); // récupération express
const app = express(); // variable utilisant la librairie express
const bcrypt = require("bcrypt");
let cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: process.env.DB_HOST_PROJECTUSER,
  user: process.env.DB_USER_PROJECTUSER,
  password: process.env.DB_PWD_PROJECTUSER,
  database: process.env.DB_DTB_PROJECTUSER,
});



app.get("/Utilisateurs", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("lancement");
        const rows = await conn.query("SELECT * FROM Utilisateurs");
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
    }
});



app.post("/Utilisateurs", async (req, res) => {
    let conn;
    
    try {
        conn = await pool.getConnection();
        console.log("lancement requete");
        // Vérifiez si l'email existe déjà
        const result = await conn.query("SELECT * FROM Utilisateurs WHERE Email = ?", [
            req.body.email,
        ]);
        console.log("email", req.body.email);
        if (result.length > 0) {
            // L'email existe déjà, renvoyer une réponse appropriée
            return res.status(400).json({ error: "Cet email existe déjà" });
        }
        console.log("mdp");
        // L'email n'existe pas, procéder à l'insertion
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const query =
        "INSERT INTO Utilisateurs (Email, Mdp, Prenom, Nom) VALUES (?, ?, ?,?)";
        
        const resultInsert = await conn.query(query, [
            req.body.email,
            hashedPassword,
            req.body.first_name,
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
      conn = await pool.getConnection();
  
      const result = await conn.query("SELECT * FROM Utilisateurs WHERE email = ?", [
        req.body.email,
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      const user = result[0];
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!passwordMatch) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }
  
      // Ajouter le nom d'utilisateur à la réponse
      res.json({
        message: "Connexion réussie",
        userId: user.id,
        userName: user.first_name,
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