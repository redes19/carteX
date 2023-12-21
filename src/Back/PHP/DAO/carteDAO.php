<?php

require_once '../Class/carte.php';

class CarteDAO {
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function getCartes(){
        $cartes = array();
    
        $query = "SELECT * FROM Carte";
        $result = $this->pdo->query($query);
    
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
    
            $cartes[] = $carte;
        }
    
        return $cartes;
    }
    

    public function getCarteById($id){
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            $carte = new Carte(
                $result['id'],
                $result['name'],
                $result['desc'],
                $result['imageUrl'],
                $result['race'],
                $result['type'],
                $result['cardId']
            );
            return $carte;
        } else {
            return null; 
        }
    } 
    
    public function getCarteIdByName($carteName){
        $stmt = $this->pdo->prepare("SELECT id FROM Carte WHERE name = :name");
        $stmt->bindParam(':name', $carteName);
        $stmt->execute();
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            return $result['id'];
        } else {
            return null;
        }
    }

    public function getCarteIdByCardId($cardId){
        $stmt = $this->pdo->prepare("SELECT id FROM Carte WHERE cardId = :cardId");
        $stmt->bindParam(':cardId', $cardId);
        $stmt->execute();
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            return $result['id'];
        } else {
            return null;
        }
    }
    

    public function addCarte(Carte $card){        
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

        $query .= ") ";
        $values .= ")";
        $finalQuery = $query . $values;

        $conn = $this->pdo;

        $resultInsert = $conn->prepare($finalQuery);
        $resultInsert->execute($array);
        
        if ($resultInsert) {
            return true;
        } else {
            return false;
        }
    }

    public function updateCarte(Carte $carte){
        $id = $carte->getId();
        $name = $carte->getName();
        $desc = $carte->getDesc();
        $imageUrl = $carte->getImageUrl();
        $race = $carte->getRace();
        $type = $carte->getType();
        $cardId = $carte->getCardId();

        $stmt = $this->pdo->prepare("UPDATE Carte SET name = :name, `desc` = :desc, imageUrl = :imageUrl, race = :race, type = :type, cardId = :cardId WHERE id = :id");

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':desc', $desc);
        $stmt->bindParam(':imageUrl', $imageUrl);
        $stmt->bindParam(':race', $race);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':cardId', $cardId);
        $stmt->execute();
    }

    public function deleteCarte(Carte $carte){
        $id = $carte->getId();
    
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