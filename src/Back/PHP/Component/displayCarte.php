
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire d'affichage des cartes</title>
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


$carteInstance = new CarteDAO(); 

// Récupérer les cartes
$cartes = $carteInstance->getCartes();

// Vérifier si des cartes sont disponibles
if (!empty($cartes)) {
    foreach ($cartes as $carte) {
        // Afficher les informations de la carte dans le formulaire
        ?>
        <div>
            <h2><?php echo $carte->getName(); ?></h2>
            <p><strong>ID :</strong> <?php echo $carte->getId(); ?></p>
            <p><strong>Name :</strong> <?php echo $carte->getName(); ?></p>
            <p><strong>Description :</strong> <?php echo $carte->getDesc(); ?></p>
            <p><strong>Image URL :</strong> <?php echo $carte->getImageUrl(); ?></p>
            <p><strong>Race :</strong> <?php echo $carte->getRace(); ?></p>
            <p><strong>Type :</strong> <?php echo $carte->getType(); ?></p>
            <p><strong>Frame Type :</strong> <?php echo $carte->getFrameType(); ?></p>
            <p><strong>Card ID :</strong> <?php echo $carte->getCardId(); ?></p>
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



