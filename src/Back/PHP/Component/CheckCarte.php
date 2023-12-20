<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php'; 

if (isset($_POST["cardName"])) {
    $cardName = $_POST["cardName"];

    $carteDAO = new CarteDAO($pdo);
    
    // Vérifiez si la carte existe déjà dans la base de données
    $carte = $carteDAO->getCarteById($cardName);

    if ($carte !== null) {
        // La carte existe déjà
        echo json_encode(array('exists' => true));
    } else {
        // La carte n'existe pas
        echo json_encode(array('exists' => false));
    }
}

?>
