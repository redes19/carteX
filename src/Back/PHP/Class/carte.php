<?php

class Carte{
    private $id;
    private $name;
    private $desc;
    private $imageUrl;
    private $race;
    private $type;
    private $cardId;

    public function __construct($id, $name, $desc, $imageUrl, $race, $type, $cardId){
        $this->id = $id;
        $this->name = $name;
        $this->desc = $desc;
        $this->imageUrl = $imageUrl;
        $this->race = $race;
        $this->type = $type;
        $this->cardId = $cardId;
    }

    // Getter and Setter for $id
    public function getId(){
        return $this->id;
    }

    public function setId($id){
        $this->id = $id;
    }

    // Getter and Setter for $name
    public function getName(){
        return $this->name;
    }

    public function setName($name){
        $this->name = $name;
    }

    // Getter and Setter for $desc
    public function getDesc(){
        return $this->desc;
    }

    public function setDesc($desc){
        $this->desc = $desc;
    }

    // Getter and Setter for $imageUrl
    public function getImageUrl(){
        return $this->imageUrl;
    }

    public function setImageUrl($imageUrl){
        $this->imageUrl = $imageUrl;
    }

    // Getter and Setter for $race
    public function getRace(){
        return $this->race;
    }

    public function setRace($race){
        $this->race = $race;
    }

    // Getter and Setter for $type
    public function getType(){
        return $this->type;
    }

    public function setType($type){
        $this->type = $type;
    }


    // Getter and Setter for $cardId
    public function getCardId(){
        return $this->cardId;
    }

    public function setCardId($cardId){
        $this->cardId = $cardId;
    }
}










?>