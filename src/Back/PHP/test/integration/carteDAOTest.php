<?php

require_once '../DAO/carteDAO.php';

use PHPUnit\Framework\TestCase;

class CarteDAOTest extends TestCase
{
    private $pdo;
    private $carteDAO;

    protected function setUp(): void
    {
        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->createTable();
        $this->carteDAO = new CarteDAO($this->pdo);
    }

    protected function tearDown(): void
    {
        $this->pdo = null;
        $this->carteDAO = null;
    }

    private function createTable()
    {
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS Carte (
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
    }

    public function testGetCartes()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES
                ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1),
                ('Carte 2', 'Description 2', 'image2.jpg', 'Race 2', 'Type 2', 2),
                ('Carte 3', 'Description 3', 'image3.jpg', 'Race 3', 'Type 3', 3)
        ");

        // Call the method to be tested
        $cartes = $this->carteDAO->getCartes();

        // Assert the result
        $this->assertCount(3, $cartes);
        $this->assertInstanceOf(Carte::class, $cartes[0]);
        $this->assertEquals('Carte 1', $cartes[0]->getName());
        $this->assertEquals('Description 1', $cartes[0]->getDesc());
        $this->assertEquals('image1.jpg', $cartes[0]->getImageUrl());
        $this->assertEquals('Race 1', $cartes[0]->getRace());
        $this->assertEquals('Type 1', $cartes[0]->getType());
        $this->assertEquals(1, $cartes[0]->getCardId());
    }

    public function testGetCarteById()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Call the method to be tested
        $carte = $this->carteDAO->getCarteById(1);

        // Assert the result
        $this->assertInstanceOf(Carte::class, $carte);
        $this->assertEquals('Carte 1', $carte->getName());
        $this->assertEquals('Description 1', $carte->getDesc());
        $this->assertEquals('image1.jpg', $carte->getImageUrl());
        $this->assertEquals('Race 1', $carte->getRace());
        $this->assertEquals('Type 1', $carte->getType());
        $this->assertEquals(1, $carte->getCardId());
    }

    public function testGetCarteIdByName()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Call the method to be tested
        $carteId = $this->carteDAO->getCarteIdByName('Carte 1');

        // Assert the result
        $this->assertEquals(1, $carteId);
    }

    public function testGetCarteIdByCardId()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Call the method to be tested
        $carteId = $this->carteDAO->getCarteIdByCardId(1);

        // Assert the result
        $this->assertEquals(1, $carteId);
    }

    public function testAddCarte()
    {
        // Create a Carte object
        $carte = new Carte(
            null,
            'New Carte',
            'New Description',
            'new_image.jpg',
            'New Race',
            'New Type',
            10
        );

        // Call the method to be tested
        $result = $this->carteDAO->addCarte($carte);

        // Assert the result
        $this->assertTrue($result);

        // Check if the Carte was inserted
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE name = 'New Carte'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertNotEmpty($result);
    }

    public function testUpdateCarte()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Create a Carte object
        $carte = new Carte(
            1,
            'Updated Carte',
            'Updated Description',
            'updated_image.jpg',
            'Updated Race',
            'Updated Type',
            10
        );

        // Call the method to be tested
        $result = $this->carteDAO->updateCarte($carte);

        // Assert the result
        $this->assertTrue($result);

        // Check if the Carte was updated
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE id = 1");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertEquals('Updated Carte', $result['name']);
        $this->assertEquals('Updated Description', $result['desc']);
        $this->assertEquals('updated_image.jpg', $result['imageUrl']);
        $this->assertEquals('Updated Race', $result['race']);
        $this->assertEquals('Updated Type', $result['type']);
        $this->assertEquals(10, $result['cardId']);
    }

    public function testDeleteCarte()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Create a Carte object
        $carte = new Carte(
            1,
            'Carte 1',
            'Description 1',
            'image1.jpg',
            'Race 1',
            'Type 1',
            1
        );

        // Call the method to be tested
        $result = $this->carteDAO->deleteCarte($carte);

        // Assert the result
        $this->assertTrue($result);

        // Check if the Carte was deleted
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE id = 1");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertEmpty($result);
    }

    public function testDeleteCarteById()
    {
        // Insert test data
        $this->pdo->exec("INSERT INTO Carte (name, `desc`, imageUrl, race, `type`, cardId)
            VALUES ('Carte 1', 'Description 1', 'image1.jpg', 'Race 1', 'Type 1', 1)
        ");

        // Call the method to be tested
        $result = $this->carteDAO->deleteCarteById(1);

        // Assert the result
        $this->assertTrue($result);

        // Check if the Carte was deleted
        $stmt = $this->pdo->prepare("SELECT * FROM Carte WHERE id = 1");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertEmpty($result);
    }
}

?>
