/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.3.2-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: sishptl
-- ------------------------------------------------------
-- Server version	12.3.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `autorizacion`
--

-- CREATE DATABASE SISHPTL;

USE SISHPTL;

DROP TABLE IF EXISTS `autorizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `autorizacion` (
  `id_autorizacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_autorizacion`),
  UNIQUE KEY `unq_autorizacion_rol_permiso` (`id_rol`,`id_permiso`),
  KEY `fk_autorizacion-permiso` (`id_permiso`),
  CONSTRAINT `fk_autorizacion-permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`),
  CONSTRAINT `fk_autorizacion-rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autorizacion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `autorizacion` DISABLE KEYS */;
INSERT INTO `autorizacion` VALUES
(1,1,1,1),
(2,1,2,1),
(3,1,3,1),
(4,1,4,1),
(5,1,5,1),
(6,1,6,1),
(7,1,7,1),
(8,1,8,1),
(9,1,9,1),
(10,1,10,1),
(11,1,11,1),
(12,1,12,1),
(13,1,13,1),
(14,1,14,1),
(15,1,15,1),
(16,1,16,1),
(17,1,17,1),
(18,1,18,1),
(19,1,19,1),
(20,1,20,1),
(21,1,21,1),
(22,1,22,1),
(23,1,23,1),
(24,1,24,1),
(25,1,25,1),
(26,1,26,1),
(27,1,27,1),
(28,1,28,1),
(29,1,29,1),
(30,1,30,1),
(31,1,31,1),
(32,5,7,1),
(37,5,17,1),
(38,5,20,1),
(39,5,12,1),
(40,5,13,1),
(41,5,14,1),
(42,5,15,1),
(43,5,16,1),
(44,5,18,1),
(45,5,19,1),
(46,5,21,1),
(47,5,22,1),
(48,5,23,1),
(49,5,24,1),
(50,5,25,1),
(51,5,26,1),
(52,1,32,1),
(53,1,33,1),
(54,1,34,1),
(55,1,35,1),
(56,1,36,1),
(60,1,38,1),
(62,1,39,1),
(63,1,40,1),
(64,1,41,1),
(65,5,2,1),
(70,2,22,1),
(71,2,42,1),
(72,2,43,1),
(73,2,44,1),
(74,2,45,1),
(75,2,46,1),
(76,2,47,1),
(77,2,48,1),
(78,2,49,1),
(79,2,50,1),
(80,2,51,1),
(81,2,52,1),
(82,2,53,1),
(83,2,54,1),
(84,2,55,1),
(85,2,56,1),
(86,2,57,1),
(101,3,12,1),
(102,3,13,1),
(103,3,14,1),
(104,3,22,1),
(105,3,27,1),
(106,3,73,1),
(107,3,74,1),
(108,3,75,1),
(109,3,76,1),
(110,3,77,1),
(111,3,78,1),
(112,3,79,1),
(113,3,80,1),
(114,3,81,1),
(116,4,88,1),
(117,4,89,1),
(118,4,90,1),
(119,4,91,1),
(120,4,92,1),
(121,4,93,1),
(122,4,94,1),
(123,4,95,1),
(124,4,96,1),
(125,4,97,1),
(126,4,98,1),
(131,1,42,1),
(132,1,43,1),
(133,1,44,1),
(134,1,45,1),
(135,1,46,1),
(136,1,47,1),
(137,1,48,1),
(138,1,49,1),
(139,1,50,1),
(140,1,51,1),
(141,1,52,1),
(142,1,53,1),
(143,1,54,1),
(144,1,55,1),
(145,1,56,1),
(146,1,57,1),
(147,1,73,1),
(148,1,74,1),
(149,1,75,1),
(150,1,76,1),
(151,1,77,1),
(152,1,78,1),
(153,1,79,1),
(154,1,80,1),
(155,1,81,1),
(156,1,88,1),
(157,1,89,1),
(158,1,90,1),
(159,1,91,1),
(160,1,92,1),
(161,1,93,1),
(162,1,94,1),
(163,1,95,1),
(164,1,96,1),
(165,1,97,1),
(166,1,98,1),
(199,6,7,1),
(200,6,8,1),
(203,6,11,1);
/*!40000 ALTER TABLE `autorizacion` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `id_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  `es_personal_medico` bit(1) NOT NULL,
  PRIMARY KEY (`id_cargo`),
  UNIQUE KEY `unq_cargo_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES
(1,'Doctor','Profesional encargado de la atención médica de los pacientes',0,0x00),
(2,'Recepcionista','Personal encargado de la recepción y gestión de citas de los pacientes',1,0x00),
(3,'Médico General','Brinda atención médica integral y realiza diagnósticos iniciales.',1,0x01),
(4,'Médico Internista','Diagnostica y trata enfermedades de adultos sin intervención quirúrgica.',1,0x01),
(5,'Médico Cirujano','Realiza evaluación médica y procedimientos quirúrgicos según su formación.',1,0x01),
(6,'Médico Residente','Médico en formación especializada bajo supervisión de especialistas.',1,0x01),
(7,'Médico Emergenciólogo','Atiende y estabiliza pacientes con condiciones médicas de emergencia.',1,0x01),
(8,'Médico Familiar','Brinda atención integral y continua a personas y familias.',1,0x01),
(9,'Médico Intensivista','Atiende pacientes críticos que requieren cuidados especializados.',1,0x01),
(10,'Médico Geriatra','Atiende y trata enfermedades y condiciones de adultos mayores.',1,0x01),
(11,'Médico Pediatra','Brinda atención médica especializada a niños y adolescentes.',1,0x01),
(12,'Demo de datos','ES UNA DEMO ',2,0x01),
(13,'demo no es personal','es una demo',2,0x00),
(14,'Medico NeuroPediatra','es una demo',1,0x01),
(15,'Cargo para eliminar ahora','es una breve descripcion',0,0x00),
(16,'EJEMPLO DE NO MEDICO','demo',1,0x00);
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cita_medica`
--

DROP TABLE IF EXISTS `cita_medica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita_medica` (
  `id_cita_medica` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fec_cita` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_salida` time NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=programada, 2=atendida, 3=cancelada, 4=reprogramada',
  PRIMARY KEY (`id_cita_medica`),
  KEY `fk_cita_medica-paciente` (`id_paciente`),
  KEY `fk_cita_medica-usuario` (`id_usuario`),
  KEY `idx_cita_medica_fecha` (`fec_cita`),
  KEY `fk_cita_medica-medico` (`id_medico`),
  CONSTRAINT `fk_cita_medica-medico` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id_medico`),
  CONSTRAINT `fk_cita_medica-paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`),
  CONSTRAINT `fk_cita_medica-usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita_medica`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `cita_medica` DISABLE KEYS */;
/*!40000 ALTER TABLE `cita_medica` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `codigo_recuperacion`
--

DROP TABLE IF EXISTS `codigo_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigo_recuperacion` (
  `id_codigo` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `codigo_hash` varchar(255) NOT NULL,
  `fec_expiracion` datetime NOT NULL,
  `intentos` int(11) NOT NULL DEFAULT 0,
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  `fec_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_codigo`),
  KEY `fk_codigo_usuario` (`id_usuario`),
  CONSTRAINT `fk_codigo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigo_recuperacion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `codigo_recuperacion` DISABLE KEYS */;
INSERT INTO `codigo_recuperacion` VALUES
(1,1,'$2a$10$VXWAiXirPPNa7DrV8UEmQ.V5iOQ9lLOajmrbnXKSEGN0UDNcWZob.','2026-10-03 00:49:19',0,1,'2026-10-03 00:39:19'),
(2,1,'$2a$10$DF1JZIwn3LOYCugY5JPg2u/7A3bmXH.dp8a96IGftxWs2IafOurwW','2026-10-03 00:57:15',0,1,'2026-10-03 00:47:15'),
(3,1,'$2a$10$HqosnqVsDfFKB/pWYh8G7OmbB5XEWuPvo.m39NjKNd0Al4brHpdSG','2026-10-03 01:09:44',0,1,'2026-10-03 00:59:44'),
(4,1,'$2a$10$iea.rud9V5FUgAflz3gcGOCV/Mc.bw6rS7dWca44Z5e0APUS2ZB2e','2026-10-03 01:15:45',0,1,'2026-10-03 01:05:45'),
(5,1,'$2a$10$/NI/PcaSmxp9NuaCrKRByOg/z44W8.mB8wd67.h93VVhXgZkVmOYW','2026-10-03 15:20:14',1,1,'2026-10-03 15:10:14'),
(6,1,'$2a$10$Li7hd.nlknE3vRHgjt/w1udY.p.v8j0TE/bP33ImGgom/aD/i4mve','2026-10-03 15:26:55',1,1,'2026-10-03 15:16:55'),
(7,1,'$2a$10$tHPQAVn48lA3vq3oHrT6wuS4exKpMf8diklV2nPu4OYo/6ShjCFFS','2026-10-03 16:58:26',0,1,'2026-10-03 16:48:26'),
(8,1,'$2a$10$BLVgZxAi90.w4cfsSbsmhucVLfeD7UxZ9f0tn2SV23fXvWXaPoWvq','2026-10-03 16:59:43',0,1,'2026-10-03 16:49:43'),
(9,1,'$2a$10$8fiYwRz27JTsVMvxR8mkJOGrEHQWH5XujoKcyasSNP.UUZaLN2YVC','2026-10-03 17:00:37',1,1,'2026-10-03 16:50:37'),
(10,4,'$2a$10$FL.UqX449vmXuiCu1t5MOepsn6vO9XTbv3BS4bIUj5MHa0Rnda2aq','2026-10-07 04:05:49',1,1,'2026-10-07 03:55:49'),
(11,5,'$2a$10$L.ffYUdqvvWPIyKm02Eqm.6eFHk7oupdiKOWYdCa6VcTOMCZEJ10C','2026-10-12 01:56:46',0,0,'2026-10-12 01:46:46');
/*!40000 ALTER TABLE `codigo_recuperacion` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `derivacion`
--

DROP TABLE IF EXISTS `derivacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `derivacion` (
  `id_derivacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_diagnostico` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `urgencia` int(11) NOT NULL DEFAULT 1 COMMENT '1=normal, 2=urgente',
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_derivacion`),
  KEY `fk_derivacion-diagnostico` (`id_diagnostico`),
  KEY `fk_derivacion-especialidad` (`id_especialidad`),
  CONSTRAINT `fk_derivacion-diagnostico` FOREIGN KEY (`id_diagnostico`) REFERENCES `diagnostico` (`id_diagnostico`),
  CONSTRAINT `fk_derivacion-especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id_especialidad`),
  CONSTRAINT `chk_derivacion_urgencia` CHECK (`urgencia` in (1,2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `derivacion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `derivacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `derivacion` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `diagnostico`
--

DROP TABLE IF EXISTS `diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico` (
  `id_diagnostico` int(11) NOT NULL AUTO_INCREMENT,
  `id_cita_medica` int(11) NOT NULL,
  `codigo` varchar(15) DEFAULT NULL,
  `descripcion` varchar(300) NOT NULL,
  `tipo_diagnostico` int(11) NOT NULL COMMENT '1=presuntivo, 2=definitivo',
  `observaciones` varchar(300) DEFAULT NULL,
  `fec_diagnostico` date NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_diagnostico`),
  KEY `fk_diagnostico-cita_medica` (`id_cita_medica`),
  KEY `idx_diagnostico_fecha` (`fec_diagnostico`),
  CONSTRAINT `fk_diagnostico-cita_medica` FOREIGN KEY (`id_cita_medica`) REFERENCES `cita_medica` (`id_cita_medica`),
  CONSTRAINT `chk_diagnostico_tipo` CHECK (`tipo_diagnostico` in (1,2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `diagnostico` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnostico` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_cargo` int(11) NOT NULL,
  `fec_ingreso` date NOT NULL,
  `fec_retiro` date DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `unq_empleado_persona` (`id_persona`),
  KEY `fk_empleado-cargo` (`id_cargo`),
  CONSTRAINT `fk_empleado-cargo` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`),
  CONSTRAINT `fk_empleado-persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES
(1,3,2,'2026-10-02',NULL,'/uploads/EMPLEADOS/b9a59cf7-f10d-480d-bc41-992c622aa824.webp',1),
(2,4,2,'2026-10-02',NULL,'/uploads/EMPLEADOS/67250e13-d988-4b59-94ba-194a7cd0d442.jpg',0),
(3,5,2,'2026-10-02',NULL,'/uploads/EMPLEADOS/9a017c8b-cec1-4ffd-b8a6-9fcd9da879be.jpg',0),
(4,7,10,'2026-10-03',NULL,'/uploads/EMPLEADOS/d34e0c15-9f4d-4363-90e2-ec9c43d6f894.jpg',1),
(5,10,5,'2026-10-06',NULL,'/uploads/EMPLEADOS/932a9247-fdcb-443c-b423-726983945b08.jpg',1),
(6,12,4,'2026-10-07',NULL,'/uploads/EMPLEADOS/297b8a50-0a86-42a2-9a56-1f6093e6212d.jpg',1),
(7,13,5,'2026-10-07',NULL,'/uploads/EMPLEADOS/2052540c-5f85-4fc2-8030-cd6b6bacb6fb.jpeg',1),
(8,16,7,'2026-10-12',NULL,NULL,1),
(9,1,2,'2026-10-17',NULL,'/uploads/EMPLEADOS/b5af64be-35ed-452c-a444-54bd4005a180.jpeg',1),
(10,15,7,'2026-10-20',NULL,NULL,1);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `especialidad`
--

DROP TABLE IF EXISTS `especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidad` (
  `id_especialidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `unq_especialidad_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidad`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `especialidad` DISABLE KEYS */;
INSERT INTO `especialidad` VALUES
(1,'Cardiología','Especialidad enfocada en enfermedades del corazón',1),
(2,'Oncología','Especialidad dedicada al diagnóstico y tratamiento del cáncer',1),
(3,'Medicina Interna','Atiende de forma integral los problemas de salud en pacientes adultos, enfocándose en el manejo',1),
(4,'Pediatría','Brinda atención médica preventiva y curativa a recién nacidos, niños y adolescentes hasta los 18 año',1),
(5,'Neurología','Se encarga de los trastornos del sistema nervioso central y periférico (cerebro, médula espinal y ne',1),
(6,'Endocrinología','Trata las alteraciones de las glándulas endocrinas y hormonas, abarcando problemas como la diabetes ',1),
(7,'Gastroenterología','Estudia y trata las enfermedades del tubo digestivo, hígado, vesícula biliar y páncreas.',1),
(8,'Neumología','Diagnostica y maneja las patologías del aparato respiratorio y los pulmones.',1),
(9,'Dermatología','Se enfoca en el cuidado, estudio y tratamiento médico-quirúrgico de la piel, cabello y uñas.',1),
(10,'Psiquiatría','Previene y trata los trastornos mentales, emocionales y del comportamiento mediante psicoterapia',1),
(11,'Urología','Maneja las afecciones del aparato urinario en ambos sexos y del aparato reproductor masculino',1),
(12,'Anestesiología','Administra anestesia y monitorea las constantes vitales del paciente durante los procedimientos quir',1),
(13,'Medicina Intensiva (UCI):','Proporciona soporte vital avanzado a pacientes en estado crítico o con riesgo inminente de muerte.',1),
(14,'Medicina Física y Rehabilitación','Ayuda a recuperar la función motora y física tras lesiones neurológicas o musculoesqueléticas',1),
(15,'DEMODX','ES UNA PRUEBA',0),
(16,'DEMOY PRUEBA','D',0),
(17,'Demo de especialidad','es una prueba de testeo',1);
/*!40000 ALTER TABLE `especialidad` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `examen_solicitado`
--

DROP TABLE IF EXISTS `examen_solicitado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen_solicitado` (
  `id_examen_solicitado` int(11) NOT NULL AUTO_INCREMENT,
  `id_diagnostico` int(11) NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=pendiente, 2=realizado, 3=cancelado',
  PRIMARY KEY (`id_examen_solicitado`),
  KEY `fk_examen_solicitado-diagnostico` (`id_diagnostico`),
  CONSTRAINT `fk_examen_solicitado-diagnostico` FOREIGN KEY (`id_diagnostico`) REFERENCES `diagnostico` (`id_diagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen_solicitado`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `examen_solicitado` DISABLE KEYS */;
/*!40000 ALTER TABLE `examen_solicitado` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `horario_atencion`
--

DROP TABLE IF EXISTS `horario_atencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario_atencion` (
  `id_horario_atencion` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `dia_semana` int(11) NOT NULL COMMENT '1=lunes...7=domingo (ISO-8601)',
  `hora_entrada` time NOT NULL,
  `hora_salida` time NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  `fec_inicio` date NOT NULL,
  `fec_fin` date NOT NULL,
  PRIMARY KEY (`id_horario_atencion`),
  KEY `fk_horario_atencion-empleado` (`id_empleado`),
  CONSTRAINT `fk_horario_atencion-empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`),
  CONSTRAINT `chk_horario_atencion_dia` CHECK (`dia_semana` between 1 and 7)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario_atencion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `horario_atencion` DISABLE KEYS */;
INSERT INTO `horario_atencion` VALUES
(1,1,1,'08:00:00','13:00:00',1,'2026-08-20','2026-10-20'),
(2,1,1,'14:00:00','18:00:00',1,'2026-08-20','2026-10-20'),
(3,1,3,'08:00:00','13:00:00',1,'2026-08-20','2026-10-20'),
(4,1,5,'09:00:00','14:00:00',1,'2026-08-20','2026-10-20'),
(5,1,7,'08:00:00','14:00:00',1,'2026-08-20','2026-10-20'),
(6,4,1,'08:00:00','14:00:00',0,'2026-08-20','2026-10-20'),
(7,4,2,'08:00:00','14:00:00',1,'2026-10-06','2026-11-05'),
(8,4,1,'08:00:00','14:00:00',1,'2026-10-06','2026-11-05'),
(9,5,1,'16:00:00','23:00:00',1,'2026-10-06','2026-12-12'),
(10,5,2,'08:00:00','16:00:00',1,'2026-10-06','2026-12-12'),
(11,5,3,'16:00:00','23:00:00',1,'2026-10-06','2026-12-12'),
(12,5,4,'16:00:00','23:00:00',1,'2026-10-06','2026-12-12'),
(13,5,5,'16:00:00','23:00:00',0,'2026-10-06','2026-12-12');
/*!40000 ALTER TABLE `horario_atencion` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `indicacion`
--

DROP TABLE IF EXISTS `indicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicacion` (
  `id_indicacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_diagnostico` int(11) NOT NULL,
  `tipo_indicacion` varchar(30) NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `dias_reposo` int(11) DEFAULT NULL,
  `frecuencia` varchar(40) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_indicacion`),
  KEY `fk_indicacion-diagnostico` (`id_diagnostico`),
  CONSTRAINT `fk_indicacion-diagnostico` FOREIGN KEY (`id_diagnostico`) REFERENCES `diagnostico` (`id_diagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicacion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `indicacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `indicacion` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `medico`
--

DROP TABLE IF EXISTS `medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medico` (
  `id_medico` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL,
  `numero_colegiatura` varchar(20) NOT NULL,
  `numero_especialidad` varchar(20) DEFAULT NULL,
  `consejo_regional` varchar(60) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `unq_doctor_empleado` (`id_empleado`),
  UNIQUE KEY `unq_doctor_colegiatura` (`numero_colegiatura`),
  KEY `fk_medico-especialidad` (`id_especialidad`),
  CONSTRAINT `fk_medico-empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`),
  CONSTRAINT `fk_medico-especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id_especialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medico`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `medico` DISABLE KEYS */;
