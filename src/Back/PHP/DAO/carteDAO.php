<?php

require_once '../Class/carte.php';

class CarteDAO {
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function getCartes(){
        $cartes = array();

        $query = "SELECT * FROM cartes";
        $result = $this->db->query($query);

        while ($row = $result->fetch_assoc()) {
            $carte = new Carte(
                $row['id'],
                $row['name'],
                $row['description'],
                $row['imageUrl'],
                $row['race'],
                $row['type'],
                $row['frameType'],
                $row['cardId']
            );

            $cartes[] = $carte;
        }

        return $cartes;
    }

    public function getCarteById($id){
        $stmt = $this->pdo->prepare("SELECT * FROM carte WHERE id = :id");
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
                $result['frameType'],
                $result['cardId']
            );
            return $carte;
        } else {
            return null; 
        }
    }    

    public function addCarte(Carte $carte){
        $name = $carte->getName();
        $desc = $carte->getDesc();
        $imageUrl = $carte->getImageUrl();
        $race = $carte->getRace();
        $type = $carte->getType();
        $frameType = $carte->getFrameType();
        $cardId = $carte->getCardId();
    
        $stmt = $this->pdo->prepare("INSERT INTO carte (name, desc, imageUrl, race, type, frameType, cardId) VALUES (:name, :desc, :imageUrl, :race, :type, :frameType, :cardId)");
    
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':desc', $desc);
        $stmt->bindParam(':imageUrl', $imageUrl);
        $stmt->bindParam(':race', $race);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':frameType', $frameType);
        $stmt->bindParam(':cardId', $cardId);
    
        if ($stmt->execute()) {
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
        $frameType = $carte->getFrameType();
        $cardId = $carte->getCardId();

        $stmt = $this->pdo->prepare("UPDATE carte SET name = :name, des = :desc, imageUrl = :imageUrl, race = :race, type = :type, frameType = :frameType, cardId = :cardId WHERE id = :id");

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':desc', $desc);
        $stmt->bindParam(':imageUrl', $imageUrl);
        $stmt->bindParam(':race', $race);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':frameType', $frameType);
        $stmt->bindParam(':cardId', $cardId);
        $stmt->execute();
    }

    public function deleteCarte(Carte $carte){
        $id = $carte->getId();
    
        $stmt = $this->pdo->prepare("DELETE FROM carte WHERE id = :id");
    
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