<?php 
	//REQUIERE MIKE SQL CLASS
	require_once"mikeSQL.php";

	$functions = array(
		"test", 						/*0*/
		"get_events",					/*1*/
		"add_event",					/*2*/
		"get_all_list",					/*3*/
		"del_event",					/*4*/
		"get_event_info",				/*5*/
		"edit_event"					/*6*/
		
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
				case 4:

						$guest = new mikeSQL();
						$guest->_del("DELETE FROM events WHERE event_id = '$event_id'");

					break;
				case 5:

						$guest = new mikeSQL();
						$guest->qry("SELECT e.event_name, e.event_desc, l.list_id, l.list_name FROM events e LEFT JOIN event_list el ON el.event_id = e.event_id LEFT JOIN lists l ON l.list_id = el.list_id WHERE e.event_id = '$event_id'");

					break;
				case 6:

						$guest = new mikeSQL();
						$values = array("event_name"=> $event_name, "event_desc"=> $event_desc);
						$guest->update("events", $values, 'event_id', $event_id);

					break;


				}


		}


?>