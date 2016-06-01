<?php 
	//REQUIERE MIKE SQL CLASS
	require_once"mikeSQL.php";
	require_once"functions.php";

	$functions = array(
		"login", 						/*0*/
		"logout",						/*1*/
		"get_login",					/*2*/
		"install"						/*3*/
		
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

						$passwordEncrypt = md5($password);
						
						$guest = new mikeSQL();
						$guest->_get("SELECT user_id, fullname, username FROM users WHERE username = '$username' AND passw = '$passwordEncrypt'", 0);
						$result = $guest->rows;
						$total = count($result);

						if($total > 0){
							$_SESSION['user_id'] = $result[0]["user_id"];
							$_SESSION['fullname'] = $result[0]["fullname"];
							$_SESSION['username'] = $result[0]["username"];
							echo json_encode(array('success'=> true)); 

						}else{
							echo json_encode(array('success'=> false)); 
						}

					break;

				case 1:
						
						session_destroy();
						echo json_encode(array('success'=> true)); 

					break;

				case 2:
						
						if(isset($_SESSION['username'])){
							echo json_encode(array('success'=> true, 'user_id'=> $_SESSION['user_id'], 'fullname'=> $_SESSION['fullname'], 'username'=> $_SESSION['username'])); 
						}else{
							echo json_encode(array('success'=> false));
						}

					break;
				case 3:
						
						//VERIFY IF DATABASE, USERNAME AND PASSWORD EXIST

						//CREATE ALL TABLES INTO DATABASE

						//CREATE FILE OF CONNEXION 

						//DELETE ALL INSTALLATION FILES

					break;





				}



		}


?>