INSERT INTO `medico` VALUES
(1,1,13,'058093','RNE-22227','CR Lima',0),
(2,2,2,'078912','RNE-67891','CR Lambayeque',0),
(3,4,13,'086257','RNE-84656','CR Arequipa',1),
(4,5,2,'356728','RNE-66226','CMP-Ayacucho',1),
(5,6,13,'725511','RNE-29239','CMP-Lambayeque',1);
/*!40000 ALTER TABLE `medico` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `id_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `codigo_asegurado` varchar(20) DEFAULT NULL,
  `entidad_asegurado` varchar(60) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `unq_paciente_persona` (`id_persona`),
  CONSTRAINT `fk_paciente-persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES
(1,1,'ASEG-2026-001','ESSALUD',1),
(2,8,'hbgvfcdxszjbgvfdfgnj','hbgvfcdx',0),
(3,11,'ASEG-234-FDS','SIS-GEED',1),
(4,15,'SIS-03761512','SIS',1),
(5,3,'DEMO-SIS','DEMO-NRO',1),
(7,7,'SIS-42649325','SIS',1);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  `modulo` varchar(60) NOT NULL,
  `codigo` varchar(60) NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `unq_permiso_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES
(1,'Ver usuarios','Gestionar usuarios: cambiar rol y estado',1,'USUARIOS','USUARIO_VER'),
(2,'Ver especialidades','Permite visualizar las especialidades médicas registradas',1,'ESPECIALIDADES','ESPECIALIDAD_VER'),
(3,'Crear especialidad','Permite registrar nuevas especialidades médicas',1,'ESPECIALIDADES','ESPECIALIDAD_CREAR'),
(4,'Editar especialidad','Permite modificar la información de una especialidad médica',1,'ESPECIALIDADES','ESPECIALIDAD_EDITAR'),
(5,'Eliminar especialidad','Permite eliminar una especialidad médica',1,'ESPECIALIDADES','ESPECIALIDAD_ELIMINAR'),
(6,'Cambiar estado de especialidad','Permite activar o desactivar una especialidad médica',1,'ESPECIALIDADES','ESPECIALIDAD_CAMBIAR_ESTADO'),
(7,'Ver cargos','Permite visualizar los cargos registrados',1,'CARGOS','CARGO_VER'),
(8,'Crear cargo','Permite registrar nuevos cargos y definir si corresponden a personal médico',1,'CARGOS','CARGO_CREAR'),
(9,'Editar cargo','Permite modificar la información y la clasificación de un cargo',1,'CARGOS','CARGO_EDITAR'),
(10,'Eliminar cargo','Permite eliminar un cargo registrado',1,'CARGOS','CARGO_ELIMINAR'),
(11,'Cambiar estado de cargo','Permite activar o desactivar un cargo',1,'CARGOS','CARGO_CAMBIAR_ESTADO'),
(12,'Ver pacientes','Permite visualizar y consultar los pacientes registrados',1,'PACIENTES','PACIENTE_VER'),
(13,'Crear paciente','Permite registrar nuevos pacientes',1,'PACIENTES','PACIENTE_CREAR'),
(14,'Editar paciente','Permite modificar la información de los pacientes registrados',1,'PACIENTES','PACIENTE_EDITAR'),
(15,'Eliminar paciente','Permite eliminar un paciente registrado',1,'PACIENTES','PACIENTE_ELIMINAR'),
(16,'Cambiar estado de paciente','Permite activar o desactivar un paciente',1,'PACIENTES','PACIENTE_CAMBIAR_ESTADO'),
(17,'Ver empleados','Permite visualizar y consultar los empleados registrados',1,'EMPLEADOS','EMPLEADO_VER'),
(18,'Crear empleado','Permite registrar nuevos empleados',1,'EMPLEADOS','EMPLEADO_CREAR'),
(19,'Editar empleado','Permite modificar la información de los empleados registrados',1,'EMPLEADOS','EMPLEADO_EDITAR'),
(20,'Eliminar empleado','Permite eliminar un empleado registrado',1,'EMPLEADOS','EMPLEADO_ELIMINAR'),
(21,'Cambiar estado de empleado','Permite activar o desactivar un empleado',1,'EMPLEADOS','EMPLEADO_CAMBIAR_ESTADO'),
(22,'Ver médicos','Permite visualizar y consultar los médicos registrados',1,'MÉDICOS','MEDICO_VER'),
(23,'Crear médico','Permite registrar nuevos médicos y asociarlos a una especialidad',1,'MÉDICOS','MEDICO_CREAR'),
(24,'Editar médico','Permite modificar la información de los médicos registrados',1,'MÉDICOS','MEDICO_EDITAR'),
(25,'Eliminar médico','Permite eliminar un médico registrado',1,'MÉDICOS','MEDICO_ELIMINAR'),
(26,'Cambiar estado de médico','Permite activar o desactivar un médico',1,'MÉDICOS','MEDICO_CAMBIAR_ESTADO'),
(27,'Ver horarios','Permite visualizar y consultar los horarios de atención registrados',1,'HORARIOS','HORARIO_VER'),
(28,'Crear horario','Permite registrar nuevos horarios de atención para los empleados',1,'HORARIOS','HORARIO_CREAR'),
(29,'Editar horario','Permite modificar los horarios de atención registrados',1,'HORARIOS','HORARIO_EDITAR'),
(30,'Eliminar horario','Permite eliminar un horario de atención registrado',1,'HORARIOS','HORARIO_ELIMINAR'),
(31,'Cambiar estado de horario','Permite activar o desactivar un horario de atención',1,'HORARIOS','HORARIO_CAMBIAR_ESTADO'),
(32,'Ver roles','Permite visualizar y consultar los roles registrados',1,'ROLES','ROL_VER'),
(33,'Crear rol','Permite registrar nuevos roles en el sistema',1,'ROLES','ROL_CREAR'),
(34,'Editar rol','Permite modificar la información de los roles registrados',1,'ROLES','ROL_EDITAR'),
(35,'Eliminar rol','Permite eliminar un rol registrado',1,'ROLES','ROL_ELIMINAR'),
(36,'Cambiar estado de rol','Permite activar o desactivar un rol registrado',1,'ROLES','ROL_CAMBIAR_ESTADO'),
(38,'Asignar permisos a rol','Permite asignar permisos disponibles a un rol registrado',1,'ROLES','ROL_PERMISOS_ASIGNAR'),
(39,'Crear usuario','Permite registrar nuevos usuarios en el sistema',1,'USUARIOS','USUARIO_CREAR'),
(40,'Cambiar rol de usuario','Permite modificar el rol asignado a un usuario registrado',1,'USUARIOS','USUARIO_CAMBIAR_ROL'),
(41,'Cambiar estado de usuario','Permite activar o desactivar un usuario registrado',1,'USUARIOS','USUARIO_CAMBIAR_ESTADO'),
(42,'Ver citas asignadas','Permite visualizar las citas médicas asignadas al médico autenticado',1,'CITAS','CITA_VER_PROPIAS'),
(43,'Ver pacientes asignados','Permite consultar los pacientes que debe atender según sus citas asignadas',1,'PACIENTES','PACIENTE_VER_ASIGNADOS'),
(44,'Ver horario propio','Permite consultar el horario de atención del médico autenticado',1,'HORARIOS','HORARIO_VER_PROPIO'),
(45,'Marcar cita como atendida','Permite registrar que una cita asignada ha sido atendida',1,'CITAS','CITA_MARCAR_ATENDIDA'),
(46,'Registrar inasistencia','Permite registrar la inasistencia de un paciente a una cita asignada',1,'CITAS','CITA_REGISTRAR_INASISTENCIA'),
(47,'Ver diagnósticos','Permite consultar los diagnósticos de los pacientes que atiende',1,'DIAGNOSTICOS','DIAGNOSTICO_VER'),
(48,'Crear diagnóstico','Permite registrar diagnósticos médicos durante la atención',1,'DIAGNOSTICOS','DIAGNOSTICO_CREAR'),
(49,'Editar diagnóstico','Permite modificar diagnósticos médicos de las atenciones autorizadas',1,'DIAGNOSTICOS','DIAGNOSTICO_EDITAR'),
(50,'Eliminar diagnóstico','Permite eliminar diagnósticos según las reglas clínicas del sistema',1,'DIAGNOSTICOS','DIAGNOSTICO_ELIMINAR'),
(51,'Ver tratamientos','Permite consultar los tratamientos registrados en las atenciones de sus pacientes',1,'TRATAMIENTOS','TRATAMIENTO_VER'),
(52,'Indicar tratamiento','Permite prescribir tratamientos durante una atención médica',1,'TRATAMIENTOS','TRATAMIENTO_INDICAR'),
(53,'Editar tratamiento','Permite modificar tratamientos de las atenciones autorizadas',1,'TRATAMIENTOS','TRATAMIENTO_EDITAR'),
(54,'Registrar indicaciones médicas','Permite registrar recomendaciones e indicaciones para el paciente',1,'INDICACIONES','INDICACION_CREAR'),
(55,'Editar indicaciones médicas','Permite modificar indicaciones de sus atenciones',1,'INDICACIONES','INDICACION_EDITAR'),
(56,'Ver historial clínico','Permite consultar el historial clínico de los pacientes que atiende',1,'HISTORIAL_CLINICO','HISTORIAL_CLINICO_VER'),
(57,'Registrar observaciones médicas','Permite registrar observaciones clínicas durante una atención',1,'ATENCIONES','ATENCION_OBSERVACION_CREAR'),
(73,'Ver citas','Permite consultar las citas médicas registradas en el establecimiento',1,'CITAS','CITA_VER'),
(74,'Agendar cita','Permite registrar citas médicas para los pacientes con médicos disponibles',1,'CITAS','CITA_CREAR'),
(75,'Editar cita','Permite modificar la fecha, hora, médico y otros datos de una cita',1,'CITAS','CITA_EDITAR'),
(76,'Cancelar cita','Permite cancelar citas médicas registradas según las reglas del sistema',1,'CITAS','CITA_CANCELAR'),
(77,'Confirmar cita','Permite confirmar la asistencia o confirmación administrativa de una cita',1,'CITAS','CITA_CONFIRMAR'),
(78,'Cambiar estado de cita','Permite actualizar el estado administrativo de una cita médica',1,'CITAS','CITA_CAMBIAR_ESTADO'),
(79,'Consultar disponibilidad médica','Permite consultar los médicos y horarios disponibles para agendar citas',1,'CITAS','CITA_VER_DISPONIBILIDAD'),
(80,'Ver reportes de citas','Permite consultar reportes administrativos de citas médicas',1,'REPORTES','REPORTE_CITAS_VER'),
(81,'Generar reportes de citas','Permite generar reportes de citas por fecha, médico, estado y otros criterios',1,'REPORTES','REPORTE_CITAS_GENERAR'),
(88,'Ver mis citas','Permite consultar las citas médicas del paciente autenticado, sus fechas, médicos asignados y estados',1,'CITAS','CITA_PACIENTE_VER'),
(89,'Solicitar cita médica','Permite solicitar una cita médica para el paciente autenticado según la disponibilidad existente',1,'CITAS','CITA_PACIENTE_CREAR'),
(90,'Cancelar mi cita','Permite solicitar o realizar la cancelación de citas propias según las reglas del establecimiento',1,'CITAS','CITA_PACIENTE_CANCELAR'),
(91,'Ver mi historial clínico','Permite consultar el historial clínico propio según las autorizaciones aplicables',1,'HISTORIAL_CLINICO','HISTORIAL_CLINICO_PROPIO_VER'),
(92,'Ver mis diagnósticos','Permite consultar los diagnósticos registrados en las atenciones del paciente autenticado',1,'DIAGNOSTICOS','DIAGNOSTICO_PROPIO_VER'),
(93,'Ver mis tratamientos','Permite consultar los tratamientos indicados al paciente autenticado',1,'TRATAMIENTOS','TRATAMIENTO_PROPIO_VER'),
(94,'Ver mis indicaciones médicas','Permite consultar las indicaciones médicas registradas para el paciente autenticado',1,'INDICACIONES','INDICACION_PROPIA_VER'),
(95,'Ver mis recetas médicas','Permite consultar las recetas médicas emitidas al paciente autenticado',1,'RECETAS','RECETA_PROPIA_VER'),
(96,'Ver mi perfil','Permite consultar los datos personales de la cuenta del paciente autenticado',1,'PERFIL','PERFIL_PROPIO_VER'),
(97,'Editar mi perfil','Permite actualizar los datos personales autorizados del paciente autenticado',1,'PERFIL','PERFIL_PROPIO_EDITAR'),
(98,'Ver mis atenciones','Permite consultar las atenciones médicas propias registradas en el establecimiento',1,'ATENCIONES','ATENCION_PROPIA_VER');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_documento` int(11) NOT NULL,
  `numero_documento` varchar(15) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fec_nacimiento` date NOT NULL,
  `genero` varchar(30) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `nacionalidad` varchar(50) NOT NULL,
  `fec_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fec_actualizacion` datetime DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `unq_persona_documento` (`id_tipo_documento`,`numero_documento`),
  CONSTRAINT `fk_persona-tipo_documento` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES
(1,1,'87654321','Maria','Gonzales Pérez','1998-04-15','Femenino','942139568','Av. Los Álamos 123','bustainocesarabel@gmail.com','Peruana','2026-09-30 15:35:35','2026-10-07 13:09:29',1),
(3,1,'72345678','Carlos Alberto','Ramírez Torres','1990-05-14','Masculino','999111222','Jr. Los Olivos 456, Lima','carlos.ramirez@clinica.com','Peruana','2026-10-02 09:14:52','2026-10-02 09:20:20',1),
(4,1,'45678912','María','Gómez Castillo','1987-09-22','Femenino','976543218','Jr. Los Olivos 456, Chiclayo','maria.gomez@clinica.com','Peruana','2026-10-02 09:31:02','2026-10-04 13:42:38',1),
(5,1,'61234587','Jorge','Vásquez Mendoza','1993-02-11','Masculino','965432187','Calle Elías Aguirre 789, Chiclayo','jorge.vasquez@clinica.com','Peruana','2026-10-02 09:31:14','2026-10-02 09:31:14',1),
(7,1,'60955852','JARE LUCERO','ISRAEL TAFUR','2006-12-21','Femenino','902190641','Remigio Silva','israeltafurlucero@gmail.com','Peruana','2026-10-03 01:41:25','2026-10-07 04:10:40',1),
(8,1,'34545555','DDDDD','VFCDXS','2026-09-08','Masculino','999999999','mnjbhgvfcvbnm,mnjbhvgf','hola@gmail.com','.ñl,kmjnhbgvfc','2026-10-05 09:40:51','2026-10-05 09:41:34',1),
(10,1,'71097079','FABRIZIO LEONEL','TANTALEAN GUZMAN','2000-02-18','Masculino','941454560','Jirón Lampa 202, Cercado de Lima 15001','guzmanfabrizio298@gmail.com','Peruana','2026-10-06 23:20:29','2026-10-07 11:57:24',1),
(11,1,'74770191','JHON ALBERTO','HERNANDEZ AGUIRRE','2006-06-07','Masculino','921741219','av nose ajkdjsjjdjsjjds','hjhon7684@gmail.com','Peruana','2026-10-06 23:23:29','2026-10-06 23:23:29',1),
(12,1,'60415749','CESAR ABEL','BUSTAMANTE INOACH','2005-02-24','Masculino','970929153','Av. Larco 123, Miraflores, Lima, código postal 15074','u22206880@utp.edu.pe','Peruana','2026-10-07 04:13:16','2026-10-12 01:43:13',1),
(13,1,'40281058','TITO ORLANDO','BUSTAMANTE CIEZA','1998-06-10','Masculino','987236463','ciudad de dios xd','correoTito@gmail.com','Peruana','2026-10-07 12:16:01','2026-10-07 12:16:01',1),
(15,1,'74090699','MOISES ALEJANDRO','RUIZ OBLITAS','2005-11-16','Masculino','966657165','es algo opcional creado de demo','U22200064@utp.edu.pe','Peruana','2026-10-12 19:34:16','2026-10-12 19:34:16',1),
(16,1,'40029519','ROBERTO MARTIN','CELIS OSORES','1994-06-16','Masculino','979813011','es una prueba','c23919@utp.edu.pe','Peruana','2026-10-12 19:48:34','2026-10-12 19:48:34',1);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `unq_rol_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES
(1,'ADMINISTRADOR','Acceso completo a la gestión del sistema',1),
(2,'MEDICO','Acceso a las funcionalidades relacionadas con la atención médica',1),
(3,'RECEPCIONISTA','Gestión de pacientes, citas y atención administrativa',1),
(4,'PACIENTE','Usuario que accede al sistema para gestionar sus citas y consultar su información personal y de atención médica.',1),
(5,'RECURSOS HUMANOS','es una prueba',1),
(6,'CONTADOR','es una demo de prueba',1);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tipo_documento`
--

DROP TABLE IF EXISTS `tipo_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_documento` (
  `id_tipo_documento` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(60) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  `longitud` int(11) NOT NULL,
  PRIMARY KEY (`id_tipo_documento`),
  UNIQUE KEY `unq_tipo_documento_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES
(1,'DNI','Documento Nacional de Identidad',1,8),
(2,'CE','Carné de Extranjería',1,9),
(3,'PAS','Pasaporte',1,9),
(4,'RUC','Registro Único de Contribuyentes',0,11);
/*!40000 ALTER TABLE `tipo_documento` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `token_acceso`
--

DROP TABLE IF EXISTS `token_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_acceso` (
  `id_token_acceso` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `expired` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT 0,
  `token_type` enum('BEARER') DEFAULT NULL,
  PRIMARY KEY (`id_token_acceso`),
  UNIQUE KEY `unq_token_acceso_token` (`token`) USING HASH,
  KEY `fk_token_acceso-usuario` (`usuario_id`),
  CONSTRAINT `fk_token_acceso-usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_acceso`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `token_acceso` DISABLE KEYS */;
