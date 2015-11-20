<?php 
	//REQUIERE MIKE SQL CLASS
	require_once"mikeSQL.php";

	$functions = array(
		"test", 						/*0*/
		"get_events",					/*1*/
		"add_event",					/*2*/
		"get_all_list"					/*3*/
		
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
						
					//$arr = array("Nombre1"=>"miguel", "Nombre2"=>"maydy", "Nombre3"=>"lissy");

					//echo json_encode($arr,JSON_UNESCAPED_UNICODE);

					
						echo $action;
						echo '<br>';
						echo $test;
						

				
					break;

				case 1:

						$guest = new mikeSQL();
						if ($search == -1){
							$guest->qry("SELECT event_id, event_name, event_desc, created_date FROM events LIMIT ".$limit_rows);
						}else{
							$guest->qry("SELECT event_id, event_name, event_desc, created_date FROM events WHERE event_name LIKE '%$search%' LIMIT ".$limit_rows);
						}

					break;

				case 2:


						$guest = new mikeSQL();
						//INSERT EVENTS
						$guest->_add("INSERT INTO events (event_name,event_desc,created_by,created_date) VALUES('$event_name', '$event_desc', 1, NOW())", 0);
						//GET LAST_ID
						$event_id = $guest->last_id;
						//INSERT EVENT_LIST
						$guest->_add("INSERT INTO event_list (event_id,list_id) VALUES('$event_id', '$list_id')");

						
					break;
				case 3:

						$guest = new mikeSQL();
						$guest->qry("SELECT list_id, list_name FROM lists WHERE active = '1'");

					break;

				}


		}


?>