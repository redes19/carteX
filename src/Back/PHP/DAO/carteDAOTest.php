<?php

require_once 'carteDAO.php';

use PHPUnit\Framework\TestCase;

class CarteDAOTest extends TestCase {
    private $pdo;
    private $carteDAO;

    protected function setUp(): void {
        // Create an in-memory SQLite database
        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Create the Carte table
        $this->pdo->exec("CREATE TABLE Carte (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                `desc` TEXT,
                imageUrl TEXT,
                race TEXT,
                `type` TEXT,
                cardId INTEGER,
                amazonPrice DECIMAL(10, 2),
                cardmarketPrice DECIMAL(10, 2),
                coolstuffincPrice DECIMAL(10, 2),
                ebayPrice DECIMAL(10, 2),
                tcgplayerPrice DECIMAL(10, 2),
                archetype TEXT,
                atk INTEGER,
                `attribute` TEXT,
                def INTEGER,
                level INTEGER
            )
        ");

        // Initialize the CarteDAO object
        $this->carteDAO = new CarteDAO($this->pdo);
    }

    protected function tearDown(): void {
        // Drop the Carte table
        $this->pdo->exec("DROP TABLE IF EXISTS Carte");
    }

    public function testGetCartes() {
        // Insert some test data into the Carte table
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES
                ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1),
                ('Carte 2', 'Description 2', 'image2.jpg', 'Race 2', 'Type 2', 2),
                ('Carte 3', 'Description 3', 'image3.jpg', 'Race 3', 'Type 3', 3)
        ");

        // Call the getCartes method
        $cartes = $this->carteDAO->getCartes();

        // Assert that the number of retrieved cartes is correct
        $this->assertCount(3, $cartes);

        // Assert that the retrieved cartes have the correct properties
        $this->assertEquals('Carte 1', $cartes[0]->getName());
        $this->assertEquals('Description 1', $cartes[0]->getDesc());
        $this->assertEquals('image1.jpg', $cartes[0]->getImageUrl());
        $this->assertEquals('Race 1', $cartes[0]->getRace());
        $this->assertEquals('Type 1', $cartes[0]->getType());
        $this->assertEquals(1, $cartes[0]->getCardId());

        $this->assertEquals('Carte 2', $cartes[1]->getName());
        $this->assertEquals('Description 2', $cartes[1]->getDesc());
        $this->assertEquals('image2.jpg', $cartes[1]->getImageUrl());
        $this->assertEquals('Race 2', $cartes[1]->getRace());
        $this->assertEquals('Type 2', $cartes[1]->getType());
        $this->assertEquals(2, $cartes[1]->getCardId());

        $this->assertEquals('Carte 3', $cartes[2]->getName());
        $this->assertEquals('Description 3', $cartes[2]->getDesc());
        $this->assertEquals('image3.jpg', $cartes[2]->getImageUrl());
        $this->assertEquals('Race 3', $cartes[2]->getRace());
        $this->assertEquals('Type 3', $cartes[2]->getType());
        $this->assertEquals(3, $cartes[2]->getCardId());
    }

    // Add more test methods for other methods in the CarteDAO class

}

?>
