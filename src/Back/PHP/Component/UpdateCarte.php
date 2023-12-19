<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier une Carte</title>
</head>
<body>

<?php
// Inclure votre classe Carte ici
include '../Class/Carte.php'; 
include '../config.php';
include '../DAO/carteDAO.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Vérifier si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données du formulaire
    $id = $_POST['carteId'];
    $name = $_POST['name'];
    $desc = $_POST['desc'];
    $imageUrl = $_POST['imageUrl'];
    $race = $_POST['race'];
    $type = $_POST['type'];
    $frameType = $_POST['frameType'];
    $cardId = $_POST['cardId'];

    // Créer une instance de la classe Carte
    $carte = new Carte($id, $name, $desc, $imageUrl, $race, $type, $frameType, $cardId);

    $carteInstance = new CarteDAO(); 

    // Mettre à jour la carte
    $carteInstance->updateCarte($carte);

    echo "<p>La carte a été mise à jour avec succès.</p>";
}
?>

<!-- Formulaire de modification de carte -->
<form method="post" action="">
    <label>ID de la carte à modifier:</label>
    <input type="text" name="carteId" required><br>

    <label>Nouveau nom de la carte:</label>
    <input type="text" name="name" required><br>

    <label>Nouvelle description:</label>
    <textarea name="desc" required></textarea><br>

    <label>Nouvelle URL de l'image:</label>
    <input type="text" name="imageUrl" required><br>

    <label>Nouvelle race:</label>
    <input type="text" name="race" required><br>

    <label>Nouveau type:</label>
    <input type="text" name="type" required><br>

    <label>Nouveau type de cadre:</label>
    <input type="text" name="frameType" required><br>

    <label>Nouvel ID de la carte:</label>
    <input type="text" name="cardId" required><br>

    <input type="submit" value="Modifier la carte">
</form>

</body>
</html>
