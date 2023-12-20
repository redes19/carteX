<?php
// Include DAO & connection
require_once './config.php';  
require_once './DAO/carteDAO.php'; 

if (isset($_POST["name"])) {
    $name = $_POST["name"];

    $carteDAO = new CarteDAO($pdo);  
    $categories = $carteDAO->addCarte();

    echo json_encode(array('name' => $name));
}
?>
