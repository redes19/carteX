<?php

// Connexion à la base de données avec PDO
try {
    $hote = "91.134.89.49";
    $utilisateur = "projet";
    $motDePasse = "c!dW3u6QC)cAr[x-C63z*299C,8cS~";
    $nomDeLaBase = "projet";
    $port = "3306";

    // Création d'une instance de PDO pour la connexion à la BDD
    $pdo = new PDO("mysql:host=$hote;dbname=$nomDeLaBase;port=$port", $utilisateur, $motDePasse);

    // Configuration de PDO pour générer des exceptions en cas d'erreur
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En cas d'erreur de connexion, affiche un message d'erreur et arrête le script
    echo "Erreur de connexion à la base de données: " . $e->getMessage();
    die();
}
?>