INSERT INTO `token_acceso` VALUES
(1,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IiIsImF1dGhvcml0aWVzIjpbXSwic3ViIjoiYWRtaW4iLCJpYXQiOjE3OTA5OTU2MDQsImV4cCI6MTc5MTAyNDQwNH0.t4iWoteb4djCUUoZbZvaKB-QzJGDX0ML_gkzZu2Mq-dkuP0vHPqR80C4qk8RjGMBR0K_fmx22DgZYdS1fEH4Qg',1,1,'BEARER'),
(2,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDA2NjU1LCJleHAiOjE3OTEwMzU0NTV9.ZbdEqf5LnR-ifKv5BW7cERxiDgcWL9KjZqHT4eXUIgGEHISVhPp-RuVddTLENm6XtgBDbSk1vcEDkJukzTAxLQ',1,1,'BEARER'),
(3,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDA5NjMxLCJleHAiOjE3OTEwMzg0MzF9.Uzy9EsMzOBNWz9ZpwNPUOEbSfbmbgO5S07e_6DAeJWn4eKzzVEq1ArEkk076dl54o-Fvmy9WyYHKQpWrnA44Tw',1,1,'BEARER'),
(4,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDQwMTkyLCJleHAiOjE3OTEwNjg5OTJ9.6hYtVH_tK2ThqjNOBRgIjOy4VOXF2_y6iaBdPm54d02uvHY6iPhKV_uoFHLyDOLzDyUX2cBY_8H8ah2wFMye7g',1,1,'BEARER'),
(5,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDQwNDcyLCJleHAiOjE3OTEwNjkyNzJ9.wK4pBw0EwhLcszUfMPy6Hohos-N7B8j8dR8djC3p2nj47Xbz4-i1HSXV29BzcUmiS6MU7lN4D-dCpQ5julgsBw',1,1,'BEARER'),
(6,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU1MzM2LCJleHAiOjE3OTEwODQxMzZ9.TyrasansyTSY4I1yiGjZ75pAsr1fEbRa8GMzb7LIyWYR4PetZf-HGD2yL7JWg2kwVy9gaFPrPhrXOK-PKCYaGQ',1,1,'BEARER'),
(7,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU1MzQ4LCJleHAiOjE3OTEwODQxNDh9.zn2HgQWNLjx_8M5jiSg-sSOZjgG7KuhEUtP1cAIfqnHwzAIv2-TAdC6Yqaf_JRK8ohI0CzJTKYJXw8mEMnP7rA',1,1,'BEARER'),
(8,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU1OTI3LCJleHAiOjE3OTEwODQ3Mjd9.jduXeiPO9FaXlWV5_tK9kl-WuNK-Z7z5DJy5sifAauvx0Dn2E_voQLpJf-ZdpxLgIJC-grdSlMz6g7Q-WNyT4A',1,1,'BEARER'),
(9,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU1OTM2LCJleHAiOjE3OTEwODQ3MzZ9.Z1Wh_SOpyyZ-zWiLk2o7weqi2YxN9Eo_GAAlaFJlQcY8BQNTTSqYPv1C-fCVFPanJotUUAJ7pEb9F09e4LrtxQ',1,1,'BEARER'),
(10,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU4NTMyLCJleHAiOjE3OTEwODczMzJ9.CFc56tHVAFxoXvlQds5K-RCZfK95Uye_LdIGzpNYznyaL4PQeLH-Me1VblkoGT13UODw8V_UWOeEfcnGbhGs8Q',1,1,'BEARER'),
(11,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDU4Nzg2LCJleHAiOjE3OTEwODc1ODZ9.hSisnA3ZI4B4y2p7QvKRJtD4M3PfRumtbGuEL43bt7LXz8YEDGLiqnci8DZ_ZiIZkC0z9rVXARUIho5vZZdrAA',1,1,'BEARER'),
(12,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDY0Mjg5LCJleHAiOjE3OTEwOTMwODl9.3fh6PnU0BqjSt8cDEbMivjayoy1pxw0AyyUoMuOtcxl8A5gWK-a5tWI7DRQ6BCMVODonr2qbLqUhiNMvxx0cHQ',1,1,'BEARER'),
(13,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDY0MzMwLCJleHAiOjE3OTEwOTMxMzB9.XAJgEvu4x0fCkkCi5tWknUP1V4EjQhOLoisROHh0zouOH1xfOiJ-5oXzbUr3Y_xucJ6qLbpclNCIB2bFaf4mcA',1,1,'BEARER'),
(14,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDY1OTkyLCJleHAiOjE3OTEwOTQ3OTJ9.md1sZ7jvtJY7qYtdw5riU0fvCE21nDrhstUhsDZyL1oQlRhh67CZeoFUaibmmts7hQgbq8_H4WSVC9I4X6fcPw',1,1,'BEARER'),
(15,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDcxMDAwLCJleHAiOjE3OTEwOTk4MDB9.5p_kO597A2Cjo51-74TpjBXsxcvkm8H25IUTmCc3pduipY20Qkqv1ysZdsTcLtuhzCudZxnurzBN5fDJ-Ml9Sg',1,1,'BEARER'),
(16,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDc5ODQ2LCJleHAiOjE3OTExMDg2NDZ9.h9davGQwPoIMYT3RNwNcRrrA2FtEISzduFgq-N0Xps6ekPGXEu9gfqXqJIlBTV6DkvAZO97YQSxr8lpq0QKdSg',1,1,'BEARER'),
(17,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMDc5ODY2LCJleHAiOjE3OTExMDg2NjZ9.5o8RI_7LAVQEINTPheEDhvg9SfECkMLoetZ2nDi8LNANSRwz3MdD1ZMx--e2eWohzHbypsprANZMaMRPr7ohJA',1,1,'BEARER'),
(18,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTM1MDQ1LCJleHAiOjE3OTExNjM4NDV9.oU4yBRCFU3RgXmfagpVueYSu9tjOkoTBBmbC8QJZ6DbUnMlZDLgXzu7SA4-wHSa6BPgwK7SWAmpn-S4I9XvfsQ',1,1,'BEARER'),
(19,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTM1NDkwLCJleHAiOjE3OTExNjQyOTB9.Ks4PE4FjQcJv5tZaY2vMqJGDDW8N9Ye3MeSUJI8W80TRh9lD2HL0dPcGCOzfG5_hnjLIrWS3XFd2jfe0rfHPfw',1,1,'BEARER'),
(20,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTM1NTAwLCJleHAiOjE3OTExNjQzMDB9.V7sEStZVs57M4ZJ1rmSr8g4yavp6L3lKnHJTqhx0yt287c0URzKGqsQEHCLY-ZHKeAf6Xp6ru9qhLD8HdrYxgg',1,1,'BEARER'),
(21,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTM3OTIyLCJleHAiOjE3OTExNjY3MjJ9.IB-Lg3awXzn9Tc_G_Hyc2zhJpHU5IeluKq6Zl0QCg1tx8sYnI7etQV0m9ggwGWv0qEYituIFGWEY8Gv3MLJ4ag',1,1,'BEARER'),
(22,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTM3OTI3LCJleHAiOjE3OTExNjY3Mjd9.2wn_6fmc59RZ_rowBUwXVuekYa0C1EXIblx5KnHawMkCBMgSSv-RDnZPZNIi6s-JjGre7RUMsA4Df1OyMBDp5A',1,1,'BEARER'),
(23,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg1NDM3LCJleHAiOjE3OTEyMTQyMzd9.IUCY12eC74kQifF4F3FMr5szrQzt5TYycrgJ_shM_Oeiv3y7qaLKr8DEiPgQlTy1HjQ7XvtnqbdwdIVftHPL7w',1,1,'BEARER'),
(24,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg2NjU5LCJleHAiOjE3OTEyMTU0NTl9.Yn7GJ-giM0brnvk71eWlJX2kmLVRwTH6ClHvDgJpJ4SP_2ztzurD6toWxVee68iRRo2b663fNVNJyaAw3ADJkw',1,1,'BEARER'),
(25,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg2Njc3LCJleHAiOjE3OTEyMTU0Nzd9.h-IZpBsWb7UXvf6Un2ZkUWx3OBh4En8tSPOej4ZehBSlJyEbEXFleyMtRp1VvxTQt-vA4fOw_hTqMqHZElooGg',1,1,'BEARER'),
(26,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg2NzAzLCJleHAiOjE3OTEyMTU1MDN9.6VpPF64Toh2D4BQBUgnZ1UEop1kVJt4EC_4KsjQSLZ_Vqu15hud3ewRiOJqmnxLMXcHX2jsN_YsCYoIo9vvyRg',1,1,'BEARER'),
(27,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg2NzA4LCJleHAiOjE3OTEyMTU1MDh9.IfZ4ZjLWw5Ia1yXqP9n-OmtdxyfY-kl3Rl0kfjwCkv94ZhCqZ5DwyIbxgvFDvdxIZtGCVt9ZY2baKZV2uRU6Jw',1,1,'BEARER'),
(29,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMTg2OTU2LCJleHAiOjE3OTEyMTU3NTZ9.aWw-w_OSetNwhDdJZ-NaWcE0FTpNVpPtNFwhYtMIKpPdQs_4nbCLqaVFLjbfoRIcLuPQ-lgPjFFTyxDJ4EOd1Q',1,1,'BEARER'),
(30,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjExMDQ1LCJleHAiOjE3OTEyMzk4NDV9.Gw5Qq5lLFH-B09e1O9TIez4iSd2P20U48Hx1BoBtvPmvIrKiAtYIscLvx13Pane27N2FedzkKKb1yNtlQtqugw',1,1,'BEARER'),
(31,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjE0NDIxLCJleHAiOjE3OTEyNDMyMjF9.DbfaRlP_I0w6PewWYxf4yLvTxMl8-pDmOMpDDh6sHKjTiWOMIZ3FS8sIk1i8JZEkxD7W4MkTGL7FUN-N64twDQ',1,1,'BEARER'),
(32,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjE3NzI0LCJleHAiOjE3OTEyNDY1MjR9.odRm44iJiU6DwwaSPWrjTSH4WXajHHzfvou_NoAFL_VDyGcnVuzLlAlN7Nfaq0tNozlPu7iYWOG5LUl2wSu1ZA',1,1,'BEARER'),
(33,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjkzODk1LCJleHAiOjE3OTEzMjI2OTV9.P-CxnhLJggsHTzglLe4LEQHNy8DDzqXCPp8TY-MznM79LqPcpjKIa63tSwtw6rT-7uVhl9ArDFLofI1EQ3--ww',1,1,'BEARER'),
(34,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjk0NTUwLCJleHAiOjE3OTEzMjMzNTB9.L_iQhNNfJ-9adVsCjktarKfeo_EHhOrbLOGLLCS4Q1KZJJSQlAQzU6bkpvLUzf6NKkWix3Xp66Qd45yUni0kDQ',1,1,'BEARER'),
(35,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMjk0NzkwLCJleHAiOjE3OTEzMjM1OTB9.fz0me32rKXOCyyis9JD2KDaj-yLzkuQnKffcq2Wk3mIbUDSHdmsHr6TnDHkbU5sITbKqedjBPeV_J2TM0v_cuQ',1,1,'BEARER'),
(36,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzEzMDcwLCJleHAiOjE3OTEzNDE4NzB9.4rOKnuuAKDr2ObBOlevjDYko-phxscOHIlrqxShHW3QrU7FVUjXVLUkKBJ1fH_5w4JxYUU2wHEaNOS_QdddJRA',1,1,'BEARER'),
(37,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzEzMDgzLCJleHAiOjE3OTEzNDE4ODN9.TyNKAk-UxhtkcHb6oAHTRNBm9ioMwxzW7X9IqnPSAF5LVU63_X5i_pzGH5arABGgql8d7WyhLnCB8eQtrA1WHw',1,1,'BEARER'),
(38,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNDI1LCJleHAiOjE3OTEzNTIyMjV9.XPlOUDL5uA9EjUZnAwsTJOkB9bbi8XywJS2aHZVWCcb5mCme-A4iU5eMt9kRPIMe0gOT-Rm2dPecKPzMfmtatw',1,1,'BEARER'),
(39,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNDY0LCJleHAiOjE3OTEzNTIyNjR9.lB1ipRvDtWMupsI4LP6aI-Yoeupy0ofxE6UXey9NF6BVBCMUvQ3o1fWqH7WYngd3f719zeKv_TTiMMvb5TdYFA',1,1,'BEARER'),
(40,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNDk1LCJleHAiOjE3OTEzNTIyOTV9.5U1cjhxms_PTWngqNv7iWci1XZ8saeiodIFdLsw9vUsj9hsdBTU_KQxt9IxLnkj4-X-KJFXQo28h5Wz-mYk1QQ',1,1,'BEARER'),
(41,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNTAzLCJleHAiOjE3OTEzNTIzMDN9.GlmfGJcL-UyQKpbDcmHQOINEMv4z5Rs2B0_YjdIUtYEuI-n-61GYEWwA4n1o7EsukOhzX91jRM4TPNSNGIflfw',1,1,'BEARER'),
(42,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNTI2LCJleHAiOjE3OTEzNTIzMjZ9.ZwdkebWikJCvCOHCScT0A6F9rXC-ZrHouc-uLJfK1M8fWVR5xFeWOJUSnzXN2FT7fpMvIOEF8qf5IzfsHrUKgw',1,1,'BEARER'),
(43,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNTMzLCJleHAiOjE3OTEzNTIzMzN9.Y8nVwvqDnZh6QqRoUW3sRETnhAW9FB-mcDji8YPP9M8syiRAxzx41yljzpzIHY2DraJdKMxwcJ0LLAZWg8u0yg',1,1,'BEARER'),
(44,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNTg0LCJleHAiOjE3OTEzNTIzODR9.zVBJUjRe_5H1D59edonkfCBwKvObTFbBcEh1dw5K8tTSVnrgSEz7dA9I9rmA2r5uBhhlyz1wtRWmpNW0ZSHEYA',1,1,'BEARER'),
(45,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzIzNTkwLCJleHAiOjE3OTEzNTIzOTB9.MfxUtPS_eThI08W_sUhp7opcpHRanoBNJIzI3CqyKMtEZoAlGNhXGR9ycmf3TjvEby_QaPKXGt932paEVpnDQA',1,1,'BEARER'),
(46,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzQ1NTIzLCJleHAiOjE3OTEzNzQzMjN9.2KK6uipHuBy1aW5OhGnC8g8jkp9s4JRSmuVc19xK1DRh61cXWPvfW3KjnYJcHY-RxNNF0kTFfEbv5gPLFZxsOw',1,1,'BEARER'),
(47,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzQ1NTMxLCJleHAiOjE3OTEzNzQzMzF9.2XSRdQJ7h07WlKg4WybBLFfnTismNj6KK7ESq_lGaYa9rUVe7-7oi_JFteCgk5D0rtmdtOF0e4uoixT1fQPfIA',1,1,'BEARER'),
(48,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzQ1NTMzLCJleHAiOjE3OTEzNzQzMzN9.PfbB7h93uHDtAS8FvS3vNgoDLahnYlaO2BrrQJpHLJMa1EnUB5EZxiHVwM-v7M69G6Sqvx8Q7EQZDWnetVWOtw',1,1,'BEARER'),
(49,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzQ2MDA1LCJleHAiOjE3OTEzNzQ4MDV9.z3vWdzDf8XHkRy45S2ACjFLhqzv_fSF2b0wQo0VdDShDWkunZxfYKL9t59XPJF0HJAoO8_s1actVjkckAYVGLg',1,1,'BEARER'),
(50,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM1MDU1MiwiZXhwIjoxNzkxMzc5MzUyfQ.UW_NlxwTD_SDEG_ySIHu9_rxF5MWOJdoQYdly7Dp7rAp_xLjFw9UIm2f0hJNuLknvJ0-oHgF6Qxx6pi7Cg9jOg',1,1,'BEARER'),
(51,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzUwNjY0LCJleHAiOjE3OTEzNzk0NjR9.C7Tx2F7AiClAid4db74WrG1dd8y4qPEMrZvfxatckmvxSFsEkv2o1Owx3VJ4NY0WQlNv2mE6PMBEoiyBmWnddg',1,1,'BEARER'),
(52,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzUwNjkxLCJleHAiOjE3OTEzNzk0OTF9.xVuniyhnMj75NZmZmYrUUHTsu-1Hva58NgJOhnQOz9HTdb2mfvVQgx4yDsJZlIPL7auHAg3aul4OfWNjaAuEUw',1,1,'BEARER'),
(53,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM1MTQyOSwiZXhwIjoxNzkxMzgwMjI5fQ.hljhdYv7sPgalJ9rqjB9Idnta7iXHWXGQ0eVxOQgmD2xbgyWbehN3kA6Yuk2EO2HrtdEOWtmRK_6j2DBXnXkEw',1,1,'BEARER'),
(54,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxMzUxNDc2LCJleHAiOjE3OTEzODAyNzZ9.aVTiiWHBDj-347A0_y_Y02PKfjhIH0s_8I4gHQmj7UwpKuNNJh0Sy14WrmoJKYPEePbtqrfUOJOZn3p5v-U3mg',1,1,'BEARER'),
(55,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYxODQyLCJleHAiOjE3OTEzOTA2NDJ9.s-GzIeO6_GWKKRrAFeV8k3xeSfJoFXUvY-ytHl5IXtP5XgbUEuak39T5y0xDsjldvWeo9ToS5DwgKeLdTYjnSA',1,1,'BEARER'),
(56,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYxODQ5LCJleHAiOjE3OTEzOTA2NDl9.EN4icFObGXEavlbFHkIio8ypcqJM6tsXhknhzLlNHoCCgnVUYwOiDc-8haT3B1pMLtFl0QS6mjlp0_UF3TJrXg',1,1,'BEARER'),
(57,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxMzYyMDU4LCJleHAiOjE3OTEzOTA4NTh9.AJneli5tCmZKGqLlGMSg1Lm-NIqQeUIM7uFrL0_0IhFDA73R8zRQ0cwD8YQUP_YoEmgT7vXoPfUlgiT92gnGQQ',1,1,'BEARER'),
(58,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxMzYyMjQxLCJleHAiOjE3OTEzOTEwNDF9.ESWPHgMM6vOh2HO9vjj5qmvNAkXIiesEhWz89Q4LAvxciUWqR3_P7fbxHVM8IIMglpmaLbWNyZsdI5nJXZ3Otw',1,1,'BEARER'),
(59,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxMzYyNzE0LCJleHAiOjE3OTEzOTE1MTR9.4ie1fO_DBZ0Xvl_kSe1rSLXwNTgKEV51nT9kCrAB08B_7WmouDkzxoNoA4dTWMXtBh4-Mafs6W4xn4USvmZX0A',1,1,'BEARER'),
(60,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjI3NTksImV4cCI6MTc5MTM5MTU1OX0.z5RzUtOO8J7_-jy5GJK4G-B8PB8PTQEWIefiHCeC3PH55LG8SkWNbRTLxGm2PWIBA8EF5cQaloXQXhfr1o1sFA',1,1,'BEARER'),
(61,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjI5NjcsImV4cCI6MTc5MTM5MTc2N30.79nNVfntv7vy-Qi1m5B5NDq5r8I9UotQlNMvfYkNlOBkjgxDs6VtxzwBbiN0Yx0uA6jVcp7Bq5BcQoEirV0bEQ',1,1,'BEARER'),
(62,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMwNDcsImV4cCI6MTc5MTM5MTg0N30.xbL4nfivyjq8pJwXaw3zjZdJIDJeAeEJie0TMw5WI-crzuP6LZzI3gmtX5QV4RUl-i9_qTrZrRZNijlYGErUvA',1,1,'BEARER'),
(63,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMwNTAsImV4cCI6MTc5MTM5MTg1MH0.CZOryVuaF0tNEwZjDpTnczWDoYoVziOX-nZQYUC2Nz8e24UV7LASxVy50p5oE9WmpUOXcUpwKSfCLPJYSgtrIg',1,1,'BEARER'),
(64,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMwNzIsImV4cCI6MTc5MTM5MTg3Mn0.b2Vg2vtl5Y7WWi6ZeARojaHW8vbRqIfUQsiI6WBtDrKM7thk4hA2rX6LNIAkM9aDt_4ONqcNc0i-5HUu-LbYxA',1,1,'BEARER'),
(65,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzMDc5LCJleHAiOjE3OTEzOTE4Nzl9.F8gOAPtwZG51Zoume1TuUszDzwy2Xk9wujvyF8a_PH13FqZOfVQAVK8OtxOO5bxc_ObEl-E9jyq8pHvqhXJ2GA',1,1,'BEARER'),
(66,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMxMDEsImV4cCI6MTc5MTM5MTkwMX0.P0REzUNG3hR5D2y9uZtMriAPPffUXjtEWSvNT0_UWyEeK7IOO89y-hna18kbNnquG1VU62w0jp27wljG8Qkijw',1,1,'BEARER'),
(67,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMxMDUsImV4cCI6MTc5MTM5MTkwNX0.Hwg1HxTa_IDNXR80i3mYyUrVrfZ_5B2g7OJtnfuSsh-7otaGIw_xJeUE_xMpjdOXU7BB2sHbErwkOzNjYtgTqg',1,1,'BEARER'),
(71,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjMxMTYsImV4cCI6MTc5MTM5MTkxNn0.xAEsyAH4pHWwoKM7Nq8pOeOOIFGXt35-6LQqpob_ZMBniYVKuWTjPO-EyjZ1fNGdSgbLR-BPHvAb_6rFKds9jA',1,1,'BEARER'),
(72,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzMTI4LCJleHAiOjE3OTEzOTE5Mjh9.htj9_ydAXuo313wyvoyvIdKQGB3Fofa7HUm5BoXh7g81_dQZ2CRGNb10aGbFFwP4vf75EP7UOVBTzCrkJ3ivbQ',1,1,'BEARER'),
(73,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzMTk2LCJleHAiOjE3OTEzOTE5OTZ9.GnMfp5RzIZQfXdkKWU1rXRiBiKQtEuHvAVXRN2jLUlVjTJSypkBEuvZQC_w1j1HWRQPEdLlrPStjw49kAZHTEg',1,1,'BEARER'),
(74,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzMjYzLCJleHAiOjE3OTEzOTIwNjN9.ecWNr_uYZBcef0o5HeS5aXtW81FJkmjaHmuoV3twvOFRUQOo8gryRwrEiR2vlS6zNH8EiiaY011VzZx1rTqMgQ',1,1,'BEARER'),
(75,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzMzAyLCJleHAiOjE3OTEzOTIxMDJ9.C9CR5ednqeGUlFgacs7o_Zse7p2xVr2x5-N3GG6E3jSGojLqUZdRVa-AA6CneQ0oW9cFbG-C_PLBTU9aAhKlAg',1,1,'BEARER'),
(76,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjM0MjAsImV4cCI6MTc5MTM5MjIyMH0.4EzOLPIj6hFniA9BJt1KUBmoKtiw1b9PEFploJGb0H-tfTcpTGwOtXPLuebke-AS7LSNC7QIFAiPo7qlomcsLw',1,1,'BEARER'),
(77,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwibmFtZSI6Imppc3JhZWxfNjY5IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzNjM0MjQsImV4cCI6MTc5MTM5MjIyNH0.Fx3esVkoo0WaeHGufsGWSfKlelyPtna0iEzj6SL4Ty0il1Ve6S_nNOigX39PC_Q44pQb4IwWN2Uo-dIZpAu41A',1,1,'BEARER'),
(78,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwibmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzYzNDQwLCJleHAiOjE3OTEzOTIyNDB9.9TtUuIPMRDbpMofgfjqJ4gzD-yn2obXO1hP4mPwUDI8I7fb8K8nUAX6IbcVbysYquvZkoIVggsPfheXCA4-okw',1,1,'BEARER'),
(79,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzY1MTUxLCJleHAiOjE3OTEzOTM5NTF9.xvYlY2klPAWF4l_GuujkwrvQ0j2fDvb9_fVUtURbWT28qPhXiteHO55PSPu9y9gXAf1Y1x3vVZEpr15w6s2jLA',1,1,'BEARER'),
(80,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzY1MTU4LCJleHAiOjE3OTEzOTM5NTh9.NzFErcCYNs2cTkIpgOGLIkdp6wb6MdxpBt-PZxSdxwX0QopW_ndchhhsawbQB15sIXaMewkyX5EU8ry-QPn_hQ',1,1,'BEARER'),
(81,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTMwNywiZXhwIjoxNzkxMzk0MTA3fQ.LCh0nM3VoPXOsUeAtovJ5TDhg7bXjTrgg1h9-yfyekfo-hEvq9MS0fdrn8Ds6YonZtJ-4Pm0Qz3qimOoQdPMpg',1,1,'BEARER'),
(82,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTMzOCwiZXhwIjoxNzkxMzk0MTM4fQ.fXMB7l02Bq44W-4F88zpSz1Iy0qcgqxlM0y98rfPJt8Vm5bqbcGjDaIo_D1FQ060nUSAh88X1hm601kMnk6pGA',1,1,'BEARER'),
(83,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTM0MywiZXhwIjoxNzkxMzk0MTQzfQ.8GUOB-_otNdnky4UB6c8U5VfalXrigRShmj13uTXnnbVzFGpXm-LfZse1XFlvc5n4NShj_nCgcRwCBbUGxpH-Q',1,1,'BEARER'),
(84,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTM0OSwiZXhwIjoxNzkxMzk0MTQ5fQ.518B7agNPY5Ww1RTRFKZc44YgSRLWCH6GPWQyI-0mkQG-IB16MZ1lKFrQFs1MNxjKRATNt2_BLg-NyIMj29w7Q',1,1,'BEARER'),
(85,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTY4OCwiZXhwIjoxNzkxMzk0NDg4fQ.Btcf2JRXYDGxYxyLX0CtpwARLpRx6utFrIHhdB97i4JEUWn4RfICPXxlopZeoR_LcA1GPAiJ006PWpZu3LdgYw',1,1,'BEARER'),
(86,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiUEFDSUVOVEUiLCJuYW1lIjoiamhlcm5hbmRlel8xNzEiLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTczMiwiZXhwIjoxNzkxMzk0NTMyfQ.dwfxmdw1Ko2JEIzHAfzV8QC7pHkEwf59bjhfPhgWlKByUun-SvACejpIoGZ1iZDZw-y2pzZT44-O5u5mZuqeuw',1,1,'BEARER'),
(87,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwicm9sZSI6IlBBQ0lFTlRFIiwibmFtZSI6ImpoZXJuYW5kZXpfMTcxIiwiYXV0aG9yaXRpZXMiOltdLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTgwMiwiZXhwIjoxNzkxMzk0NjAyfQ.UPi9lWLipF_wHCP3L_MLia6M9kMFB1o1YwkmqE3qFFe0SmwJN2D07K4d9nqcJL6F0c09-ZYIxC9Ygu1ytwdtaQ',1,1,'BEARER'),
(88,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwicm9sZSI6IlBBQ0lFTlRFIiwibmFtZSI6ImpoZXJuYW5kZXpfMTcxIiwiYXV0aG9yaXRpZXMiOltdLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTg1NSwiZXhwIjoxNzkxMzk0NjU1fQ.OVvS04jcdIwp0UpjISALvC-INMiNbSNpCmGZ_VfU1XLWvA2Z6DhbGhSA5OL1aCDAAswFo6zxeKK5ECNO3zGdWg',1,1,'BEARER'),
(89,2,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIyIiwicm9sZSI6IlBBQ0lFTlRFIiwibmFtZSI6ImpoZXJuYW5kZXpfMTcxIiwiYXV0aG9yaXRpZXMiOltdLCJzdWIiOiJqaGVybmFuZGV6XzE3MSIsImlhdCI6MTc5MTM2NTg3MywiZXhwIjoxNzkxMzk0NjczfQ.5k1kqvRt7q5xh5NIYCR75XDibWJZ6Yw0njgYJaprLV0qHWg2-edmfb5bKOLbpdKSndkiSnXYnc1WiTbNK5wk0A',1,1,'BEARER'),
(90,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzk0MDU1LCJleHAiOjE3OTE0MjI4NTV9.MV17RszWnJhcLPbXRn5UM8lTzdSbhbPE3y6IXHjsFiZ6C-f-oq6B60ClSx4KEz8Hyg-0uN46VujWMOsPjKF1Kg',1,1,'BEARER'),
(91,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzk5Mzc4LCJleHAiOjE3OTE0MjgxNzh9.taMVx8Z2Nz6P4TnHn-wXZ4dfvFEdyzPTX6R3kKaY1d_hKzu1h7S_PjCx_RZOLOGi5xrtEIa3GvDYjKBNqQGkQg',1,1,'BEARER'),
(92,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzkxMzk5MzgzLCJleHAiOjE3OTE0MjgxODN9.E-VaSJzoiFjuXEufxnkJQfq6w0Qxr2HGrRzqnQT7MeqVJEM75MU8qfoATYPygdtRuWsBuPTbHGswpyVuA8WC0Q',1,1,'BEARER'),
(93,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwiYXV0aG9yaXRpZXMiOltdLCJyb2xlIjoiTUVESUNPIiwibmFtZSI6Imppc3JhZWxfNjY5Iiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzOTk0NjMsImV4cCI6MTc5MTQyODI2M30.E4J3e3lkTEvsXXzI9qxrxagrj6fSm76I929rO5cRy9uBleP2oWSdunqnXwgVOaNPPWNzxl4guXSzov1rw1OgiA',1,1,'BEARER'),
(94,4,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0IiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiamlzcmFlbF82NjkiLCJyb2xlIjoiTUVESUNPIiwic3ViIjoiamlzcmFlbF82NjkiLCJpYXQiOjE3OTEzOTk3NDcsImV4cCI6MTc5MTQyODU0N30.CacjIK1jlj-KuKs0aUfCgd9V8n8UK7gfYBjY0uQhmgvycZljxXVjRR83tzwcCO3wIWCcGO0gfvwWi1V48iTpOw',1,1,'BEARER'),
(95,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTEzOTk3NjEsImV4cCI6MTc5MTQyODU2MX0.svOmJ1DtRz0VxYTwfyJtxZZINtPz305ZDHqGAJD0ad3oBvwTarS3Ntl3KJqElgidFmAZcm-P3aEr6QeBTFRE5A',1,1,'BEARER'),
(96,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIl0sIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3OTEzOTk5MDgsImV4cCI6MTc5MTQyODcwOH0.BAwryCOOkELVNbrH4VLkgl5Js4BCF6n9s8bqqHAT07FKE9ctGQJQDzV0GJWSAQ7TgrWS5zDmXzFcui4SJU4ePQ',1,1,'BEARER'),
(97,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIl0sIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3OTEzOTk5MTIsImV4cCI6MTc5MTQyODcxMn0.dyrKWk2G4fawc9Eyj2eM9CKvFXi2z_pESrpgS1rcws1736GL0HfHvZr0SWNRbyg2NPIcLALIf-UL0msTZPHTIQ',1,1,'BEARER'),
(98,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc5MTQwMDAzNSwiZXhwIjoxNzkxNDI4ODM1fQ.G7KJvF1wd0InW9kLpxNnnfudW5MmGM8FGPrpqq6q6wq0E3LJvY-pOqLOvtokAqXyIqQjKDHqZeevSl7VofsZwA',1,1,'BEARER'),
(99,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc5MTQwMDA0MCwiZXhwIjoxNzkxNDI4ODQwfQ.Szyx0FkqeQ_Nx3jLel_yKMFYt5csMOw0uC38iVUdO5w56Xwrr22eL_hY4iyN8knLIL4C-XGChPLT6PAn3QYByw',1,1,'BEARER'),
(100,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc5MTY3MDkxMCwiZXhwIjoxNzkxNjk5NzEwfQ.UxiSlDCz7kl0R8CZVUaaOS7BRFvlMtmO08xHvIMWpvWkdTqurbK7DKjK7kT9vblza7A4fB4hab7FpnRcXoEIzw',1,1,'BEARER'),
(101,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc5MTY3MDkxMywiZXhwIjoxNzkxNjk5NzEzfQ.128O6K5JoWp3cjmbSrsfprU05GHWouPY9FszjFiDx9YF0E-BA57615mF93LM030y47_avb9zHHnG_GofnArNhw',1,1,'BEARER'),
(102,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTE2NzMyNzUsImV4cCI6MTc5MTcwMjA3NX0.yEOOt92VY_sYIu0_s-vbj8IEp4136MPHW3JAcAmu0E1IsR0heP-46Yx3k077oq7XbvGtLGTCqvXcWUtlB62__Q',1,1,'BEARER'),
(103,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NTk3MCwiZXhwIjoxNzkxNzA0NzcwfQ.TFXBMeTwzDqU1lnSf_Qmz0aUX23TyGkxMv4OsmLjVk2qEsnQMVazaV3oV02SQlnCLI-IrCmOaUD33BtRFiqLcA',1,1,'BEARER'),
(104,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NjAwNiwiZXhwIjoxNzkxNzA0ODA2fQ.jKsobN-zMmi37guP82d9VV7rgOWJFSsatIcU4gTdNy1f4J8PL3MJccf1dP5dkT-MEn89PnHww7djeT4HtMIoow',1,1,'BEARER'),
(105,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiVmVyIGVzcGVjaWFsaWRhZGVzIiwiQ3JlYXIgZXNwZWNpYWxpZGFkIiwiRWRpdGFyIGVzcGVjaWFsaWRhZCIsIkVsaW1pbmFyIGVzcGVjaWFsaWRhZCIsIkNhbWJpYXIgZXN0YWRvIGRlIGVzcGVjaWFsaWRhZCIsIlZlciBjYXJnb3MiLCJDcmVhciBjYXJnbyIsIkVkaXRhciBjYXJnbyIsIkVsaW1pbmFyIGNhcmdvIiwiQ2FtYmlhciBlc3RhZG8gZGUgY2FyZ28iLCJWZXIgcGFjaWVudGVzIiwiQ3JlYXIgcGFjaWVudGUiLCJFZGl0YXIgcGFjaWVudGUiLCJFbGltaW5hciBwYWNpZW50ZSIsIkNhbWJpYXIgZXN0YWRvIGRlIHBhY2llbnRlIiwiVmVyIGVtcGxlYWRvcyIsIkNyZWFyIGVtcGxlYWRvIiwiRWRpdGFyIGVtcGxlYWRvIiwiRWxpbWluYXIgZW1wbGVhZG8iLCJDYW1iaWFyIGVzdGFkbyBkZSBlbXBsZWFkbyIsIlZlciBtw6lkaWNvcyIsIkNyZWFyIG3DqWRpY28iLCJFZGl0YXIgbcOpZGljbyIsIkVsaW1pbmFyIG3DqWRpY28iLCJDYW1iaWFyIGVzdGFkbyBkZSBtw6lkaWNvIiwiVmVyIGhvcmFyaW9zIiwiQ3JlYXIgaG9yYXJpbyIsIkVkaXRhciBob3JhcmlvIiwiRWxpbWluYXIgaG9yYXJpbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGhvcmFyaW8iXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NjUyOCwiZXhwIjoxNzkxNzA1MzI4fQ.-IBJq1KNjD5jRutv0ZJbPg498mCWe3eHuIQhViuHU_MrDd6RPsesPceBf4iDhN_RUXOT9gEzEoCSEzYIrCiegQ',1,1,'BEARER'),
(106,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiVmVyIGVzcGVjaWFsaWRhZGVzIiwiQ3JlYXIgZXNwZWNpYWxpZGFkIiwiRWRpdGFyIGVzcGVjaWFsaWRhZCIsIkVsaW1pbmFyIGVzcGVjaWFsaWRhZCIsIkNhbWJpYXIgZXN0YWRvIGRlIGVzcGVjaWFsaWRhZCIsIlZlciBjYXJnb3MiLCJDcmVhciBjYXJnbyIsIkVkaXRhciBjYXJnbyIsIkVsaW1pbmFyIGNhcmdvIiwiQ2FtYmlhciBlc3RhZG8gZGUgY2FyZ28iLCJWZXIgcGFjaWVudGVzIiwiQ3JlYXIgcGFjaWVudGUiLCJFZGl0YXIgcGFjaWVudGUiLCJFbGltaW5hciBwYWNpZW50ZSIsIkNhbWJpYXIgZXN0YWRvIGRlIHBhY2llbnRlIiwiVmVyIGVtcGxlYWRvcyIsIkNyZWFyIGVtcGxlYWRvIiwiRWRpdGFyIGVtcGxlYWRvIiwiRWxpbWluYXIgZW1wbGVhZG8iLCJDYW1iaWFyIGVzdGFkbyBkZSBlbXBsZWFkbyIsIlZlciBtw6lkaWNvcyIsIkNyZWFyIG3DqWRpY28iLCJFZGl0YXIgbcOpZGljbyIsIkVsaW1pbmFyIG3DqWRpY28iLCJDYW1iaWFyIGVzdGFkbyBkZSBtw6lkaWNvIiwiVmVyIGhvcmFyaW9zIiwiQ3JlYXIgaG9yYXJpbyIsIkVkaXRhciBob3JhcmlvIiwiRWxpbWluYXIgaG9yYXJpbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGhvcmFyaW8iXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NjUzNSwiZXhwIjoxNzkxNzA1MzM1fQ.CCC5Y7ijui4pAKKUSC1NZTOCUrX5ObaJe97arJiF3ITlYRnUbxB9vqPM5uW444EEmOeflM3410C3qss_3Ys_uQ',1,1,'BEARER'),
(107,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiVmVyIGVzcGVjaWFsaWRhZGVzIiwiQ3JlYXIgZXNwZWNpYWxpZGFkIiwiRWRpdGFyIGVzcGVjaWFsaWRhZCIsIkVsaW1pbmFyIGVzcGVjaWFsaWRhZCIsIkNhbWJpYXIgZXN0YWRvIGRlIGVzcGVjaWFsaWRhZCIsIlZlciBjYXJnb3MiLCJDcmVhciBjYXJnbyIsIkVkaXRhciBjYXJnbyIsIkVsaW1pbmFyIGNhcmdvIiwiQ2FtYmlhciBlc3RhZG8gZGUgY2FyZ28iLCJWZXIgcGFjaWVudGVzIiwiQ3JlYXIgcGFjaWVudGUiLCJFZGl0YXIgcGFjaWVudGUiLCJFbGltaW5hciBwYWNpZW50ZSIsIkNhbWJpYXIgZXN0YWRvIGRlIHBhY2llbnRlIiwiVmVyIGVtcGxlYWRvcyIsIkNyZWFyIGVtcGxlYWRvIiwiRWRpdGFyIGVtcGxlYWRvIiwiRWxpbWluYXIgZW1wbGVhZG8iLCJDYW1iaWFyIGVzdGFkbyBkZSBlbXBsZWFkbyIsIlZlciBtw6lkaWNvcyIsIkNyZWFyIG3DqWRpY28iLCJFZGl0YXIgbcOpZGljbyIsIkVsaW1pbmFyIG3DqWRpY28iLCJDYW1iaWFyIGVzdGFkbyBkZSBtw6lkaWNvIiwiVmVyIGhvcmFyaW9zIiwiQ3JlYXIgaG9yYXJpbyIsIkVkaXRhciBob3JhcmlvIiwiRWxpbWluYXIgaG9yYXJpbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGhvcmFyaW8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NjY3OSwiZXhwIjoxNzkxNzA1NDc5fQ.TuCtuT8xlF4dHNune8fUbSgjFtEGRaF9XKqBCmNt6IA-JL4kPxMc62vvl7YBdnJ6D7PaZpnOKZMXLDH0qBnwiA',1,1,'BEARER'),
(108,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiVmVyIGVzcGVjaWFsaWRhZGVzIiwiQ3JlYXIgZXNwZWNpYWxpZGFkIiwiRWRpdGFyIGVzcGVjaWFsaWRhZCIsIkVsaW1pbmFyIGVzcGVjaWFsaWRhZCIsIkNhbWJpYXIgZXN0YWRvIGRlIGVzcGVjaWFsaWRhZCIsIlZlciBjYXJnb3MiLCJDcmVhciBjYXJnbyIsIkVkaXRhciBjYXJnbyIsIkVsaW1pbmFyIGNhcmdvIiwiQ2FtYmlhciBlc3RhZG8gZGUgY2FyZ28iLCJWZXIgcGFjaWVudGVzIiwiQ3JlYXIgcGFjaWVudGUiLCJFZGl0YXIgcGFjaWVudGUiLCJFbGltaW5hciBwYWNpZW50ZSIsIkNhbWJpYXIgZXN0YWRvIGRlIHBhY2llbnRlIiwiVmVyIGVtcGxlYWRvcyIsIkNyZWFyIGVtcGxlYWRvIiwiRWRpdGFyIGVtcGxlYWRvIiwiRWxpbWluYXIgZW1wbGVhZG8iLCJDYW1iaWFyIGVzdGFkbyBkZSBlbXBsZWFkbyIsIlZlciBtw6lkaWNvcyIsIkNyZWFyIG3DqWRpY28iLCJFZGl0YXIgbcOpZGljbyIsIkVsaW1pbmFyIG3DqWRpY28iLCJDYW1iaWFyIGVzdGFkbyBkZSBtw6lkaWNvIiwiVmVyIGhvcmFyaW9zIiwiQ3JlYXIgaG9yYXJpbyIsIkVkaXRhciBob3JhcmlvIiwiRWxpbWluYXIgaG9yYXJpbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGhvcmFyaW8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NjY4NywiZXhwIjoxNzkxNzA1NDg3fQ.-8U30y8gowGA32v7XUmhYBaYw0DnV7QuMbH6Vusma3ofsLJRfHpoCpXkoClQDeDxiwrblH37UJf2JK0sZ2kiSw',1,1,'BEARER'),
(109,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiVmVyIGVzcGVjaWFsaWRhZGVzIiwiQ3JlYXIgZXNwZWNpYWxpZGFkIiwiRWRpdGFyIGVzcGVjaWFsaWRhZCIsIkVsaW1pbmFyIGVzcGVjaWFsaWRhZCIsIkNhbWJpYXIgZXN0YWRvIGRlIGVzcGVjaWFsaWRhZCIsIlZlciBjYXJnb3MiLCJDcmVhciBjYXJnbyIsIkVkaXRhciBjYXJnbyIsIkVsaW1pbmFyIGNhcmdvIiwiQ2FtYmlhciBlc3RhZG8gZGUgY2FyZ28iLCJWZXIgcGFjaWVudGVzIiwiQ3JlYXIgcGFjaWVudGUiLCJFZGl0YXIgcGFjaWVudGUiLCJFbGltaW5hciBwYWNpZW50ZSIsIkNhbWJpYXIgZXN0YWRvIGRlIHBhY2llbnRlIiwiVmVyIGVtcGxlYWRvcyIsIkNyZWFyIGVtcGxlYWRvIiwiRWRpdGFyIGVtcGxlYWRvIiwiRWxpbWluYXIgZW1wbGVhZG8iLCJDYW1iaWFyIGVzdGFkbyBkZSBlbXBsZWFkbyIsIlZlciBtw6lkaWNvcyIsIkNyZWFyIG3DqWRpY28iLCJFZGl0YXIgbcOpZGljbyIsIkVsaW1pbmFyIG3DqWRpY28iLCJDYW1iaWFyIGVzdGFkbyBkZSBtw6lkaWNvIiwiVmVyIGhvcmFyaW9zIiwiQ3JlYXIgaG9yYXJpbyIsIkVkaXRhciBob3JhcmlvIiwiRWxpbWluYXIgaG9yYXJpbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGhvcmFyaW8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3Njc5NywiZXhwIjoxNzkxNzA1NTk3fQ.GpTNvtM1Wg1h28H_siht3T82h_lyXG3WIQFiwPZIvCKfIT0-azlsHdn7hVijMwXHV4MsqXPwcyGtbhk81TLXnA',1,1,'BEARER'),
(110,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3Njk3MSwiZXhwIjoxNzkxNzA1NzcxfQ.DKAxUyIL_vdlF0fELaOn6L1pRIhc3WHSnTmDuMNeS8IRT8SHsQCuCtp8AwlJvZQu5tUQliHgLYe7tCyc-H2Ihg',1,1,'BEARER'),
(111,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3Njk3OSwiZXhwIjoxNzkxNzA1Nzc5fQ.7Fey9tsvqhKQKh3G_Y-7PXOtukTu05_pqt4NUj9OK1vYYAjI5TyKsP0GTyfygebwvIHQm45r3p1Tm-aEiJ594Q',1,1,'BEARER'),
(112,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzQxMiwiZXhwIjoxNzkxNzA2MjEyfQ.eJSxll7ttca01wGmA93dfkOduSNAv8Hn0gcgxrykO5JgBkWe08nUsNV_GsCuB6rAZiJ4jShdl71respsZoaVXQ',1,1,'BEARER'),
(113,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzQyNCwiZXhwIjoxNzkxNzA2MjI0fQ.x0AL5YtXOaud9EUJU34IQcGJbvobaJB1nubXVH8r8Oq5FuYLWPwUsrDHpXq_ulNwa6nhBKFNzas_0agvJqXjZg',1,1,'BEARER'),
(114,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzUxMiwiZXhwIjoxNzkxNzA2MzEyfQ.jfha5AQDpQdDVRGZh1ABLGVjcktu0QnpjeMrlU-GII5rvxmB5Cy16mUmVUigKKPziPbXWYFN4b60mFPLSmkZQA',1,1,'BEARER'),
(115,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJWZXIgZXNwZWNpYWxpZGFkZXMiLCJDcmVhciBlc3BlY2lhbGlkYWQiLCJFZGl0YXIgZXNwZWNpYWxpZGFkIiwiRWxpbWluYXIgZXNwZWNpYWxpZGFkIiwiQ2FtYmlhciBlc3RhZG8gZGUgZXNwZWNpYWxpZGFkIiwiVmVyIGNhcmdvcyIsIkNyZWFyIGNhcmdvIiwiRWRpdGFyIGNhcmdvIiwiRWxpbWluYXIgY2FyZ28iLCJDYW1iaWFyIGVzdGFkbyBkZSBjYXJnbyIsIlZlciBwYWNpZW50ZXMiLCJDcmVhciBwYWNpZW50ZSIsIkVkaXRhciBwYWNpZW50ZSIsIkVsaW1pbmFyIHBhY2llbnRlIiwiQ2FtYmlhciBlc3RhZG8gZGUgcGFjaWVudGUiLCJWZXIgZW1wbGVhZG9zIiwiQ3JlYXIgZW1wbGVhZG8iLCJFZGl0YXIgZW1wbGVhZG8iLCJFbGltaW5hciBlbXBsZWFkbyIsIkNhbWJpYXIgZXN0YWRvIGRlIGVtcGxlYWRvIiwiVmVyIG3DqWRpY29zIiwiQ3JlYXIgbcOpZGljbyIsIkVkaXRhciBtw6lkaWNvIiwiRWxpbWluYXIgbcOpZGljbyIsIkNhbWJpYXIgZXN0YWRvIGRlIG3DqWRpY28iLCJWZXIgaG9yYXJpb3MiLCJDcmVhciBob3JhcmlvIiwiRWRpdGFyIGhvcmFyaW8iLCJFbGltaW5hciBob3JhcmlvIiwiQ2FtYmlhciBlc3RhZG8gZGUgaG9yYXJpbyJdLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzUzMiwiZXhwIjoxNzkxNzA2MzMyfQ.Te1Q9ym6sSfiWlfaQJwxYUBFzvsJweCyHYSLySPMFJTFi1haVTo9Ubg_WHGVcntRoqRDpk8J-L01r2J1LVQbag',1,1,'BEARER'),
(116,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzczMCwiZXhwIjoxNzkxNzA2NTMwfQ.PMKITff_LemBzOBJ3IGeNF-E8S9hBr43DPmw_bHIvvs8BbLBCbKCZChCTw76mUsPAjKwhTEg1eV2ZcOZYk_taA',1,1,'BEARER'),
(117,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTY3NzczNSwiZXhwIjoxNzkxNzA2NTM1fQ.969fPbhSLPccwv_ecT8SEfa3ZVfygjPqNQ2-x9r4LpgvDHqG63j4ugzWXkE85BHPIf10J46pb3ctAeqIXDFXUg',1,1,'BEARER'),
(118,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc3Nzg3MSwiZXhwIjoxNzkxODA2NjcxfQ.KX_n38slT93GsNoi5zbX1JEldy1UnYCB_-JEMPowo9sUKcIpHGLLcKqbBGVDihgrg2X-1VnnIO6VEDrmsMFaFA',1,1,'BEARER'),
(119,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc3ODUxNSwiZXhwIjoxNzkxODA3MzE1fQ.B7n7uoP1H0mvyvc6r5T6_w-Dzi_GTxT98As_HVfC0zVoB1Z2x-FUWECBA10vG95FAgBfKDNi_L8VU07Sk44Gcw',1,1,'BEARER'),
(120,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc3ODUyMiwiZXhwIjoxNzkxODA3MzIyfQ.62FU6-8g7RTCEWewKfMk5DM8UQxvGIa7PyVmu9bhohWDxNenuOUvTFeXlqkUV9xMP4PQoWde8bfktPK4qQ1T5w',1,1,'BEARER'),
(121,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc3OTc0NCwiZXhwIjoxNzkxODA4NTQ0fQ.3Ifwm4qnQ4SXdJ_-Ckih8ctZguzEGET4ufbmK13NDfa1GbGWBPQXHlvrFWSnfwPi2AvEuUP8YnpZ2ybMu_YV_Q',1,1,'BEARER'),
(122,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc3OTc1MiwiZXhwIjoxNzkxODA4NTUyfQ.dO3OA0tiXcCUYfRhSSVypjUp4bc43zFzDAMpEa_4QLdKakHPGLARHWmbm4qz0FfS9f-48ws0KAFukuT8X9rbPw',1,1,'BEARER'),
(123,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc4NzQ3NCwiZXhwIjoxNzkxODE2Mjc0fQ.F3lR_mXnDtLCSakGboC7wpAisbKDP1Zx3qutGhvOFzKZTU7i6-gk3Kb7hHt_UflgAV--YG9htKo_iMQQlw-ZwQ',1,1,'BEARER'),
(124,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6Ik1FRElDTyIsIm5hbWUiOiJjYnVzdGFtYW50ZV83MzUiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTc4NzQ5MiwiZXhwIjoxNzkxODE2MjkyfQ.S3u5XAAA3IEAwQ1VHVVt3-p-vOFPGWmsDMWYE1pkb2IqFMIOqgcGtm1-9h4iYpwcV9lWVCz1JUroQQXGVTsVMg',1,1,'BEARER'),
(125,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6Ik1FRElDTyIsIm5hbWUiOiJjYnVzdGFtYW50ZV83MzUiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTc4NzU1NCwiZXhwIjoxNzkxODE2MzU0fQ.T_mdZxgjKqUO1OE7wPCGUJP0AtRWhCW8J4Fg3mZ6fc-vla4Uukxyy4BVL5HATyvrKXA4QPzIfpJrYLYKOnbqYQ',1,1,'BEARER'),
(126,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6Ik1FRElDTyIsIm5hbWUiOiJjYnVzdGFtYW50ZV83MzUiLCJhdXRob3JpdGllcyI6W10sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTc4NzU2MSwiZXhwIjoxNzkxODE2MzYxfQ.RSXlhVl-mK89rBrfc_vdjkoj_qgSkXV9zCzdUKUMmB_A7NxxP4Uj6P_atjeN4DOwlaZEl5BQxxR064RQL7IXag',1,1,'BEARER'),
(127,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc4Nzc3OCwiZXhwIjoxNzkxODE2NTc4fQ.GWYy8PEw9egvSRlWbrSAaBYnVme6EHc_wjhDQ6lhVy20nhhLH2-xlSGe0VeETi8Og4wnOf-xoB628TuRVq_frg',1,1,'BEARER'),
(128,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTc4Nzk1MSwiZXhwIjoxNzkxODE2NzUxfQ.g1P7zHnYc-GUyNaZdLqyL2ISmGIn9So61gunm_DZa-I_LYzo6a1nLTIMoYjot_QY-88vdKICj46FZr2ItWRi0A',1,1,'BEARER'),
(129,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgxNDc3NCwiZXhwIjoxNzkxODQzNTc0fQ.9wve6CXMSihcbrIYKAzraszNrABc1QYUymo_I9CHtssvwCp2nBEZosr_VBfrs_MlKOgLZY6lZt6BlsADnDBC_w',1,1,'BEARER'),
(130,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgxNTIwMiwiZXhwIjoxNzkxODQ0MDAyfQ.HwRNjKftuzGTlE-DsPJm0z86DHkUuxe6s5D6BtvS4z6rCYX20TbKm-KBP6ePO1q5k8QqQoHWr8TfbX79aeuGjQ',1,1,'BEARER'),
(131,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPU19HRVNUSU9OQVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyJdLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgxNTIxMywiZXhwIjoxNzkxODQ0MDEzfQ.IxOZ92jLxLBoHodoSkyj9RgZazbszDX0Y6INLQNyqI0zNCK1b6MmVaXjtV8YXBwQTNPLW6q736G3ARl5LrZ9fQ',1,1,'BEARER'),
(132,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTI1NiwiZXhwIjoxNzkxODQ0MDU2fQ.I8Ym-O4ZXIgZa8bXX43vwIBd3vc7-zNlF0hi0wXAF1Dgu8smp1TEtm6eusJPcGvSRAed-Bgebjgn5gGsx-f5KA',1,1,'BEARER'),
(133,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTM3OCwiZXhwIjoxNzkxODQ0MTc4fQ.S5jAltcxegocjwaiAQ1rW8xJ2aQzXa5wEtXV6Z_45Ybtf6CF3kQDOtLpCsuoXVD6nzTBFEFW_n3fXv51QRvxgw',1,1,'BEARER'),
(134,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTM5NCwiZXhwIjoxNzkxODQ0MTk0fQ.wLBoQaiO0x6EWBucWautevKy84PhuHorZpEBu9HmKO8Eo9oqDysK5nTyj_EAbme1oJ3eEys2o2MmJ9jw0hH4QA',1,1,'BEARER'),
(135,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTQ0NywiZXhwIjoxNzkxODQ0MjQ3fQ.739jEK-8eqCZ8YNG8fZk97iOQm9yQU0Kra45VinIwyYVm8Rt5n_1Z_mkq99LGQDp4DRIG7EvHMrYSRwhdpCHmw',1,1,'BEARER'),
(136,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTQ1MywiZXhwIjoxNzkxODQ0MjUzfQ.t4QNNqEOivORDa-fchUnoF0FFOWnARc-59yMa0IJ4vl3vrCZkj1AYW-3HQmJIrLdPtcHYnD53BKx4HCMX_HCPA',1,1,'BEARER'),
(137,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTU5MSwiZXhwIjoxNzkxODQ0MzkxfQ.u7ds6yooKvuqqxRF-Swh7sg_2zsK7ThFrEsg1G7y8B_wR5z66JXK6kaCpmtyxmQPNkmX-NTlgZkiikWEgIDBIA',1,1,'BEARER'),
(138,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTYwMCwiZXhwIjoxNzkxODQ0NDAwfQ.ZVbM1Fh4j5nA0wv-Tc-AKpp3nwIye2DHnewiVaUCH8iqIlkzbyLUppjYwGdiw36y8CRvOj3RjfJe1wIILBk8OQ',1,1,'BEARER'),
(139,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTY5MSwiZXhwIjoxNzkxODQ0NDkxfQ.LFwcZzmSRVwIyvUfMlDIGLT3-sXWg9OBmwq6lYk00d4Q-ciOhrKzkJG6bF8N3PWekgeK0xjZm34VzkXAldK2_Q',1,1,'BEARER'),
(140,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNTY5NywiZXhwIjoxNzkxODQ0NDk3fQ.XBlkcDfHbFMkRopsOflIRTqGjU2WG6pgKaL9V4x5zUESIvAnFaLN-oGBHvICrequADYysAqf6m7JfN0ruQhw2A',1,1,'BEARER'),
(141,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNjM0MCwiZXhwIjoxNzkxODQ1MTQwfQ.NcMzAud2q-OlS1JVusA47n6oezopnfDrwC4bWj24jyjcvSEfEmHOo6h9sS9_DRDPDGy_o5znPiDvxISvcl3WIg',1,1,'BEARER'),
(142,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNjM0NiwiZXhwIjoxNzkxODQ1MTQ2fQ.32YG23bGQcxQqxQ31Uy_R5CWwzSVk4gn52hgNasSCY5FyK_sEQ-atR5PeOQLqDslGIuz_cXbpnKP5FCLA7BXCA',1,1,'BEARER'),
(143,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNjM2NywiZXhwIjoxNzkxODQ1MTY3fQ.AzcQebKR_3svqVWo_-XlUWp-JMfELON8qISKeww1_6JU6Ij4z0zsV3Q5xViXY22cQTch63k-h6hdgdi0pAf-Vw',1,1,'BEARER'),
(144,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNjM3MiwiZXhwIjoxNzkxODQ1MTcyfQ.JTL7FcS6X26Um0t4FDmTNqPNepUATq6YVe4D-1G29zaCNfLZajYYnaW4q1jEq7JXvHXPPZUJfBz1n_AeoT0t-A',1,1,'BEARER'),
(145,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNzI0MywiZXhwIjoxNzkxODQ2MDQzfQ.76UBW4BPwayZShI9jDjcT-7GCcxzXww5q9YQbJhFkzT_pz1gxxjgkiLv7M4ccCGs3aHRaH-5tXNWEAJo4JQFLQ',1,1,'BEARER'),
(146,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0VMSU1JTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgxNzI0OCwiZXhwIjoxNzkxODQ2MDQ4fQ.DIKyvN9yJSWLW8uDELzCapE5t2Rvc8dr4RsviUZsaESsLNIG1y3g7ZLN0AWy2FKi25iv5H_S22X6fXqce4stng',1,1,'BEARER'),
(147,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgyNDQ5OCwiZXhwIjoxNzkxODUzMjk4fQ.nB_ll6J7NP8lhf5G0xzHppPXm5OopfPZO3GAmZlj2OFlkviGHcP1bi67yO1DpfUE02BqIpd_PHJe65qvOWbemw',1,1,'BEARER'),
(148,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgyNDUxMiwiZXhwIjoxNzkxODUzMzEyfQ.HgUx9rMjnfWxF987H5820pNvF1lDeEXFMc9SUPyWmCQX6SmxPe7XBXdyoBtpWDaVqdmNziIRleNwYWZEcqlcNA',1,1,'BEARER'),
(149,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgyNDU1MywiZXhwIjoxNzkxODUzMzUzfQ.rS1hB8mRaflfREzp6uQ7YcOfwlcAmqtWejgSjKgWfo9kAjJY03JLa6KiWhow_Hu1k3sBnVp_rZWnMwyva_1Wuw',1,1,'BEARER'),
(150,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIl0sIm5hbWUiOiJjYnVzdGFtYW50ZV83MzUiLCJyb2xlIjoiQ09OVEFET1IiLCJzdWIiOiJjYnVzdGFtYW50ZV83MzUiLCJpYXQiOjE3OTE4MjY2MTcsImV4cCI6MTc5MTg1NTQxN30.JU0Drct8zxD4UAZC5FFLxoesZZeKIPyL5wqfv_MgxZ9dYWd6e48nlpynMy4E41SgFVuXPwYWVh_dzwGJeqxAyA',1,1,'BEARER'),
(151,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIl0sIm5hbWUiOiJjYnVzdGFtYW50ZV83MzUiLCJyb2xlIjoiQ09OVEFET1IiLCJzdWIiOiJjYnVzdGFtYW50ZV83MzUiLCJpYXQiOjE3OTE4MjY2MjIsImV4cCI6MTc5MTg1NTQyMn0.YKjmOws5JnIHjxdaQRHvvVvgnnUU4rI5x1BFBGgt5HAVp2SxdLArex-8WfK6hntJbydV5OXlEbOL1nrwThs4_g',1,1,'BEARER'),
(152,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgyNzI2MSwiZXhwIjoxNzkxODU2MDYxfQ.Vz5OBg8npSj0GtIZmv49SWsvdCVtL5709h4S1AWO_e-IrcFd6gNfP8GkFOgyJeBYTPAoqUM57tNZRjMJaBWkcA',1,1,'BEARER'),
(153,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgyNzI2OCwiZXhwIjoxNzkxODU2MDY4fQ.fajCjRO9FUhgenRuiaAEhO8-HTkgnlNQksY3--_4JVm5kreVJvfk1hGnEDET1S359BCQrMq3y9WZ0StfIp4UJQ',1,1,'BEARER'),
(154,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMDI3NCwiZXhwIjoxNzkxODU5MDc0fQ.yM4bVoe8Blo2-ibX2nnkRF27naqe22mHJwfToIggAFzkdrpcOgo8UQdB5QJfyyD8kx-6rXnKBvK2T3A2QKwz8w',1,1,'BEARER'),
(155,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMDI3OSwiZXhwIjoxNzkxODU5MDc5fQ.sovr4xKt6tFhWHCeTrIMih5w8u3cX9HI2JUpkw1IpbAibrapEFxpxp435tg7BfU2UD1e3Vh5K5w3ZPTDxbuLog',1,1,'BEARER'),
(156,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMDMwOSwiZXhwIjoxNzkxODU5MTA5fQ.CGBvvWp8jAT5GWjV3mKjChlts-NeJLtdrwOgyGGnXIHsXZQJpyfe0_d_DUhR_Ih5kMRbTndOuSK9XB2qZfnsSg',1,1,'BEARER'),
(157,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMDMxNSwiZXhwIjoxNzkxODU5MTE1fQ.fd9GlTxg9ugTNdCmpccGu6ubjUPLdiqSo28M1kWqvj1nyW8hP1cJrB5_McGq5QLkv4agGTyg_l4r0I_mE3wMdg',1,1,'BEARER'),
(158,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMTI3MywiZXhwIjoxNzkxODYwMDczfQ.1jGkTyhWhVWz0CIbY87YHhAwqV-5N8Lb167wwGPZDW-qVBr6Mu1oHjOWSPeyy2B3AKhdZazaxZprkGXBt_0uXA',1,1,'BEARER'),
(159,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTgzMTI3OCwiZXhwIjoxNzkxODYwMDc4fQ.ZBbuCvZkRNhhwFkP1ybdv5tMJ-GzJaGAX4acqMm35pYEhv7wDcVk_y3PMMONnlkcN2gCZ6g1BIs8KDaHk8JUbA',1,1,'BEARER'),
(160,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyJdLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxODMzMzE3LCJleHAiOjE3OTE4NjIxMTd9.dZCSjICM6G7mogh32ejg6EhEjbHp2uzoMN0eImfPfpsQ45AtRP3ruAeZAMsZuM-gsSM7ZLzlRh__AWCERfRNjg',1,1,'BEARER'),
(161,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyJdLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkxODMzMzM4LCJleHAiOjE3OTE4NjIxMzh9.w2IUebdaPbV1VnAfTITSqu8llAIBtOGk6nA6zHF4m3ldzmtJBw56g6LrzvHZ1XKvPVXz43ULOT_xtKanW31dTA',1,1,'BEARER'),
(162,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTE4MzQyNzUsImV4cCI6MTc5MTg2MzA3NX0.lyy1Ga-u8Hi2raDdmvb97tUMfYi8yZtM0oN37Q_KnMB0X7IXhnOVR6f6RfE6DQ5wD2cdSbv4eluBwwER7vyG6g',1,1,'BEARER'),
(163,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT1NfR0VTVElPTkFSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTE4MzQyOTMsImV4cCI6MTc5MTg2MzA5M30.qYPeIP-QNpMZrSq0p5XymjvllGN03nEoTTDmOTRFAw35vU2JF_P4iQci8oXiFLHG_zjcvOI1L6ZfClWWjw4tNQ',1,1,'BEARER'),
(164,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgzNDY0OSwiZXhwIjoxNzkxODYzNDQ5fQ.GNaEC5UJWzKJy8a7Xwi1VjLSA0g3cASQfp4Y2cT_K_Enni9vJV5qp9_7KoZSfN5MsahGCKPc3gvoVGFxIiJbSg',1,1,'BEARER'),
(165,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgzNDY1NiwiZXhwIjoxNzkxODYzNDU2fQ.xi-z_w3dDFA6wB23yvkQd5lrS0c7IgV7f73E6z1YeqKT2D7SACHRqR0vt9v4Omeg2hEyxF4RRYT7gHouKXH8lg',1,1,'BEARER'),
(166,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgzNTI3OCwiZXhwIjoxNzkxODY0MDc4fQ.thbaWravCJ5d2CFWz7EowI1i9RGyOIDxbmCAzPsLjVEwJaodktzJ3WtYVxwxG_J__UCddle5RcMeOfERQAP_Yw',1,1,'BEARER'),
(167,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgzNTI5NywiZXhwIjoxNzkxODY0MDk3fQ.0Rxyj2bWTBneAvMWVQCUi8EDwVWFaa7qdCnBGAPBx4s-8qJRIHOxRoT2_pWLdyL8u26m-ueOwBq5pnq111zZQA',1,1,'BEARER'),
(168,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTgzOTgyOSwiZXhwIjoxNzkxODY4NjI5fQ.Lo-tv6W2RNCbreUVevEteYLuYxPk_2eRJZ0fFoukJ-iVoj-Ld0mB2vdLQZodsvNRnt5eS2uzKDsSqfK2kYkaUQ',1,1,'BEARER'),
(169,1,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwiYXV0aG9yaXRpZXMiOltdLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiUEFDSUVOVEUiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc5MTgzOTk0MCwiZXhwIjoxNzkxODY4NzQwfQ.0Luei4lnwyR8lQNjB1vaYqH2iKq5iU3TpvYKoMycXLPhWOFcyeD4WIJYc_qjl77IJwVy5sCw6_K6p9dLohOVUA',1,1,'BEARER'),
(170,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTg0MDA0OCwiZXhwIjoxNzkxODY4ODQ4fQ.9KAft_YQYY-0toPwQgn34ojcCcDiJhdziCCG0AcHn-DxzVpXmGqMQuQB0h-fhIidx2OuPJrWm2pYNm9-a5Ye_g',1,1,'BEARER'),
(171,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInJvbGUiOiJDT05UQURPUiIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg0MDMzNiwiZXhwIjoxNzkxODY5MTM2fQ.aOS_CuH6sgPf-cAyzLKTFq1Cu7NFLwDcyiS9FHmBPA-396rkJEmE-RMT8OL52b70QrAZQEsDZhCe-8NF7oxbxg',1,1,'BEARER'),
(172,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTg0MDM5MiwiZXhwIjoxNzkxODY5MTkyfQ.pantM70033mb2FeDQv_Lc6-1moyL0hii90WztTdzs0VBHNJpnl9QZ2bN1i5a8_zWDNse0z8lkxwCuU9rIrQdRg',1,1,'BEARER'),
(174,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTg0MDQxMSwiZXhwIjoxNzkxODY5MjExfQ.fjAjxwF3t_K7HgprSsZw44IT8s1cnByv-H5d80VvMI3Ya9VwwOfkumBZij62tm-p3wppE4gBjN6fD8NODD18sg',1,1,'BEARER'),
(175,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiYXV0aG9yaXRpZXMiOlsiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyJdLCJuYW1lIjoiY2J1c3RhbWFudGVfNzM1Iiwicm9sZSI6IkNPTlRBRE9SIiwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODQwNDk0LCJleHAiOjE3OTE4NjkyOTR9.xqnw-c-ATmH3jO8_F7fzt1kjuIJ5xUK30aiVsVSp2rsPYNl13IWuOHtIon7Y7V3MQVFOZHoSwi6rXjL-wM5F3Q',1,1,'BEARER'),
(176,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iXSwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJzdWIiOiJmdGFudGFsZWFuXzM1NiIsImlhdCI6MTc5MTg0MDUyNywiZXhwIjoxNzkxODY5MzI3fQ.DFWyDR1NKgVwj-9qHqUrFxoR4m8BtH-7zg0vQE1ATwNQFbY4pQ3gW6ldkPi-enCrjK65w13UU7a720OuajcILg',1,1,'BEARER'),
(177,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwiYXV0aG9yaXRpZXMiOlsiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyJdLCJuYW1lIjoiY2J1c3RhbWFudGVfNzM1Iiwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODQ1NjUxLCJleHAiOjE3OTE4NzQ0NTF9.hoOm1c0yiXF8UwJR2ntMzLMO3OBLNRE2MTfsoNQsVWcViWwlOHRYKkYXruY4n_GtSefTR5HdjKZ_Dpru62NFwA',1,1,'BEARER'),
(178,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwiYXV0aG9yaXRpZXMiOlsiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg0NTY5NCwiZXhwIjoxNzkxODc0NDk0fQ.KsnPYdCqrA3mzyq8zmbUitcyUKwhKlCunX-BzCNvnSG1SsOLBSNS10tlXP0e0kMgQvaZCPa8Y542yoagfdfuzA',1,1,'BEARER'),
(182,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwiYXV0aG9yaXRpZXMiOlsiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiXSwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg0NTcwMiwiZXhwIjoxNzkxODc0NTAyfQ.I0Z8WBw1SI-L7whql8aWKOdihUo34CxEMUKItbcMb7oNViL8E9aJchM4O-WxJSwuHu0zjU--iNBIkhLyz7oAXw',1,1,'BEARER'),
(183,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg0NjA4NSwiZXhwIjoxNzkxODc0ODg1fQ.kIy75v0BmAREdmv0uPzKO62RgvNkcO_Crt9DuC9JPEGUyCIpPhlreWnjtLGrHRszfvi1xWaIHInJsKnauK3JTQ',1,1,'BEARER'),
(184,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiJdLCJzdWIiOiJjYnVzdGFtYW50ZV83MzUiLCJpYXQiOjE3OTE4NDYxMzksImV4cCI6MTc5MTg3NDkzOX0.2wkfLxaOnLh2FBfCWL2j_5u8ZhxC_fuLx99v-d858Zg3lGa_9zxfrhYmekdJcIwD-qqxEfRi2CFMfsklBZ8w-w',1,1,'BEARER'),
(185,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiJdLCJzdWIiOiJjYnVzdGFtYW50ZV83MzUiLCJpYXQiOjE3OTE4NDYxNjAsImV4cCI6MTc5MTg3NDk2MH0.pvq5rvW2PYvrYaZHfc7cI_ERoTVX2FF6aiFMkKqg8xtYcMmexIF0RVCqEO7OXGLQ48MfScxMLqGw0eUcq5GePw',1,1,'BEARER'),
(186,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg0NjE4MywiZXhwIjoxNzkxODc0OTgzfQ.OwbN4N5diPHq32Q8o6aTkKY2LsWGXPABwaE8td955_OEs-htqQLwL3IV3yekiO1EhChVcotRxjFqaVbnE6jkBA',1,1,'BEARER'),
(187,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg1MDc4NSwiZXhwIjoxNzkxODc5NTg1fQ.7wIVQeh5Rrxhfh3UrlHVSxDZ57Z5G9hs6mBrPsz9erGkJnMa8Lgr0WRvmYyw-HZ8SB6Rt7QseyC0jj1nCc0y8w',1,1,'BEARER'),
(188,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg1MDgwNywiZXhwIjoxNzkxODc5NjA3fQ.kV-bwDDYW75J8Hn_Mn6GEaqd0G3PekaN9S9RIsTG87j_9jG0TriRlFP5130qdiaVsGwouU3MuHfpDeM8fjbhtQ',1,1,'BEARER'),
(189,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg1MDgxNCwiZXhwIjoxNzkxODc5NjE0fQ.ssM2Ja3Od3gbfDF06KTMnZMWsKfK268zF288fnZbT1iht3HgcGCDKPWkOvW39hkHgnf3s4nzNRmAsmJe_x_W-Q',1,1,'BEARER'),
(190,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIl0sInN1YiI6ImNidXN0YW1hbnRlXzczNSIsImlhdCI6MTc5MTg1MDgyMiwiZXhwIjoxNzkxODc5NjIyfQ.Xvt7wSSDx6ucDp1XrmuTKMaJEaSR41ih2zS9gsLMp9SyYAEWz_0k_U5MRfmE9HPrrb-QYX7u7NWz_mPcSZuQ6g',1,1,'BEARER'),
(191,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUwODg2LCJleHAiOjE3OTE4Nzk2ODZ9.TJDccj-E5HJ-HRK5VThbUsx-uuI_eCOjdFkjKXRbUBBcypFxj5LeIovnYjHZjzPlGKTqBCABwFHwIOjZshgmUA',1,1,'BEARER'),
(192,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUwOTA2LCJleHAiOjE3OTE4Nzk3MDZ9.zKRt6Ch8RHRhw6jJWZW6HT2XvUIaEMJIWLUIJWtzE_Gz2K6yUKyRzosdwZjwv_o3dIgxOWhh36cPHfRlmfCrUA',1,1,'BEARER'),
(193,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUwOTMwLCJleHAiOjE3OTE4Nzk3MzB9.jQuyZg-VoCkMkm7SpFRvpoZcev7YDkqIzfKjd3L1jUrdskYwtgvv4je-WfQ1ztP2__Bq5i_OJZh-tjqguoYdUQ',1,1,'BEARER'),
(195,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUwOTQ1LCJleHAiOjE3OTE4Nzk3NDV9.omSpcSX2AFOuvsXGCN9xRtYBQ-5CZs-Tx4v499hzEuF8YNjtLukKUpL7X2Q-Z6jAZOAcYBpWG6Q_LzGCL16k6A',1,1,'BEARER'),
(196,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUxMDA4LCJleHAiOjE3OTE4Nzk4MDh9.jDfK7UnHaoGefKSafYMaLScu2SLfJTweDNMK8a4fch3_mBufdY5A_wOH5LjZ0h1eyMQG3fWWxvaQEMpDlf09EA',1,1,'BEARER'),
(198,5,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6ImNidXN0YW1hbnRlXzczNSIsImF1dGhvcml0aWVzIjpbIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoiY2J1c3RhbWFudGVfNzM1IiwiaWF0IjoxNzkxODUxMDE5LCJleHAiOjE3OTE4Nzk4MTl9.ecexfv7WoDlbL5eMZDM7VFHOgrExxJHB1jxSalZObi0r5CdCUMiml-tGJdYKi7QbChjUSMH2cbm3q3bkpVS8kA',1,1,'BEARER'),
(199,7,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI3Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6InJjZWxpc185NTIiLCJhdXRob3JpdGllcyI6W10sInN1YiI6InJjZWxpc185NTIiLCJpYXQiOjE3OTE4NTI1OTAsImV4cCI6MTc5MTg4MTM5MH0.6uzjLbOLUceBnCQ3R1HhYNcVtLWN5pdh_ZW06bvrFKkz-4l_AZf7w7v4G5civwzIB8GZguS6g6AxcAzeZNoIBg',1,1,'BEARER'),
(200,7,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI3Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6InJjZWxpc185NTIiLCJhdXRob3JpdGllcyI6W10sInN1YiI6InJjZWxpc185NTIiLCJpYXQiOjE3OTE4NTI2MjQsImV4cCI6MTc5MTg4MTQyNH0.A8VxwRsZX6s8FXaQmwl65PPSBM3LF6PkXrq8VwrJxXKS-0mTZ31PywFX1k1-21BW3_ELNtKpqKKFxyUHByZGiA',1,1,'BEARER'),
(201,7,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI3Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6InJjZWxpc185NTIiLCJhdXRob3JpdGllcyI6WyJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iXSwic3ViIjoicmNlbGlzXzk1MiIsImlhdCI6MTc5MTg1MjY2NywiZXhwIjoxNzkxODgxNDY3fQ.daDnVD5Bz_d1y2emzLxDzLB-B20TB4Ldg4COQShi5aCws03_Y3ffrUjb7uL_Y28_Xo8nopfwOXQJHHBOZaO0cQ',1,1,'BEARER'),
(202,7,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI3Iiwicm9sZSI6IkNPTlRBRE9SIiwibmFtZSI6InJjZWxpc185NTIiLCJhdXRob3JpdGllcyI6WyJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIl0sInN1YiI6InJjZWxpc185NTIiLCJpYXQiOjE3OTE4NTI2OTYsImV4cCI6MTc5MTg4MTQ5Nn0.xi1oriDeR8pjM2We15EaDHTCW0PAckvCb8nL5PRP4g5evSYrdZFU0jmMXa2jtyTnZD1PbUEoa1Q15x3Gz648uQ',1,1,'BEARER'),
(203,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyMTc2OTEyLCJleHAiOjE3OTIyMDU3MTJ9.7vIAOSmWeOO6SIcZqwMTFN7rsykf5dFVZe4o-GxZyjXTFuOryAnLq_TC5vq62ZVXxCrBjxsh1NlvnVDPqZHmZA',1,1,'BEARER'),
(204,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2IiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiIsIkNJVEFfVkVSIiwiQ0lUQV9DUkVBUiIsIkNJVEFfRURJVEFSIiwiQ0lUQV9DQU5DRUxBUiIsIkNJVEFfQ09ORklSTUFSIiwiQ0lUQV9DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX0RJU1BPTklCSUxJREFEIiwiUkVQT1JURV9DSVRBU19WRVIiLCJSRVBPUlRFX0NJVEFTX0dFTkVSQVIiLCJDSVRBX1BBQ0lFTlRFX1ZFUiIsIkNJVEFfUEFDSUVOVEVfQ1JFQVIiLCJDSVRBX1BBQ0lFTlRFX0NBTkNFTEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fUFJPUElPX1ZFUiIsIkRJQUdOT1NUSUNPX1BST1BJT19WRVIiLCJUUkFUQU1JRU5UT19QUk9QSU9fVkVSIiwiSU5ESUNBQ0lPTl9QUk9QSUFfVkVSIiwiUkVDRVRBX1BST1BJQV9WRVIiLCJQRVJGSUxfUFJPUElPX1ZFUiIsIlBFUkZJTF9QUk9QSU9fRURJVEFSIiwiQVRFTkNJT05fUFJPUElBX1ZFUiJdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyMjYxNTQzLCJleHAiOjE3OTIyOTAzNDN9._kcOk011o63t3_pTH28xreYO7QlpHr-9k2InGKTorhMg3JQrGNZ9p2JBkTtNBvfaPTvWoTlZUGZPCtdp2-5FIw',1,1,'BEARER'),
(205,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6WyJBRE1JTklTVFJBRE9SIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsImF1dGhvcml0aWVzIjpbIlVTVUFSSU9fVkVSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIiwiVVNVQVJJT19DUkVBUiIsIlVTVUFSSU9fQ0FNQklBUl9ST0wiLCJVU1VBUklPX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfUFJPUElBUyIsIlBBQ0lFTlRFX1ZFUl9BU0lHTkFET1MiLCJIT1JBUklPX1ZFUl9QUk9QSU8iLCJDSVRBX01BUkNBUl9BVEVORElEQSIsIkNJVEFfUkVHSVNUUkFSX0lOQVNJU1RFTkNJQSIsIkRJQUdOT1NUSUNPX1ZFUiIsIkRJQUdOT1NUSUNPX0NSRUFSIiwiRElBR05PU1RJQ09fRURJVEFSIiwiRElBR05PU1RJQ09fRUxJTUlOQVIiLCJUUkFUQU1JRU5UT19WRVIiLCJUUkFUQU1JRU5UT19JTkRJQ0FSIiwiVFJBVEFNSUVOVE9fRURJVEFSIiwiSU5ESUNBQ0lPTl9DUkVBUiIsIklORElDQUNJT05fRURJVEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fVkVSIiwiQVRFTkNJT05fT0JTRVJWQUNJT05fQ1JFQVIiLCJDSVRBX1ZFUiIsIkNJVEFfQ1JFQVIiLCJDSVRBX0VESVRBUiIsIkNJVEFfQ0FOQ0VMQVIiLCJDSVRBX0NPTkZJUk1BUiIsIkNJVEFfQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9ESVNQT05JQklMSURBRCIsIlJFUE9SVEVfQ0lUQVNfVkVSIiwiUkVQT1JURV9DSVRBU19HRU5FUkFSIiwiQ0lUQV9QQUNJRU5URV9WRVIiLCJDSVRBX1BBQ0lFTlRFX0NSRUFSIiwiQ0lUQV9QQUNJRU5URV9DQU5DRUxBUiIsIkhJU1RPUklBTF9DTElOSUNPX1BST1BJT19WRVIiLCJESUFHTk9TVElDT19QUk9QSU9fVkVSIiwiVFJBVEFNSUVOVE9fUFJPUElPX1ZFUiIsIklORElDQUNJT05fUFJPUElBX1ZFUiIsIlJFQ0VUQV9QUk9QSUFfVkVSIiwiUEVSRklMX1BST1BJT19WRVIiLCJQRVJGSUxfUFJPUElPX0VESVRBUiIsIkFURU5DSU9OX1BST1BJQV9WRVIiXSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI0MzE3NDEsImV4cCI6MTc5MjQ2MDU0MX0.F4TEWkkdMrdIDvIHzvqGqp6GJQ0rVLiHFBoGdUveivETgkLO2xOLSQfq0LAT4_aK0ZyJqMzg0JjgYv2rCbhk1g',1,1,'BEARER'),
(206,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwicm9sZSI6WyJBRE1JTklTVFJBRE9SIiwiTUVESUNPIl0sIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsImF1dGhvcml0aWVzIjpbIlVTVUFSSU9fVkVSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIiwiVVNVQVJJT19DUkVBUiIsIlVTVUFSSU9fQ0FNQklBUl9ST0wiLCJVU1VBUklPX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfUFJPUElBUyIsIlBBQ0lFTlRFX1ZFUl9BU0lHTkFET1MiLCJIT1JBUklPX1ZFUl9QUk9QSU8iLCJDSVRBX01BUkNBUl9BVEVORElEQSIsIkNJVEFfUkVHSVNUUkFSX0lOQVNJU1RFTkNJQSIsIkRJQUdOT1NUSUNPX1ZFUiIsIkRJQUdOT1NUSUNPX0NSRUFSIiwiRElBR05PU1RJQ09fRURJVEFSIiwiRElBR05PU1RJQ09fRUxJTUlOQVIiLCJUUkFUQU1JRU5UT19WRVIiLCJUUkFUQU1JRU5UT19JTkRJQ0FSIiwiVFJBVEFNSUVOVE9fRURJVEFSIiwiSU5ESUNBQ0lPTl9DUkVBUiIsIklORElDQUNJT05fRURJVEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fVkVSIiwiQVRFTkNJT05fT0JTRVJWQUNJT05fQ1JFQVIiLCJDSVRBX1ZFUiIsIkNJVEFfQ1JFQVIiLCJDSVRBX0VESVRBUiIsIkNJVEFfQ0FOQ0VMQVIiLCJDSVRBX0NPTkZJUk1BUiIsIkNJVEFfQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9ESVNQT05JQklMSURBRCIsIlJFUE9SVEVfQ0lUQVNfVkVSIiwiUkVQT1JURV9DSVRBU19HRU5FUkFSIiwiQ0lUQV9QQUNJRU5URV9WRVIiLCJDSVRBX1BBQ0lFTlRFX0NSRUFSIiwiQ0lUQV9QQUNJRU5URV9DQU5DRUxBUiIsIkhJU1RPUklBTF9DTElOSUNPX1BST1BJT19WRVIiLCJESUFHTk9TVElDT19QUk9QSU9fVkVSIiwiVFJBVEFNSUVOVE9fUFJPUElPX1ZFUiIsIklORElDQUNJT05fUFJPUElBX1ZFUiIsIlJFQ0VUQV9QUk9QSUFfVkVSIiwiUEVSRklMX1BST1BJT19WRVIiLCJQRVJGSUxfUFJPUElPX0VESVRBUiIsIkFURU5DSU9OX1BST1BJQV9WRVIiXSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI0MzIxNTIsImV4cCI6MTc5MjQ2MDk1Mn0.y8O4Vkdl5P9LXlegEcBDYO40bMWdBixGjLVKhrNZeCuSsdWiExtweWYvuYs9tJQ-nCcZbAQYA3CEh5Jri2f-Nw',1,1,'BEARER'),
(207,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTA3NDI3LCJleHAiOjE3OTI1MzYyMjd9.ASGgLP4i0QY9VYnPiA-shaD0INvU3tTuQ-mfIG7czxb7rgnFMQ5cbSxtNi1hxqf8kogy0CeERfecc8wuQHwh0Q',1,1,'BEARER'),
(208,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTA3NDQyLCJleHAiOjE3OTI1MzYyNDJ9.7ShggrV8s2uwbjGZf5w-bdVsxI_H-ia9Tco5-yNwGYP4aTtjcUxzsDGn5P89T4xXSXK4RPJ8fJNFldfPVhjHGg',1,1,'BEARER'),
(209,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MDc0NTYsImV4cCI6MTc5MjUzNjI1Nn0.vhteBFJrpwsdW_CYFW4FD1PYyYzoMhiuZz3VPE3awAYFYON1lpw5c5_25CFHGdJ4U3GIXia-1BcwAE5G1dGtpg',1,1,'BEARER'),
(210,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MDgzMTMsImV4cCI6MTc5MjUzNzExM30.drMVMRcR3kJMJUgEGA-nIG-avyJzBDjdlbZGd8B-28KRhqj49f1yfzmVcFcViVBIpti1HYdhdWs309jl41FQXA',1,1,'BEARER'),
(211,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTA4MzI1LCJleHAiOjE3OTI1MzcxMjV9.DSHSm0DbXjGaPrY9bdG_6M06dyEX9Sq2YvBCz5w8Kr0kp1eVglLXSYIL6iGo6gq9NFAAtwQ35kmR1mt5JVn54g',1,1,'BEARER'),
(212,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTA5MTg3LCJleHAiOjE3OTI1Mzc5ODd9.XGBwbuLbFjkFc6B-rXCat8DGTg-wjzOe27iPX8OIecKMIJxLrucS7rMnice9NwDl-8-o-4l_-NlYbWoDoeRmsg',1,1,'BEARER'),
(213,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MDkzOTgsImV4cCI6MTc5MjUzODE5OH0.5V-XTv04PuS1kIKTvetWVcJfGhFQJsgMIkA_lv6zCUsQ_pTO4oHI6sAmLWVyFv_bKBTjkOeZddwG2g0B8mRfiA',1,1,'BEARER'),
(214,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTA4MTksImV4cCI6MTc5MjUzOTYxOX0.6hR464Zg_ynwodwVBHjrOJoOTyZkSrnEhtWgrGTHIIsAibil-esKmlEQjh7YJkToAte2ntvNNqDo-5svqFqbsg',1,1,'BEARER'),
(215,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTA4MjcsImV4cCI6MTc5MjUzOTYyN30.swVyVTSW57Ls_Mtctc6jSMrh-UTK6RGypGh_dbrWp0LUHlUojBCS9GHnlA5yHJpkQ3Q0NTfcJ4Wrh3G37pSTSg',1,1,'BEARER'),
(216,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTEyOTEsImV4cCI6MTc5MjU0MDA5MX0.hcEndOjFIX_w-AgIJjSTUEpXvXMO4l7rGrQvBoBTmPxtXcDVgDFFeUYmpKrMcMzPTgfLgCfX4OX1BhTyJJrVSQ',1,1,'BEARER'),
(217,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTEzMDMsImV4cCI6MTc5MjU0MDEwM30.nvGdTda7CQm4OaOp9FITIUAYSUy7qpE9avKNL-GdE-ldtcExGe_gUN9F8yOblfu48ZCOr_kIUntbLpAcW1YjOA',1,1,'BEARER'),
(218,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTE2MDQsImV4cCI6MTc5MjU0MDQwNH0.j8tPguUgOgDYakC4ihrZ19Hkt116SQcm_glVF3GsTLYIF4MFZ7HmhDqPSvgodQyEKqsXP7MDJTa9b5vZde-4zA',1,1,'BEARER'),
(219,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTExNjExLCJleHAiOjE3OTI1NDA0MTF9.1bCJTkXLBQ0VXRM00rHO1kAxUtgTjtiDl1IRrEDugqMbn86CnZQwjPBxQFeoqA27SW__ZBx0QoYZngcLBIrpSw',1,1,'BEARER'),
(220,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6Ik1FRElDTyIsImF1dGhvcml0aWVzIjpbIk1FRElDT19WRVIiLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiJdLCJ0aXBvIjoiYWNjZXNvIiwiaWRSb2wiOjIsInN1YiI6ImZ0YW50YWxlYW5fMzU2IiwiaWF0IjoxNzkyNTExNjI1LCJleHAiOjE3OTI1NDA0MjV9.KZlIKOq33BH1_P9G9WYTrcWZ7IAJi_84EgUpvcjHWLQuYDVGZU7K8a4YmRSqr42TCDjRMdcZgVGs_EGEP4h2eg',1,1,'BEARER'),
(221,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwibmFtZSI6ImZ0YW50YWxlYW5fMzU2Iiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJhdXRob3JpdGllcyI6WyJVU1VBUklPX1ZFUiIsIkVTUEVDSUFMSURBRF9WRVIiLCJFU1BFQ0lBTElEQURfQ1JFQVIiLCJFU1BFQ0lBTElEQURfRURJVEFSIiwiRVNQRUNJQUxJREFEX0VMSU1JTkFSIiwiRVNQRUNJQUxJREFEX0NBTUJJQVJfRVNUQURPIiwiQ0FSR09fVkVSIiwiQ0FSR09fQ1JFQVIiLCJDQVJHT19FRElUQVIiLCJDQVJHT19FTElNSU5BUiIsIkNBUkdPX0NBTUJJQVJfRVNUQURPIiwiUEFDSUVOVEVfVkVSIiwiUEFDSUVOVEVfQ1JFQVIiLCJQQUNJRU5URV9FRElUQVIiLCJQQUNJRU5URV9FTElNSU5BUiIsIlBBQ0lFTlRFX0NBTUJJQVJfRVNUQURPIiwiRU1QTEVBRE9fVkVSIiwiRU1QTEVBRE9fQ1JFQVIiLCJFTVBMRUFET19FRElUQVIiLCJFTVBMRUFET19FTElNSU5BUiIsIkVNUExFQURPX0NBTUJJQVJfRVNUQURPIiwiTUVESUNPX1ZFUiIsIk1FRElDT19DUkVBUiIsIk1FRElDT19FRElUQVIiLCJNRURJQ09fRUxJTUlOQVIiLCJNRURJQ09fQ0FNQklBUl9FU1RBRE8iLCJIT1JBUklPX1ZFUiIsIkhPUkFSSU9fQ1JFQVIiLCJIT1JBUklPX0VESVRBUiIsIkhPUkFSSU9fRUxJTUlOQVIiLCJIT1JBUklPX0NBTUJJQVJfRVNUQURPIiwiUk9MX1ZFUiIsIlJPTF9DUkVBUiIsIlJPTF9FRElUQVIiLCJST0xfRUxJTUlOQVIiLCJST0xfQ0FNQklBUl9FU1RBRE8iLCJST0xfUEVSTUlTT1NfQVNJR05BUiIsIlVTVUFSSU9fQ1JFQVIiLCJVU1VBUklPX0NBTUJJQVJfUk9MIiwiVVNVQVJJT19DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX1BST1BJQVMiLCJQQUNJRU5URV9WRVJfQVNJR05BRE9TIiwiSE9SQVJJT19WRVJfUFJPUElPIiwiQ0lUQV9NQVJDQVJfQVRFTkRJREEiLCJDSVRBX1JFR0lTVFJBUl9JTkFTSVNURU5DSUEiLCJESUFHTk9TVElDT19WRVIiLCJESUFHTk9TVElDT19DUkVBUiIsIkRJQUdOT1NUSUNPX0VESVRBUiIsIkRJQUdOT1NUSUNPX0VMSU1JTkFSIiwiVFJBVEFNSUVOVE9fVkVSIiwiVFJBVEFNSUVOVE9fSU5ESUNBUiIsIlRSQVRBTUlFTlRPX0VESVRBUiIsIklORElDQUNJT05fQ1JFQVIiLCJJTkRJQ0FDSU9OX0VESVRBUiIsIkhJU1RPUklBTF9DTElOSUNPX1ZFUiIsIkFURU5DSU9OX09CU0VSVkFDSU9OX0NSRUFSIiwiQ0lUQV9WRVIiLCJDSVRBX0NSRUFSIiwiQ0lUQV9FRElUQVIiLCJDSVRBX0NBTkNFTEFSIiwiQ0lUQV9DT05GSVJNQVIiLCJDSVRBX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfRElTUE9OSUJJTElEQUQiLCJSRVBPUlRFX0NJVEFTX1ZFUiIsIlJFUE9SVEVfQ0lUQVNfR0VORVJBUiIsIkNJVEFfUEFDSUVOVEVfVkVSIiwiQ0lUQV9QQUNJRU5URV9DUkVBUiIsIkNJVEFfUEFDSUVOVEVfQ0FOQ0VMQVIiLCJISVNUT1JJQUxfQ0xJTklDT19QUk9QSU9fVkVSIiwiRElBR05PU1RJQ09fUFJPUElPX1ZFUiIsIlRSQVRBTUlFTlRPX1BST1BJT19WRVIiLCJJTkRJQ0FDSU9OX1BST1BJQV9WRVIiLCJSRUNFVEFfUFJPUElBX1ZFUiIsIlBFUkZJTF9QUk9QSU9fVkVSIiwiUEVSRklMX1BST1BJT19FRElUQVIiLCJBVEVOQ0lPTl9QUk9QSUFfVkVSIl0sInRpcG8iOiJhY2Nlc28iLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MTE2MzIsImV4cCI6MTc5MjU0MDQzMn0.qVH_Dc7Lm5hNYA1RIGSyPTzOx_r3F1MgY0s0ZfYWyWvXJ5Z1lvk44oZVahHKRj4FkTJSkjC2yRAryAUJJDWQwA',1,1,'BEARER'),
(222,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwiYXV0aG9yaXRpZXMiOlsiVVNVQVJJT19WRVIiLCJFU1BFQ0lBTElEQURfVkVSIiwiRVNQRUNJQUxJREFEX0NSRUFSIiwiRVNQRUNJQUxJREFEX0VESVRBUiIsIkVTUEVDSUFMSURBRF9FTElNSU5BUiIsIkVTUEVDSUFMSURBRF9DQU1CSUFSX0VTVEFETyIsIkNBUkdPX1ZFUiIsIkNBUkdPX0NSRUFSIiwiQ0FSR09fRURJVEFSIiwiQ0FSR09fRUxJTUlOQVIiLCJDQVJHT19DQU1CSUFSX0VTVEFETyIsIlBBQ0lFTlRFX1ZFUiIsIlBBQ0lFTlRFX0NSRUFSIiwiUEFDSUVOVEVfRURJVEFSIiwiUEFDSUVOVEVfRUxJTUlOQVIiLCJQQUNJRU5URV9DQU1CSUFSX0VTVEFETyIsIkVNUExFQURPX1ZFUiIsIkVNUExFQURPX0NSRUFSIiwiRU1QTEVBRE9fRURJVEFSIiwiRU1QTEVBRE9fRUxJTUlOQVIiLCJFTVBMRUFET19DQU1CSUFSX0VTVEFETyIsIk1FRElDT19WRVIiLCJNRURJQ09fQ1JFQVIiLCJNRURJQ09fRURJVEFSIiwiTUVESUNPX0VMSU1JTkFSIiwiTUVESUNPX0NBTUJJQVJfRVNUQURPIiwiSE9SQVJJT19WRVIiLCJIT1JBUklPX0NSRUFSIiwiSE9SQVJJT19FRElUQVIiLCJIT1JBUklPX0VMSU1JTkFSIiwiSE9SQVJJT19DQU1CSUFSX0VTVEFETyIsIlJPTF9WRVIiLCJST0xfQ1JFQVIiLCJST0xfRURJVEFSIiwiUk9MX0VMSU1JTkFSIiwiUk9MX0NBTUJJQVJfRVNUQURPIiwiUk9MX1BFUk1JU09TX0FTSUdOQVIiLCJVU1VBUklPX0NSRUFSIiwiVVNVQVJJT19DQU1CSUFSX1JPTCIsIlVTVUFSSU9fQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9QUk9QSUFTIiwiUEFDSUVOVEVfVkVSX0FTSUdOQURPUyIsIkhPUkFSSU9fVkVSX1BST1BJTyIsIkNJVEFfTUFSQ0FSX0FURU5ESURBIiwiQ0lUQV9SRUdJU1RSQVJfSU5BU0lTVEVOQ0lBIiwiRElBR05PU1RJQ09fVkVSIiwiRElBR05PU1RJQ09fQ1JFQVIiLCJESUFHTk9TVElDT19FRElUQVIiLCJESUFHTk9TVElDT19FTElNSU5BUiIsIlRSQVRBTUlFTlRPX1ZFUiIsIlRSQVRBTUlFTlRPX0lORElDQVIiLCJUUkFUQU1JRU5UT19FRElUQVIiLCJJTkRJQ0FDSU9OX0NSRUFSIiwiSU5ESUNBQ0lPTl9FRElUQVIiLCJISVNUT1JJQUxfQ0xJTklDT19WRVIiLCJBVEVOQ0lPTl9PQlNFUlZBQ0lPTl9DUkVBUiIsIkNJVEFfVkVSIiwiQ0lUQV9DUkVBUiIsIkNJVEFfRURJVEFSIiwiQ0lUQV9DQU5DRUxBUiIsIkNJVEFfQ09ORklSTUFSIiwiQ0lUQV9DQU1CSUFSX0VTVEFETyIsIkNJVEFfVkVSX0RJU1BPTklCSUxJREFEIiwiUkVQT1JURV9DSVRBU19WRVIiLCJSRVBPUlRFX0NJVEFTX0dFTkVSQVIiLCJDSVRBX1BBQ0lFTlRFX1ZFUiIsIkNJVEFfUEFDSUVOVEVfQ1JFQVIiLCJDSVRBX1BBQ0lFTlRFX0NBTkNFTEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fUFJPUElPX1ZFUiIsIkRJQUdOT1NUSUNPX1BST1BJT19WRVIiLCJUUkFUQU1JRU5UT19QUk9QSU9fVkVSIiwiSU5ESUNBQ0lPTl9QUk9QSUFfVkVSIiwiUkVDRVRBX1BST1BJQV9WRVIiLCJQRVJGSUxfUFJPUElPX1ZFUiIsIlBFUkZJTF9QUk9QSU9fRURJVEFSIiwiQVRFTkNJT05fUFJPUElBX1ZFUiJdLCJyb2xlIjoiQURNSU5JU1RSQURPUiIsIm5hbWUiOiJmdGFudGFsZWFuXzM1NiIsImlkUm9sIjoxLCJ0aXBvIjoiYWNjZXNvIiwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1MzExNDMsImV4cCI6MTc5MjU1OTk0M30.2yuZn3GTdyM1F2i_CkUlm-mPl0zJp3bo9Z-oyP_lOnN6u80jA_bFz-rl6vyNAnE0dy7Z473i7keu7WaZg5M-hA',1,1,'BEARER'),
(223,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwidGlwbyI6ImFjY2VzbyIsImF1dGhvcml0aWVzIjpbIlVTVUFSSU9fVkVSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIiwiVVNVQVJJT19DUkVBUiIsIlVTVUFSSU9fQ0FNQklBUl9ST0wiLCJVU1VBUklPX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfUFJPUElBUyIsIlBBQ0lFTlRFX1ZFUl9BU0lHTkFET1MiLCJIT1JBUklPX1ZFUl9QUk9QSU8iLCJDSVRBX01BUkNBUl9BVEVORElEQSIsIkNJVEFfUkVHSVNUUkFSX0lOQVNJU1RFTkNJQSIsIkRJQUdOT1NUSUNPX1ZFUiIsIkRJQUdOT1NUSUNPX0NSRUFSIiwiRElBR05PU1RJQ09fRURJVEFSIiwiRElBR05PU1RJQ09fRUxJTUlOQVIiLCJUUkFUQU1JRU5UT19WRVIiLCJUUkFUQU1JRU5UT19JTkRJQ0FSIiwiVFJBVEFNSUVOVE9fRURJVEFSIiwiSU5ESUNBQ0lPTl9DUkVBUiIsIklORElDQUNJT05fRURJVEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fVkVSIiwiQVRFTkNJT05fT0JTRVJWQUNJT05fQ1JFQVIiLCJDSVRBX1ZFUiIsIkNJVEFfQ1JFQVIiLCJDSVRBX0VESVRBUiIsIkNJVEFfQ0FOQ0VMQVIiLCJDSVRBX0NPTkZJUk1BUiIsIkNJVEFfQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9ESVNQT05JQklMSURBRCIsIlJFUE9SVEVfQ0lUQVNfVkVSIiwiUkVQT1JURV9DSVRBU19HRU5FUkFSIiwiQ0lUQV9QQUNJRU5URV9WRVIiLCJDSVRBX1BBQ0lFTlRFX0NSRUFSIiwiQ0lUQV9QQUNJRU5URV9DQU5DRUxBUiIsIkhJU1RPUklBTF9DTElOSUNPX1BST1BJT19WRVIiLCJESUFHTk9TVElDT19QUk9QSU9fVkVSIiwiVFJBVEFNSUVOVE9fUFJPUElPX1ZFUiIsIklORElDQUNJT05fUFJPUElBX1ZFUiIsIlJFQ0VUQV9QUk9QSUFfVkVSIiwiUEVSRklMX1BST1BJT19WRVIiLCJQRVJGSUxfUFJPUElPX0VESVRBUiIsIkFURU5DSU9OX1BST1BJQV9WRVIiXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1NDExNDcsImV4cCI6MTc5MjU2OTk0N30.1s0TcpNaglf7fsgUhOTe50QyKdA9QzyghWWNTSqSHGhXZd_LyzOP9kU89CKlRdmQOCY5DYNLDkJ8jJoH_6TYdA',1,1,'BEARER'),
(224,3,'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzIiwidGlwbyI6ImFjY2VzbyIsImF1dGhvcml0aWVzIjpbIlVTVUFSSU9fVkVSIiwiRVNQRUNJQUxJREFEX1ZFUiIsIkVTUEVDSUFMSURBRF9DUkVBUiIsIkVTUEVDSUFMSURBRF9FRElUQVIiLCJFU1BFQ0lBTElEQURfRUxJTUlOQVIiLCJFU1BFQ0lBTElEQURfQ0FNQklBUl9FU1RBRE8iLCJDQVJHT19WRVIiLCJDQVJHT19DUkVBUiIsIkNBUkdPX0VESVRBUiIsIkNBUkdPX0VMSU1JTkFSIiwiQ0FSR09fQ0FNQklBUl9FU1RBRE8iLCJQQUNJRU5URV9WRVIiLCJQQUNJRU5URV9DUkVBUiIsIlBBQ0lFTlRFX0VESVRBUiIsIlBBQ0lFTlRFX0VMSU1JTkFSIiwiUEFDSUVOVEVfQ0FNQklBUl9FU1RBRE8iLCJFTVBMRUFET19WRVIiLCJFTVBMRUFET19DUkVBUiIsIkVNUExFQURPX0VESVRBUiIsIkVNUExFQURPX0VMSU1JTkFSIiwiRU1QTEVBRE9fQ0FNQklBUl9FU1RBRE8iLCJNRURJQ09fVkVSIiwiTUVESUNPX0NSRUFSIiwiTUVESUNPX0VESVRBUiIsIk1FRElDT19FTElNSU5BUiIsIk1FRElDT19DQU1CSUFSX0VTVEFETyIsIkhPUkFSSU9fVkVSIiwiSE9SQVJJT19DUkVBUiIsIkhPUkFSSU9fRURJVEFSIiwiSE9SQVJJT19FTElNSU5BUiIsIkhPUkFSSU9fQ0FNQklBUl9FU1RBRE8iLCJST0xfVkVSIiwiUk9MX0NSRUFSIiwiUk9MX0VESVRBUiIsIlJPTF9FTElNSU5BUiIsIlJPTF9DQU1CSUFSX0VTVEFETyIsIlJPTF9QRVJNSVNPU19BU0lHTkFSIiwiVVNVQVJJT19DUkVBUiIsIlVTVUFSSU9fQ0FNQklBUl9ST0wiLCJVU1VBUklPX0NBTUJJQVJfRVNUQURPIiwiQ0lUQV9WRVJfUFJPUElBUyIsIlBBQ0lFTlRFX1ZFUl9BU0lHTkFET1MiLCJIT1JBUklPX1ZFUl9QUk9QSU8iLCJDSVRBX01BUkNBUl9BVEVORElEQSIsIkNJVEFfUkVHSVNUUkFSX0lOQVNJU1RFTkNJQSIsIkRJQUdOT1NUSUNPX1ZFUiIsIkRJQUdOT1NUSUNPX0NSRUFSIiwiRElBR05PU1RJQ09fRURJVEFSIiwiRElBR05PU1RJQ09fRUxJTUlOQVIiLCJUUkFUQU1JRU5UT19WRVIiLCJUUkFUQU1JRU5UT19JTkRJQ0FSIiwiVFJBVEFNSUVOVE9fRURJVEFSIiwiSU5ESUNBQ0lPTl9DUkVBUiIsIklORElDQUNJT05fRURJVEFSIiwiSElTVE9SSUFMX0NMSU5JQ09fVkVSIiwiQVRFTkNJT05fT0JTRVJWQUNJT05fQ1JFQVIiLCJDSVRBX1ZFUiIsIkNJVEFfQ1JFQVIiLCJDSVRBX0VESVRBUiIsIkNJVEFfQ0FOQ0VMQVIiLCJDSVRBX0NPTkZJUk1BUiIsIkNJVEFfQ0FNQklBUl9FU1RBRE8iLCJDSVRBX1ZFUl9ESVNQT05JQklMSURBRCIsIlJFUE9SVEVfQ0lUQVNfVkVSIiwiUkVQT1JURV9DSVRBU19HRU5FUkFSIiwiQ0lUQV9QQUNJRU5URV9WRVIiLCJDSVRBX1BBQ0lFTlRFX0NSRUFSIiwiQ0lUQV9QQUNJRU5URV9DQU5DRUxBUiIsIkhJU1RPUklBTF9DTElOSUNPX1BST1BJT19WRVIiLCJESUFHTk9TVElDT19QUk9QSU9fVkVSIiwiVFJBVEFNSUVOVE9fUFJPUElPX1ZFUiIsIklORElDQUNJT05fUFJPUElBX1ZFUiIsIlJFQ0VUQV9QUk9QSUFfVkVSIiwiUEVSRklMX1BST1BJT19WRVIiLCJQRVJGSUxfUFJPUElPX0VESVRBUiIsIkFURU5DSU9OX1BST1BJQV9WRVIiXSwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJuYW1lIjoiZnRhbnRhbGVhbl8zNTYiLCJpZFJvbCI6MSwic3ViIjoiZnRhbnRhbGVhbl8zNTYiLCJpYXQiOjE3OTI1NDExNTgsImV4cCI6MTc5MjU2OTk1OH0.NO7ktJPxbspQXwCANs1pJkieBfoNY2i-Kk8OBG3aAGBtKTilNOX0joXJ40UcfZiIcLOBloTEcnWyRFhWK3WP8g',0,0,'BEARER');
/*!40000 ALTER TABLE `token_acceso` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tratamiento`
--

DROP TABLE IF EXISTS `tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento` (
  `id_tratamiento` int(11) NOT NULL AUTO_INCREMENT,
  `id_diagnostico` int(11) NOT NULL,
  `nombre_medicamento` varchar(100) NOT NULL,
  `dosis` varchar(40) NOT NULL,
  `via_administracion` varchar(30) NOT NULL,
  `frecuencia` varchar(40) NOT NULL,
  `duracion_dias` int(11) NOT NULL,
  `tot_cantidad` int(11) NOT NULL,
  `desc_indicacion` varchar(300) DEFAULT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_tratamiento`),
  KEY `fk_tratamiento-diagnostico` (`id_diagnostico`),
  CONSTRAINT `fk_tratamiento-diagnostico` FOREIGN KEY (`id_diagnostico`) REFERENCES `diagnostico` (`id_diagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `tratamiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tratamiento` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `fec_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fec_actualizacion` datetime DEFAULT NULL,
  `requiere_cambio_clave` tinyint(1) NOT NULL DEFAULT 1,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `unq_usuario_login` (`usuario`),
  KEY `fk_usuario-persona` (`id_persona`),
  CONSTRAINT `fk_usuario-persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES
(1,1,'admin','$2a$10$UAGTnDRgPXN9sgI4yi4ieOdUQBjHrYtTHOgAC1btxXYYgSuz4NfNm','2026-10-02 21:46:44','2026-10-03 16:51:19',0,1),
(2,11,'jhernandez_171','$2a$10$ZPIyFO31RNtO2XKQ2CCOOucS6zuqTJoOA7BZJ4U6xLIM9DujL6v6i','2026-10-07 00:17:55','2026-10-07 04:37:27',0,1),
(3,10,'ftantalean_356','$2a$10$nLqSlIvmNvaa5mv/ICaEbONGjyIXlgM.1uW7fG5srFHIICoCuAsIS','2026-10-07 00:29:45','2026-10-07 03:36:54',0,1),
(4,7,'jisrael_669','$2a$10$dsatEZenrC3M7RqU7Z3bVektuc.4TWOlfgJrA7Fck/W4.ihjdpO46','2026-10-07 03:43:04','2026-10-12 01:11:59',0,1),
(5,12,'cbustamante_735','$2a$10$LSW0imAWlHJI.WnEDN2rgud63sTRaPFYydZyorNP6bSolbPuiE2ii','2026-10-12 01:43:29','2026-10-12 09:26:35',0,1),
(6,15,'mruiz_808','$2a$10$CkNRT1tzEhGQnNxs0wTct.AmXELK8WaMx/KTCbueSvdm67vccJE9e','2026-10-12 19:34:40','2026-10-12 19:34:40',1,1),
(7,16,'rcelis_952','$2a$10$I6lHDbdfH5KGt.sWQGzWeepRyoEwHmBlXqJnWhKqSgt9tw421y6Fe','2026-10-12 19:48:59','2026-10-12 19:50:11',0,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuario_rol`
--

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `id_usuario_rol` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fec_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fec_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  PRIMARY KEY (`id_usuario_rol`),
  UNIQUE KEY `unq_usuario_rol` (`id_usuario`,`id_rol`),
  KEY `fk_usuario_rol_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_rol`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES
(1,3,1,'2026-10-19 12:26:23','2026-10-19 12:26:23',1),
(2,3,2,'2026-10-19 12:48:57','2026-10-19 12:48:57',1),
(3,7,1,'2026-10-20 19:07:13','2026-10-20 19:07:13',1),
(4,7,3,'2026-10-20 19:07:19','2026-10-20 19:07:19',1);
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-10-20 21:33:03
