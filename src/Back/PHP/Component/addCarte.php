<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php'; 

if (isset($_POST["name"])) {
    $name = $_POST["name"];

    // $carteDAO = new CarteDAO($pdo);  
    // $categories = $carteDAO->addCarte();

    echo json_encode(array('name' => $name));
}
// CHECK CARD NAME
if (isset($_POST["checkName"])) {
    $checkName = $_POST["checkName"];

    $carteDAO = new CarteDAO($pdo);
    
    // Vérifiez si la carte existe déjà dans la base de données
    $carte = $carteDAO->getCarteIdByName($checkName);

    if ($carte !== null) {
        // La carte existe déjà
        echo json_encode(array('exists' => true));
    } else {
        // La carte n'existe pas
        echo json_encode(array('exists' => false));
    }
}

// CHECK CARD ID    
if (isset($_POST["checkCardId"])) {
    $checkCardId = $_POST["checkCardId"];

    $carteDAO = new CarteDAO($pdo);
    
    // Vérifiez si la carte existe déjà dans la base de données
    $carte = $carteDAO->getCarteIdByCardId($checkCardId);

    if ($carte !== null) {
        // La carte existe déjà
        echo json_encode(array('exists' => true));
    } else {
        // La carte n'existe pas
        echo json_encode(array('exists' => false));
    }
}


?>
