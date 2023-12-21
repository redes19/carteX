<?php

class Carte{
    private $id;
    private $name;
    private $desc;
    private $imageUrl;
    private $race;
    private $type;
    private $cardId;
    private $amazonPrice;
    private $cardmarketPrice;
    private $coolstuffincPrice;
    private $ebayPrice;
    private $tcgplayerPrice;
    private $archetype;
    private $atk;
    private $attribute;
    private $def;
    private $level;

    public function __construct($name, $desc, $imageUrl, $race, $type, $cardId, $amazonPrice, 
                                $cardmarketPrice, $coolstuffincPrice, $ebayPrice, $tcgplayerPrice, 
                                $archetype, $atk, $attribute, $def, $level) {
        $this->name = $name;
        $this->desc = $desc;
        $this->imageUrl = $imageUrl;
        $this->race = $race;
        $this->type = $type;
        $this->cardId = $cardId;
        $this->amazonPrice = $amazonPrice;
        $this->cardmarketPrice = $cardmarketPrice;
        $this->coolstuffincPrice = $coolstuffincPrice;
        $this->ebayPrice = $ebayPrice;
        $this->tcgplayerPrice = $tcgplayerPrice;
        $this->archetype = $archetype;
        $this->atk = $atk;
        $this->attribute = $attribute;
        $this->def = $def;
        $this->level = $level;
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
        // Getter and Setter for $amazonPrice
        public function getAmazonPrice() {
            return $this->amazonPrice;
        }
    
        public function setAmazonPrice($amazonPrice) {
            $this->amazonPrice = $amazonPrice;
        }
    
        // Getter and Setter for $cardmarketPrice
        public function getCardmarketPrice() {
            return $this->cardmarketPrice;
        }
    
        public function setCardmarketPrice($cardmarketPrice) {
            $this->cardmarketPrice = $cardmarketPrice;
        }
    
        // Getter and Setter for $coolstuffincPrice
        public function getCoolstuffincPrice() {
            return $this->coolstuffincPrice;
        }
    
        public function setCoolstuffincPrice($coolstuffincPrice) {
            $this->coolstuffincPrice = $coolstuffincPrice;
        }
    
        // Getter and Setter for $ebayPrice
        public function getEbayPrice() {
            return $this->ebayPrice;
        }
    
        public function setEbayPrice($ebayPrice) {
            $this->ebayPrice = $ebayPrice;
        }
    
        // Getter and Setter for $tcgplayerPrice
        public function getTcgplayerPrice() {
            return $this->tcgplayerPrice;
        }
    
        public function setTcgplayerPrice($tcgplayerPrice) {
            $this->tcgplayerPrice = $tcgplayerPrice;
        }
    
        // Getter and Setter for $archetype
        public function getArchetype() {
            return $this->archetype;
        }
    
        public function setArchetype($archetype) {
            $this->archetype = $archetype;
        }
    
        // Getter and Setter for $atk
        public function getAtk() {
            return $this->atk;
        }
    
        public function setAtk($atk) {
            $this->atk = $atk;
        }
    
        // Getter and Setter for $attribute
        public function getAttribute() {
            return $this->attribute;
        }
    
        public function setAttribute($attribute) {
            $this->attribute = $attribute;
        }
    
        // Getter and Setter for $def
        public function getDef() {
            return $this->def;
        }
    
        public function setDef($def) {
            $this->def = $def;
        }
    
        // Getter and Setter for $level
        public function getLevel() {
            return $this->level;
        }
    
        public function setLevel($level) {
            $this->level = $level;
        }
}   










?>