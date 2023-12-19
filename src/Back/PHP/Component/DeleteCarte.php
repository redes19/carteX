<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supprimer une Carte</title>
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
    // Récupérer le nom de la carte à supprimer depuis le formulaire
    $carteName = $_POST['carteName'];


    $carteInstance = new CarteDAO(); 

    // Rechercher l'ID de la carte par le nom
    $carteId = $carteInstance->getCarteIdByName($carteName);

    if ($carteId !== null) {
        // Créer une instance de la classe Carte
        $carte = new Carte($carteId, '', '', '', '', '', '', '');

        // Supprimer la carte
        if ($carteInstance->deleteCarte($carte)) {
            echo "<p>La carte a été supprimée avec succès.</p>";
        } else {
            echo "<p>Une erreur est survenue lors de la suppression de la carte.</p>";
        }
    } else {
        echo "<p>La carte avec le nom spécifié n'a pas été trouvée.</p>";
    }
}
?>

<!-- Formulaire de suppression de carte par nom -->
<form method="post" action="">
    <label>Nom de la carte à supprimer:</label>
    <input type="text" name="carteName" required><br>

    <input type="submit" value="Supprimer la carte">
</form>



</body>
</html>
