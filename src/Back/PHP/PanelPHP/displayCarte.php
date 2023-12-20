
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire d'affichage des cartes</title>
    <link href="carteX/src/Back/PHP/style.css">
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


$carteInstance = new CarteDAO($pdo); 

// Récupérer les cartes
$cartes = $carteInstance->getCartes();

// Vérifier si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données du formulaire
    $id = $_POST['carteId'];
    $name = $_POST['name'];
    $desc = $_POST['desc'];
    $imageUrl = $_POST['imageUrl'];
    $race = $_POST['race'];
    $type = $_POST['type'];
    $cardId = $_POST['cardId'];

    // Créer une instance de la classe Carte
    $carte = new Carte($id, $name, $desc, $imageUrl, $race, $type, $cardId);

    $carteInstance = new CarteDAO($pdo); 

    // Mettre à jour la carte
    $carteInstance->updateCarte($carte);

    echo "<p>La carte a été mise à jour avec succès.</p>";
}

// Vérifier si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer le nom de la carte à supprimer depuis le formulaire
    $carteName = $_POST['carteName'];


    $carteInstance = new CarteDAO($pdo); 

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

// Vérifier si des cartes sont disponibles
if (!empty($cartes)) {
    foreach ($cartes as $carte) {
        // Afficher les informations de la carte dans le formulaire
        ?>
            <div class="carte">
                <!-- <h2><?php echo $carte->getName(); ?></h2>
                <p><strong>ID :</strong> <?php echo $carte->getId(); ?></p>
                <p><strong>Description :</strong> <?php echo $carte->getDesc(); ?></p>
                <p><strong>Image URL :</strong> <?php echo $carte->getImageUrl(); ?></p>
                <p><strong>Race :</strong> <?php echo $carte->getRace(); ?></p>
                <p><strong>Type :</strong> <?php echo $carte->getType(); ?></p>
                <p><strong>Card ID :</strong> <?php echo $carte->getCardId(); ?></p> -->
                <img class="image" src="<?php echo $carte->getImageUrl(); ?>" alt="<?php echo $carte->getName(); ?>" />
                <!-- Formulaire de modification de carte -->
                <form method="post" action="UpdateCarte.php">
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

                    <label>Nouvel ID de la carte:</label>
                    <input type="text" name="cardId" required><br>

                    <input type="submit" value="Modifier la carte">
                </form>
                <!-- Formulaire de suppression de carte par nom -->
                <form method="post" action="">
                    <label>Nom de la carte à supprimer:</label>
                    <input type="text" name="carteName" required><br>

                    <input type="submit" value="Supprimer la carte">
                </form>
            </div>
        <hr>
        <?php

        
    }
    
} else {
    echo "<p>Aucune carte disponible.</p>";
}
?>


</body>
</html>



