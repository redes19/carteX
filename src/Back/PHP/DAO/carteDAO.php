<?php

class CarteDAO {
    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    // Create
    public function create(Carte $carte){
        $query = "INSERT INTO cartes (id, name, description, imageUrl, race, type, frameType, cardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("issssssi", $carte->getId(), $carte->getName(), $carte->getDesc(), $carte->getImageUrl(), $carte->getRace(), $carte->getType(), $carte->getFrameType(), $carte->getCardId());
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    // Read
    public function getById($id){
        $query = "SELECT * FROM cartes WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $carte = $result->fetch_object("Carte");
        return $carte;
    }

    // Update
    public function update(Carte $carte){
        $query = "UPDATE cartes SET name = ?, description = ?, imageUrl = ?, race = ?, type = ?, frameType = ?, cardId = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("ssssssii", $carte->getName(), $carte->getDesc(), $carte->getImageUrl(), $carte->getRace(), $carte->getType(), $carte->getFrameType(), $carte->getCardId(), $carte->getId());
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    // Delete
    public function delete($id){
        $query = "DELETE FROM cartes WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
}



?>