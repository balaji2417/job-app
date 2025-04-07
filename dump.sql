CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: project
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobListingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateApplied` datetime(3) NOT NULL,
  `dateUpdated` datetime(3) DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userId` (`userId`),
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES ('0c227ee4-c882-4855-84eb-daeba050bdfc','vv0Be7ztHiVC3kDlAAAAAA==','Applied','2025-04-02 01:11:54.038','2025-04-02 01:11:54.038','Application for user','swetha@gmail.com'),('f624951e-b6f4-4b85-bf3b-79a3bf08280b','vv0Be7ztHiVC3kDlAAAAAA==','Applied','2025-04-02 01:16:12.733','2025-04-02 01:16:12.733','Application for user','gok@gmail.com');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performancemetrics`
--

DROP TABLE IF EXISTS `performancemetrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performancemetrics` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platformName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalJobsViewed` int NOT NULL,
  `jobsApplied` int NOT NULL,
  `rejections` int NOT NULL,
  `interviews` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PerformanceMetrics_userId_fkey` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performancemetrics`
--

LOCK TABLES `performancemetrics` WRITE;
/*!40000 ALTER TABLE `performancemetrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `performancemetrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfBirth` datetime(3) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('53cacd23-3221-4f2c-ac24-2a2f1313df78','afrah@gmail.com','balaji2k@','Balaji Sundar','Anand Babu','2000-06-24 00:00:00.000'),('3','alice.johnson@example.com','alicepass789','Alice','Johnson','1992-11-08 00:00:00.000'),('63ff6bba-e783-4856-acc2-e42eb1d104c2','anandbabu.a@northeastern.edu','balaji2k@','Balaji Sundar','Anand Babu','2000-06-24 00:00:00.000'),('34cc9207-bf98-4ff0-b227-edaaf5e3eaac','anandbabu.b@northeastern.edu','aaaaaaaaaaa','Balaji Sundar','Anand Babu','2000-06-24 00:00:00.000'),('4','bob.brown@example.com','browniepass','Bob','Brown','1990-06-30 00:00:00.000'),('5','charlie.white@example.com','whitecharlie','Charlie','White','1985-12-10 00:00:00.000'),('1a3274a5-9d58-48bb-972a-a4ae43bac98b','gok@gmail.com','gok12345','Gokhul','Ram','2004-02-02 00:00:00.000'),('2','jane.smith@example.com','mypassword456','Jane','Smith','1998-03-22 00:00:00.000'),('1','john.doe@example.com','securepass123','John','Doe','1995-07-15 00:00:00.000'),('1875f5fa-d926-4638-9682-63e3e35bb415','swetha@gmail.com','swetha12345678','Swetha','Shankar','2002-02-02 00:00:00.000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'project'
--

--
-- Dumping routines for database 'project'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-01 21:21:54
