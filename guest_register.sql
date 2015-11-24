-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2015 at 08:46 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `guest_register`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
  `event_desc` text COLLATE utf8_spanish_ci,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=20 ;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_desc`, `created_by`, `created_date`) VALUES
(18, 'Anual Assembly 2015', 'Anual Assembly 2015', 1, '2015-11-23 07:42:33'),
(19, 'Anual Assembly 2016', 'Anual Assembly 2016', 1, '2015-11-23 07:42:48');

-- --------------------------------------------------------

--
-- Table structure for table `event_list`
--

CREATE TABLE IF NOT EXISTS `event_list` (
  `event_id` int(11) DEFAULT NULL,
  `list_id` int(11) DEFAULT NULL,
  KEY `fk_event_list_events` (`event_id`),
  KEY `fk_event_list_lists` (`list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `event_list`
--

INSERT INTO `event_list` (`event_id`, `list_id`) VALUES
(18, 1),
(19, 2);

-- --------------------------------------------------------

--
-- Table structure for table `fields_search`
--

CREATE TABLE IF NOT EXISTS `fields_search` (
  `list_id` int(11) NOT NULL,
  `field_name` varchar(25) COLLATE utf8_spanish_ci DEFAULT NULL,
  KEY `fk_fields_search_lists` (`list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

CREATE TABLE IF NOT EXISTS `lists` (
  `list_id` int(11) NOT NULL AUTO_INCREMENT,
  `list_name` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
  `list_table_name` varchar(25) COLLATE utf8_spanish_ci DEFAULT NULL,
  `file_name` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
  `list_total` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`list_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=17 ;

--
-- Dumping data for table `lists`
--

INSERT INTO `lists` (`list_id`, `list_name`, `list_table_name`, `file_name`, `list_total`, `created_by`, `created_date`, `active`) VALUES
(1, 'Lista de Socios', 'list_member', NULL, 566, 1, '2015-11-25 00:00:00', 1),
(2, 'List de Correos Electronicos', 'list_email_list', NULL, 342, 1, '2015-11-19 00:00:00', 1),
(3, 'Miembros de la Junta ab', 'miembros_de_la_junta_ab', '1448391338.csv', 4, 1, '2015-11-24 10:55:39', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_list`
--
ALTER TABLE `event_list`
  ADD CONSTRAINT `fk_event_list_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_list_lists` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fields_search`
--
ALTER TABLE `fields_search`
  ADD CONSTRAINT `fk_fields_search_lists` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
