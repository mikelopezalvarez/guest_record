
<?php 
	//TURN OFF ERROR MESSAGE
	ini_set('display_errors', FALSE);

	$functions = array(
		"install" 						/*0*/
		
		
		);
			
		if(isset($_GET['action']))
		{
			$call = array_search($_GET['action'], $functions);
			$url = http_build_query($_GET);
			parse_str($url);
		}
		elseif(isset($_POST['action']))
		{
			$call = array_search($_POST['action'], $functions);
			$url = http_build_query($_POST);
			parse_str($url);
		}
		else
		{
			die();
		}
		
		if ($call !== false) 
		{
			
			switch($call) 
			{
				
				case 0: 


						//CONVERT PASSWORD IN MD5 FORMAT
						$passw = md5($password);


						//VALIDATE CONNEXION
						$mysqli = new mysqli("$hostname", "$database_username", "$database_password", "$database_name");
						if ($mysqli->connect_errno) {
						    echo json_encode(array('success'=> false, 'err'=> 'The connection has not been established.'));
						}else{

							//DATABASE SCRIPT
							$sql = "CREATE TABLE IF NOT EXISTS `events` (
								  `event_id` int(11) NOT NULL AUTO_INCREMENT,
								  `event_name` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
								  `event_desc` text COLLATE utf8_spanish_ci,
								  `created_by` int(11) DEFAULT NULL,
								  `created_date` datetime DEFAULT NULL,
								  PRIMARY KEY (`event_id`)
								) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=20 ; 

								CREATE TABLE IF NOT EXISTS `event_list` (
								  `event_id` int(11) DEFAULT NULL,
								  `list_id` int(11) DEFAULT NULL,
								  KEY `fk_event_list_events` (`event_id`),
								  KEY `fk_event_list_lists` (`list_id`)
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


								CREATE TABLE IF NOT EXISTS `fields_search` (
								  `list_id` int(11) NOT NULL,
								  `field_name` varchar(25) COLLATE utf8_spanish_ci DEFAULT NULL,
								  KEY `fk_fields_search_lists` (`list_id`)
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

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

								CREATE TABLE IF NOT EXISTS `roles` (
								  `role_id` int(11) NOT NULL AUTO_INCREMENT,
								  `role_name` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
								  `active` tinyint(4) NOT NULL,
								  PRIMARY KEY (`role_id`)
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

								CREATE TABLE IF NOT EXISTS `settings` (
								  `setting_id` int(11) NOT NULL,
								  `logo_image_or_text` tinyint(4) DEFAULT NULL,
								  `logo_url` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
								  `logo_text` varchar(25) COLLATE utf8_spanish_ci DEFAULT NULL,
								  `logo_text_color` varchar(25) COLLATE utf8_spanish_ci DEFAULT NULL,
								  `bg_color` varchar(15) COLLATE utf8_spanish_ci DEFAULT NULL,
								  `font_color` varchar(15) COLLATE utf8_spanish_ci DEFAULT NULL
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

								INSERT INTO `settings` (`setting_id`, `logo_image_or_text`, `logo_url`, `logo_text`, `logo_text_color`, `bg_color`, `font_color`) VALUES
								(1, 2, '', 'Guest Record', '#999999', '#ffffff', '#473d3d');

								CREATE TABLE IF NOT EXISTS `users` (
								  `user_id` int(11) NOT NULL AUTO_INCREMENT,
								  `fullname` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
								  `username` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
								  `passw` text COLLATE utf8_spanish_ci NOT NULL,
								  `admin` int(11) NOT NULL,
								  `created_date` datetime NOT NULL,
								  PRIMARY KEY (`user_id`)
								) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=2 ;

								INSERT INTO `users` (`fullname`, `username`, `passw`, `admin`, `created_date`) VALUES
								('$fullname', '$username', '$passw', 1, NOW());


								ALTER TABLE `event_list`
								  ADD CONSTRAINT `fk_event_list_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
								  ADD CONSTRAINT `fk_event_list_lists` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

								ALTER TABLE `fields_search`
  									ADD CONSTRAINT `fk_fields_search_lists` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`) ON DELETE CASCADE ON UPDATE CASCADE; ";



							//CREATE TABLE INTO DATABASE
							if ($mysqli->multi_query($sql) === TRUE) {
							    
							    //CREATE PARAMETERS FILE
								$param_file = fopen('parameters.php', "w+");
								fwrite($param_file,"<?php define('DB_HOSTNAME', '".$hostname."'); define('DB_USERNAME', '".$database_username."'); define('DB_PASS', '".$database_password."'); define('DB_DATABASE', '".$database_name."'); ?>");
								fclose($param_file);

								//DELETE ALL INSTALLATION FILES
								unlink('../install.html');
								//DELETE THIS FILE
								unlink(__FILE__);


								echo json_encode(array('success'=> true));
							}else{
								echo json_encode(array('success'=> false, 'err'=> 'Error while creating table in the database. Verify that the database is empty.'));
							}

						}

						
						

					break;


				}



		}


?>