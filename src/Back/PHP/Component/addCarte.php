<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php'; 
require_once '../Class/carte.php';


// SUBMIT CARD
if (isset($_POST["submitCard"])) {
    $submitCard = $_POST["submitCard"];

    // GOTTA CHECK HERE EVERY VALUE GIVEN BY SUBMIT CARD - IF BAD, SEND ERROR, ELSE CONTINUE

    if($submitCard['archetype'] === '') {
        $submitCard['archetype'] = null;
    }
    if($submitCard['atk'] === '') {
        $submitCard['atk'] = null;
    }
    if($submitCard['attribute'] === '') {
        $submitCard['attribute'] = null;
    }
    if($submitCard['def'] === '') {
        $submitCard['def'] = null;
    }
    if($submitCard['level'] === '') {
        $submitCard['level'] = null;
    }
    
    $carte = new Carte ($submitCard['name'], $submitCard['desc'], $submitCard['imageUrl'], 
                        $submitCard['race'], $submitCard['type'], $submitCard['cardId'], 
                        $submitCard['amazonPrice'], $submitCard['cardmarketPrice'], $submitCard['coolstuffincPrice'], 
                        $submitCard['ebayPrice'], $submitCard['tcgplayerPrice'], $submitCard['archetype'], $submitCard['atk'], 
                        $submitCard['attribute'], $submitCard['def'], $submitCard['level']);

    $carteDAO = new CarteDAO($pdo);  
    $submitCardToDB = $carteDAO->addCarte($carte);

    echo json_encode(array('submitCard' => $carte->getName()));
    // echo json_encode(array('submitCard' => $submitCard));
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
