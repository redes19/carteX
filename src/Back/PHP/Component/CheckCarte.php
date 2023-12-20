<?php

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php'; 

if (isset($_GET["cardId"])) {
    $cardId = $_GET["cardId"];

    $carteDAO = new CarteDAO($pdo);
    
    // Vérifiez si la carte existe déjà dans la base de données
    $carte = $carteDAO->getCarteById($cardId);

    if ($carte !== null) {
        // La carte existe déjà
        echo json_encode(array('exists' => true));
    } else {
        // La carte n'existe pas
        echo json_encode(array('exists' => false));
    }
}

?>
