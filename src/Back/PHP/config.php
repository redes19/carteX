<?php

// Connection to the database using PDO
try {
    // Database connection parameters
    $host = "91.134.89.49";
    $username = "projet";
    $password = "c!dW3u6QC)cAr[x-C63z*299C,8cS~";
    $databaseName = "projet";
    $port = "3306";

    // Creating a PDO instance for connecting to the database
    $pdo = new PDO("mysql:host=$host;dbname=$databaseName;port=$port", $username, $password);

    // Configuring PDO to throw exceptions on errors
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // In case of a connection error, display an error message and terminate the script
    echo "Database connection error: " . $e->getMessage();
    die();
}

?>