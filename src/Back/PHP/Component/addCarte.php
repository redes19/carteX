<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter une Carte</title>
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
    $name = $_POST['name'];
    $desc = $_POST['desc'];
    $imageUrl = $_POST['imageUrl'];
    $race = $_POST['race'];
    $type = $_POST['type'];
    $frameType = $_POST['frameType'];
    $cardId = $_POST['cardId'];

    // Créer une instance de la classe Carte
    $carte = new Carte(null, $name, $desc, $imageUrl, $race, $type, $frameType, $cardId);


    $carteInstance = new CarteDAO($pdo); 

    // Ajouter la carte
    if ($carteInstance->addCarte($carte)) {
        echo "<p>La carte a été ajoutée avec succès.</p>";
    } else {
        echo "<p>Une erreur est survenue lors de l'ajout de la carte.</p>";
    }
}
?>

<!-- Formulaire d'ajout de carte -->
<form method="post" action="">
    <label>Nom de la carte:</label>
    <input type="text" name="name" required><br>

    <label>Description:</label>
    <textarea name="desc" required></textarea><br>

    <label>URL de l'image:</label>
    <input type="text" name="imageUrl" required><br>

    <label>Race:</label>
    <input type="text" name="race" required><br>

    <label>Type:</label>
    <input type="text" name="type" required><br>

    <label>Type de cadre:</label>
    <input type="text" name="frameType" required><br>

    <label>ID de la carte:</label>
    <input type="text" name="cardId" required><br>

    <input type="submit" value="Ajouter la carte">
</form>

</body>
</html>
