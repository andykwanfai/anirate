-- MySQL dump 10.13  Distrib 5.5.43, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: anime
-- ------------------------------------------------------
-- Server version	5.5.43-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anime`
--

DROP TABLE IF EXISTS `anime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anime` (
  `id` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `jname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `season` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `total_episode` int(11) DEFAULT NULL,
  `on_air_date` datetime DEFAULT NULL,
  `img_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sq_img_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rating` double DEFAULT '0',
  `avg_epi_rate` float NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aid` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anime_cv`
--

DROP TABLE IF EXISTS `anime_cv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anime_cv` (
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `cvid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `seq` int(11) NOT NULL,
  PRIMARY KEY (`aid`,`cvid`),
  KEY `aid` (`aid`),
  KEY `cvid` (`cvid`),
  CONSTRAINT `anime_cv_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `anime_cv_ibfk_2` FOREIGN KEY (`cvid`) REFERENCES `cv` (`cvid`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anime_staff`
--

DROP TABLE IF EXISTS `anime_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anime_staff` (
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `sid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `seq` int(2) NOT NULL,
  PRIMARY KEY (`aid`,`sid`),
  KEY `sid` (`sid`),
  CONSTRAINT `anime_staff_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `anime_staff_ibfk_2` FOREIGN KEY (`sid`) REFERENCES `staff` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anime_tag`
--

DROP TABLE IF EXISTS `anime_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anime_tag` (
  `aid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tag` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `vote` int(11) DEFAULT '0',
  `creater_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bam` int(11) DEFAULT '0',
  PRIMARY KEY (`aid`,`tag`),
  CONSTRAINT `anime_tag_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anime_type`
--

DROP TABLE IF EXISTS `anime_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anime_type` (
  `aid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(4096) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bam` int(11) DEFAULT '0',
  `post_date` datetime DEFAULT NULL,
  `spoiler` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cv`
--

DROP TABLE IF EXISTS `cv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cv` (
  `cvid` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cvname` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `cv_img` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cvid`),
  UNIQUE KEY `id` (`cvid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `episode`
--

DROP TABLE IF EXISTS `episode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `episode` (
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `episode` int(3) NOT NULL DEFAULT '0',
  `rating` float NOT NULL,
  `unfollow` int(10) NOT NULL,
  `follower_num` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `delay_weeks` int(11) DEFAULT '0',
  PRIMARY KEY (`aid`,`episode`),
  CONSTRAINT `episode_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rank`
--

DROP TABLE IF EXISTS `rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rank` (
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `img_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `season` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `avg_score` double(18,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rate_anime`
--

DROP TABLE IF EXISTS `rate_anime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rate_anime` (
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `userid` int(11) NOT NULL,
  `rating` int(2) NOT NULL,
  PRIMARY KEY (`aid`,`userid`),
  KEY `rate_anime_ibfk_2` (`userid`),
  CONSTRAINT `rate_anime_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rate_anime_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rate_episode`
--

DROP TABLE IF EXISTS `rate_episode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rate_episode` (
  `userid` int(11) NOT NULL,
  `rating` int(2) NOT NULL,
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `episode` int(4) NOT NULL,
  PRIMARY KEY (`userid`,`aid`,`episode`),
  KEY `rate_episode_ibfk_2` (`aid`),
  CONSTRAINT `rate_episode_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  CONSTRAINT `rate_episode_ibfk_2` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bam` int(11) DEFAULT '0',
  `icon` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `id` (`userid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_follow`
--

DROP TABLE IF EXISTS `user_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_follow` (
  `uid` int(11) NOT NULL,
  `aid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `episode` int(4) NOT NULL,
  PRIMARY KEY (`uid`,`aid`),
  KEY `aid` (`aid`),
  CONSTRAINT `user_follow_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`userid`) ON UPDATE CASCADE,
  CONSTRAINT `user_follow_ibfk_2` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `video` (
  `aid` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv3` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv4` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv5` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv6` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv7` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pv8` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`aid`),
  KEY `aid` (`aid`),
  CONSTRAINT `video_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `viewRank`
--

DROP TABLE IF EXISTS `viewRank`;
/*!50001 DROP VIEW IF EXISTS `viewRank`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `viewRank` (
  `aid` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `img_path` tinyint NOT NULL,
  `season` tinyint NOT NULL,
  `avg_score` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vote_tag`
--

DROP TABLE IF EXISTS `vote_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vote_tag` (
  `aid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tag` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `viewRank`
--

/*!50001 DROP TABLE IF EXISTS `viewRank`*/;
/*!50001 DROP VIEW IF EXISTS `viewRank`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`qqwq`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `viewRank` AS select `episode`.`aid` AS `aid`,`anime`.`name` AS `name`,`anime`.`img_path` AS `img_path`,`anime`.`season` AS `season`,round((avg(`episode`.`rating`) + `anime`.`rating`),1) AS `avg_score` from (`episode` join `anime`) where ((`episode`.`rating` > 0) and (`episode`.`aid` = `anime`.`id`)) group by `episode`.`aid` order by round((avg(`episode`.`rating`) + `anime`.`rating`),1) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-26 10:17:55
