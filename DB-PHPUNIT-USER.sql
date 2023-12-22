-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 91.134.89.49    Database: projetUser
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.4-MariaDB-1~deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CarteDeck`
--

DROP TABLE IF EXISTS `CarteDeck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CarteDeck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deck_id` int(11) DEFAULT NULL,
  `carte_id` int(11) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carte_id` (`carte_id`),
  CONSTRAINT `CarteDeck_ibfk_1` FOREIGN KEY (`carte_id`) REFERENCES `projet`.`Carte` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CarteDeck`
--

LOCK TABLES `CarteDeck` WRITE;
/*!40000 ALTER TABLE `CarteDeck` DISABLE KEYS */;
INSERT INTO `CarteDeck` VALUES (32,26,1301,NULL);
/*!40000 ALTER TABLE `CarteDeck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deck`
--

DROP TABLE IF EXISTS `Deck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Deck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deck`
--

LOCK TABLES `Deck` WRITE;
/*!40000 ALTER TABLE `Deck` DISABLE KEYS */;
INSERT INTO `Deck` VALUES (1,'Magicien Noir',15),(25,'Dragon a Trois tête',15),(26,'euuu',34);
/*!40000 ALTER TABLE `Deck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventaire`
--

DROP TABLE IF EXISTS `Inventaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) DEFAULT NULL,
  `carte_id` int(11) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carte_id` (`carte_id`),
  CONSTRAINT `Inventaire_ibfk_1` FOREIGN KEY (`carte_id`) REFERENCES `projet`.`Carte` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inventaire`
--

LOCK TABLES `Inventaire` WRITE;
/*!40000 ALTER TABLE `Inventaire` DISABLE KEYS */;
INSERT INTO `Inventaire` VALUES (1,15,1239,1),(6,34,1301,1);
/*!40000 ALTER TABLE `Inventaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mdp` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (14,'loris','loris','lloris@outlook.fr','$2b$10$ElPW0BxEdagpYMgMxlWABOSR9yQApChsndXsaE2qD6hEMlclbXioi',NULL),(15,'teo','teo','teo@teo.com','$2b$10$BHzjeKnxJctxoHktQgb4CeEqFlWKXrbAhQ100BDL/HJxqashvKX16',1),(16,'maxime','maxime','maximebeernaert@gmail.com','$2b$10$NQCC7sdHTLtfGVtxNw5XIu46NPF35cTiTfUnoV4d3iJJwxyaerzI6',NULL),(23,'max','max','maximebeernaert2@gmail.com','$2b$10$SNQ9bHkoroGB2mqRXmI2bexh/8S7K0vKgSiDbRg248a3YiMZndfiy',NULL),(34,'michel','michel','michel@teo.com','$2b$10$p7agSIMeG3ut3QMBe7QrGekmpHKPvVM4ArIX8HMapjWsaUwvvYdN2',NULL);
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'projetUser'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-22  0:11:26
