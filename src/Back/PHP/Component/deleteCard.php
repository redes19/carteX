<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include DAO & connection
require_once '../config.php';  
require_once '../DAO/carteDAO.php';


// SUBMIT CARD
if (isset($_POST["id"])) {
    $id = $_POST["id"];
    
    $carteDAO = new CarteDAO($pdo);  
    $idToDelete = $carteDAO->deleteCarteById($id);

    $deleted = $carteDAO->getCarteById($id);

    if($deleted === null) {
        echo json_encode(array('deleted' => $deleted));
    }
}
?>
