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
// Check if the "checkName" parameter is set in the POST request
if (isset($_POST["checkName"])) {
    // Get the value of "checkName" from the POST data
    $checkName = $_POST["checkName"];

    // Create an instance of the CarteDAO class, assuming it's defined and accessible
    $carteDAO = new CarteDAO($pdo);
    
    // Check if the card with the specified name exists in the database
    $carte = $carteDAO->getCarteIdByName($checkName);

    // Respond with JSON based on whether the card exists or not
    if ($carte !== null) {
        // The card exists
        echo json_encode(array('exists' => true));
    } else {
        // The card doesn't exist
        echo json_encode(array('exists' => false));
    }
}


// CHECK CARD ID    
// Check if the "checkCardId" parameter is set in the POST request
if (isset($_POST["checkCardId"])) {
    // Get the value of "checkCardId" from the POST data
    $checkCardId = $_POST["checkCardId"];

    // Create an instance of the CarteDAO class, assuming it's defined and accessible
    $carteDAO = new CarteDAO($pdo);
    
    // Check if the card with the specified card ID exists in the database
    $carte = $carteDAO->getCarteIdByCardId($checkCardId);

    // Respond with JSON based on whether the card exists or not
    if ($carte !== null) {
        // The card exists
        echo json_encode(array('exists' => true));
    } else {
        // The card doesn't exist
        echo json_encode(array('exists' => false));
    }
}



?>
