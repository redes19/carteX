<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php';


// SUBMIT CARD
if (isset($_POST["modifyCard"])) {
    $modifyCard = $_POST["modifyCard"];
    // GOTTA CHECK HERE EVERY VALUE GIVEN BY SUBMIT CARD - IF BAD, SEND ERROR, ELSE CONTINUE

    if($modifyCard['archetype'] === '') {
        $modifyCard['archetype'] = null;
    }
    if($modifyCard['atk'] === '') {
        $modifyCard['atk'] = null;
    }
    if($modifyCard['attribute'] === '') {
        $modifyCard['attribute'] = null;
    }
    if($modifyCard['def'] === '') {
        $modifyCard['def'] = null;
    }
    if($modifyCard['level'] === '') {
        $modifyCard['level'] = null;
    }
    
    $carte = new Carte ($modifyCard['name'], $modifyCard['desc'], $modifyCard['imageUrl'], 
                        $modifyCard['race'], $modifyCard['type'], $modifyCard['cardId'], 
                        $modifyCard['amazonPrice'], $modifyCard['cardmarketPrice'], $modifyCard['coolstuffincPrice'], 
                        $modifyCard['ebayPrice'], $modifyCard['tcgplayerPrice'], $modifyCard['archetype'], $modifyCard['atk'], 
                        $modifyCard['attribute'], $modifyCard['def'], $modifyCard['level']);

    
    $carte->setId($modifyCard['id']);

    $carteDAO = new CarteDAO($pdo);  
    $modifyCardToDB = $carteDAO->updateCarte($carte);

    echo json_encode(array('modifyCard' => "réussi"));
}
?>
