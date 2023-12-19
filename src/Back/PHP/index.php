<?php

require_once './config.php';
require_once './DAO/carteDAO.php';

// Définis des entêtes pour permettre l'accès depuis différentes origines (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');



?>