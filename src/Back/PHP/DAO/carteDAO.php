<?php

require_once '../Class/carte.php';

class CarteDAO {
    private $pdo;

    // Constructor to initialize the PDO object
    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    // Method to retrieve all cartes from the database
    public function getCartes(){
        $cartes = array();
    
        // SQL query to select all columns from the Carte table
        $query = "SELECT * FROM Carte";
        
        // Execute the query
        $result = $this->pdo->query($query);
    
        // Loop through the result set and create Carte objects
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $carte = new Carte(
                $row['id'],
                $row['name'],
                $row['desc'],
                $row['imageUrl'],
                $row['race'],
                $row['type'],
                $row['cardId']
            );
    
            // Add the Carte object to the $cartes array
            $cartes[] = $carte;
        }
    
        // Return the array of Carte objects
        return $cartes;
    }
    

    public function getCarteById($id){
        // Prepare a SQL statement with a named parameter
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE id = :id");
        
        // Bind the parameter ':id' to the provided $id
        $stmt->bindParam(':id', $id);
        
        // Execute the prepared statement
        $stmt->execute();
        
        // Fetch the result as an associative array
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Check if a result was obtained
        if ($result) {
            // If a result exists, create a new Carte object
            $carte = new Carte(
                $result['id'],
                $result['name'],
                $result['desc'],
                $result['imageUrl'],
                $result['race'],
                $result['type'],
                $result['cardId']
            );
            
            // Return the Carte object
            return $carte;
        } else {
            // If no result is found, return null
            return null; 
        }
    }
     
    
    public function getCarteIdByName($carteName){
        // Prepare a SQL statement with a named parameter
        $stmt = $this->pdo->prepare("SELECT id FROM Carte WHERE name = :name");
        
        // Bind the parameter ':name' to the provided $carteName
        $stmt->bindParam(':name', $carteName);
        
        // Execute the prepared statement
        $stmt->execute();
        
        // Fetch the result as an associative array
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Check if a result was obtained
        if ($result) {
            // If a result exists, return the 'id' value
            return $result['id'];
        } else {
            // If no result is found, return null
            return null;
        }
    }
    

    public function getCarteIdByCardId($cardId){
        // Prepare a SQL statement with a named parameter
        $stmt = $this->pdo->prepare("SELECT id FROM Carte WHERE cardId = :cardId");
        
        // Bind the parameter ':cardId' to the provided $cardId
        $stmt->bindParam(':cardId', $cardId);
        
        // Execute the prepared statement
        $stmt->execute();
        
        // Fetch the result as an associative array
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Check if a result was obtained
        if ($result) {
            // If a result exists, return the 'id' value
            return $result['id'];
        } else {
            // If no result is found, return null
            return null;
        }
    }
    
    

    public function addCarte(Carte $card){        
        // Define the base query and values for insertion
        $query = "INSERT INTO Carte (name, `desc`, imageUrl, race, type, cardId";
        $values = "VALUES (?, ?, ?, ?, ?, ?";
        $array = [
            $card->getName(), 
            $card->getDesc(),
            $card->getImageUrl(),
            $card->getRace(),
            $card->getType(),
            $card->getCardId(),
        ];
    
        // Check and add optional attributes and prices
        if($card->getAmazonPrice() != null){
            $query .= ", amazonPrice";
            $values .= ", ?";
            array_push($array, $card->getAmazonPrice());
        }
        if($card->getCardmarketPrice() != null){
            $query .= ", cardmarketPrice";
            $values .= ", ?";
            array_push($array, $card->getCardmarketPrice());
        }
        if($card->getCoolstuffincPrice() != null){
            $query .= ", coolstuffincPrice";
            $values .= ", ?";
            array_push($array, $card->getCoolstuffincPrice());
        }
        if($card->getEbayPrice() != null){
            $query .= ", ebayPrice";
            $values .= ", ?";
            array_push($array, $card->getEbayPrice());
        }
        if($card->getTcgplayerPrice() != null){
            $query .= ", tcgplayerPrice";
            $values .= ", ?";
            array_push($array, $card->getTcgplayerPrice());
        }
        if($card->getArchetype() != null){
            $query .= ", archetype";
            $values .= ", ?";
            array_push($array, $card->getArchetype());
        }
        if($card->getAtk() != null){
            $query .= ", atk";
            $values .= ", ?";
            array_push($array, $card->getAtk());
        }
        if($card->getAttribute() != null){
            $query .= ", `attribute`";
            $values .= ", ?";
            array_push($array, $card->getAttribute());
        }
        if($card->getDef() != null){
            $query .= ", def";
            $values .= ", ?";
            array_push($array, $card->getDef());
        }
        if($card->getLevel() != null){
            $query .= ", level";
            $values .= ", ?";
            array_push($array, $card->getLevel());
        }
    
        // Complete the query and values
        $query .= ") ";
        $values .= ")";
        $finalQuery = $query . $values;
    
        // Get the PDO connection
        $conn = $this->pdo;
    
        // Prepare and execute the query with the provided values
        $resultInsert = $conn->prepare($finalQuery);
        $resultInsert->execute($array);
        
        // Check the result of the insertion
        if ($resultInsert) {
            return true; // Insertion successful
        } else {
            return false; // Insertion failed
        }
    }
    

    public function updateCarte(Carte $card){
        $query = "UPDATE Carte SET `desc` = ? , imageUrl = ? , race = ? , `type` = ? , cardId = ? ";
        $array = [
          $card->getDesc(),
          $card->getImageUrl(),
          $card->getRace(),
          $card->getType(),
          $card->getCardId(),
            ];
        
        if($card->getAmazonPrice() != null){
            $query .= ", amazonPrice = ? ";
            array_push($array, $card->getAmazonPrice());
        }
        if($card->getCardmarketPrice() != null){
            $query .= ", cardmarketPrice = ? ";
            array_push($array, $card->getCardmarketPrice());
        }
        if($card->getCoolstuffincPrice() != null){
            $query .= ", coolstuffincPrice = ? ";
            array_push($array, $card->getCoolstuffincPrice());
        }
        if($card->getEbayPrice() != null){
            $query .= ", ebayPrice = ? ";
            array_push($array, $card->getEbayPrice());
        }
        if($card->getTcgplayerPrice() != null){
            $query .= ", tcgplayerPrice = ? ";
            array_push($array, $card->getTcgplayerPrice());
        }
        if($card->getArchetype() != null){
            $query .= ", archetype = ? ";
            array_push($array, $card->getArchetype());
        }
        if($card->getAtk() != null){
            $query .= ", atk = ? ";
            array_push($array, $card->getAtk());
        }
        if($card->getAttribute() != null){
            $query .= ", `attribute` = ? ";
            array_push($array, $card->getAttribute());
        }
        if($card->getDef() != null){
            $query .= ", def = ? ";
            array_push($array, $card->getDef());
        }
        if($card->getLevel() != null){
            $query .= ", level = ? ";
            array_push($array, $card->getLevel());
        }

        array_push($array, $card->getId());

        $query .= " WHERE id = ? ";

        $conn = $this->pdo;

        $resultInsert = $conn->prepare($query);
        $resultInsert->execute($array);
        
        if ($resultInsert) {
            return true;
        } else {
            return false;
        }
    }
    

    public function deleteCarte(Carte $carte){


        // Extract the ID from the provided Carte object
        $id = $carte->getId();
    
        // Prepare the DELETE query
        $stmt = $this->pdo->prepare("DELETE FROM Carte WHERE id = :id");
    
        // Bind the ID parameter
        $stmt->bindParam(':id', $id);
        
        // Execute the query
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteCarteById($id){
    
        $stmt = $this->pdo->prepare("DELETE FROM Carte WHERE id = :id");
    
        $stmt->bindParam(':id', $id);
        
        // Exécution de la requête
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

}



?>