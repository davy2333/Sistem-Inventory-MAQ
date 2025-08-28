-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: systeminventorymaq
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bajas`
--

DROP TABLE IF EXISTS `bajas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bajas` (
  `id_bajas` int(11) NOT NULL AUTO_INCREMENT,
  `id_inventario` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `persona_encargada` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_bajas`),
  KEY `id_inventario` (`id_inventario`),
  CONSTRAINT `bajas_ibfk_1` FOREIGN KEY (`id_inventario`) REFERENCES `inventario` (`id_inventario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bajas`
--

LOCK TABLES `bajas` WRITE;
/*!40000 ALTER TABLE `bajas` DISABLE KEYS */;
/*!40000 ALTER TABLE `bajas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `Cliente` varchar(255) NOT NULL,
  `numero_telefonico` varchar(50) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Carlos Pérez','7012-3456','carlos@example.com'),(2,'','',''),(3,'','',''),(4,'','',''),(5,'','',''),(6,'tio','22334455','tio@gmail.com');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_de_compras`
--

DROP TABLE IF EXISTS `historial_de_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historial_de_compras` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_inventario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_inventario` (`id_inventario`),
  CONSTRAINT `historial_de_compras_ibfk_1` FOREIGN KEY (`id_inventario`) REFERENCES `inventario` (`id_inventario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_de_compras`
--

LOCK TABLES `historial_de_compras` WRITE;
/*!40000 ALTER TABLE `historial_de_compras` DISABLE KEYS */;
INSERT INTO `historial_de_compras` VALUES (1,12),(2,13),(3,14);
/*!40000 ALTER TABLE `historial_de_compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_De_Equipo` varchar(255) NOT NULL,
  `Marca` varchar(255) DEFAULT NULL,
  `Modelo` varchar(255) DEFAULT NULL,
  `Precio` decimal(10,2) DEFAULT NULL,
  `Fecha_De_Adquisicion` date DEFAULT NULL,
  `Condicion` varchar(255) DEFAULT NULL,
  `Codigo` int(11) DEFAULT NULL,
  `id_proveedores` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_inventario`),
  KEY `id_proveedores` (`id_proveedores`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_proveedores`) REFERENCES `proveedores` (`id_proveedores`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (12,'dwd','aeada','wdwd',3.00,'2025-05-16','Usado',33,1),(13,'dgfg','fgf','wddw',3.00,'2025-05-21','Nuevo',34,1),(14,'maquina ','toshiba','toshiba',23.00,'2025-05-09','Usado',20333,1);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_inventario_insert
AFTER INSERT ON inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_de_compras (id_inventario)
    VALUES (NEW.id_inventario);
    
    -- Si quieres almacenar también el tipo de equipo en historial_de_compras,
    -- primero necesitarías agregar una columna para ello en la tabla historial_de_compras
    -- (ver nota al final)
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mantenimiento`
--

DROP TABLE IF EXISTS `mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mantenimiento` (
  `id_mantenimiento` int(11) NOT NULL AUTO_INCREMENT,
  `id_inventario` int(11) NOT NULL,
  `detalle_problema` text DEFAULT NULL,
  `tecnico_encargado` varchar(255) DEFAULT NULL,
  `estado_de_reparacion` varchar(255) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Costo` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_mantenimiento`),
  KEY `id_inventario` (`id_inventario`),
  CONSTRAINT `mantenimiento_ibfk_1` FOREIGN KEY (`id_inventario`) REFERENCES `inventario` (`id_inventario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimiento`
--

LOCK TABLES `mantenimiento` WRITE;
/*!40000 ALTER TABLE `mantenimiento` DISABLE KEYS */;
INSERT INTO `mantenimiento` VALUES (2,13,'fallo en el motor7','jose','En reparación','0000-00-00',23.00);
/*!40000 ALTER TABLE `mantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedidos` (
  `id_pedidos` int(11) NOT NULL AUTO_INCREMENT,
  `Talla` varchar(50) DEFAULT NULL,
  `cantidad_confeccionada` int(11) DEFAULT NULL,
  `fecha_de_confeccion` date DEFAULT NULL,
  `Fecha_estimada_de_entrega` date DEFAULT NULL,
  `costo_por_unidad` decimal(10,2) DEFAULT NULL,
  `Foto` varchar(255) DEFAULT NULL,
  `Estado` varchar(255) DEFAULT NULL,
  `id_tipo_prenda` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedidos`),
  KEY `id_tipo_prenda` (`id_tipo_prenda`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_tipo_prenda`) REFERENCES `tipo_prenda` (`id_tipo_prenda`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (17,'s',4,'0000-00-00','0000-00-00',0.00,'','pendiente',1,1),(21,NULL,0,'0000-00-00','0000-00-00',0.00,'','Pendiente',1,1),(22,'s',0,'0000-00-00','0000-00-00',0.00,'','Terminado',2,1),(25,'S',0,'0000-00-00','0000-00-00',33.00,NULL,'En proceso',2,1),(29,'M',23,'2025-05-17','2025-05-14',2.00,'','Pendiente',1,1),(32,'A',23,'2025-05-22','2025-05-21',23.00,'','Pendiente',2,1),(34,'v',0,'0000-00-00','0000-00-00',0.00,'file-1746754462844-754870867.png','Completado',1,1);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedores` (
  `id_proveedores` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `Numero_telefonico` varchar(50) DEFAULT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proveedores`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'joel','Ahuachapan Pasaje San José Casa #5','23456545','Sincatex');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_prenda`
--

DROP TABLE IF EXISTS `tipo_prenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_prenda` (
  `id_tipo_prenda` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_prenda` varchar(255) NOT NULL,
  PRIMARY KEY (`id_tipo_prenda`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_prenda`
--

LOCK TABLES `tipo_prenda` WRITE;
/*!40000 ALTER TABLE `tipo_prenda` DISABLE KEYS */;
INSERT INTO `tipo_prenda` VALUES (1,'pants'),(2,'falda'),(5,'short');
/*!40000 ALTER TABLE `tipo_prenda` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 12:48:06
