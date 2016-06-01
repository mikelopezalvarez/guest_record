<?php 
	//REQUIERE MIKE SQL CLASS
	require_once"mikeSQL.php";
	require_once"functions.php";

	$functions = array(
		"test", 						/*0*/
		"get_events",					/*1*/
		"add_event",					/*2*/
		"get_all_list",					/*3*/
		"del_event",					/*4*/
		"get_event_info",				/*5*/
		"edit_event",					/*6*/
		"get_lists",					/*7*/
		"create_list",					/*8*/
		"get_fields_available",			/*9*/
		"get_list_id_by_table_name",	/*10*/
		"add_fields_search",			/*11*/
		"get_list_info_by_id",			/*12*/
		"get_all_rows_to_view_table",	/*13*/
		"search_in_list",				/*14*/
		"register_guest",				/*15*/
		"get_basic_analytics_event", 	/*16*/
		"get_chart_event_info",			/*17*/
		"get_chart_attended_by_hour",	/*18*/
		"get_min_max_date_of_event",	/*19*/
		"get_count_event_all_hours",	/*20*/
		"get_users",					/*21*/
		"add_user",						/*22*/
		"validate_exist_username",		/*23*/
		"get_user_info_by_id",			/*24*/
		"edit_user",					/*25*/
		"del_user",						/*26*/
		"get_settings",					/*27*/
		"edit_settings",				/*28*/
		"get_fields_searched",			/*29*/
		"update_fields_search",			/*30*/
		"edit_list",					/*31*/
		"del_list"						/*32*/
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

					
						//echo $action;
						//echo '<br>';
						//echo $test;

				echo $_FILES['file']['name'];


						

				
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
						$guest->_add("INSERT INTO events (event_name,event_desc,created_by,created_date) VALUES('$event_name', '$event_desc', '$user_id', NOW())", 0);
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
				case 7:

						$guest = new mikeSQL();
						if ($search == -1){
							$guest->qry("SELECT list_id, list_name, list_table_name, list_total, created_date FROM lists LIMIT ".$limit_rows);
						}else{
							$guest->qry("SELECT list_id, list_name, list_table_name, list_total, created_date FROM lists WHERE list_name LIKE '%$search%' LIMIT ".$limit_rows);
						}

					break;
				case 8:
						

						//1. VERIFY IF TABLE EXIST
						$guest = new mikeSQL();
						$guest->exist_table($list_table_name);

						if($guest->ok == true){
							echo json_encode(array('success'=> false, 'error'=> 'The table name already exist.')); 
						}else{

							// 2. UPLOAD CSV
							if ($_FILES["file"]["size"] > 5000000000) {
							    echo json_encode(array('success'=> false, 'error'=> 'The file size exceed the limit.')); 
							}else{

								$allowed =  array('csv');
								$filename = $_FILES['file']['name'];
								$ext = pathinfo($filename, PATHINFO_EXTENSION);
								if(!in_array($ext,$allowed) ) {
								    echo json_encode(array('success'=> false, 'error'=> 'The file type is incorrect.'));
								}else{
									//RENAME FILE
									$temp = explode(".", $filename);
									$newfilename = round(microtime(true)) . '.' . end($temp);
									//UPLOAD FILE INTO SERVER
									move_uploaded_file($_FILES['file']['tmp_name'], '../csv/'.$newfilename);
					
									// 3. VALIDATE IF FILE IS CSV
									$csvArr = array();
									$path = "../csv/".$newfilename;
									
									if (($handle = fopen($path, "r")) !== FALSE) {
									    $key = 0; // Set the array key.
									    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
									        $count = count($data); //get the total keys in row
									        //insert data to our array
									        for ($i=0; $i < $count; $i++) {
									            $csvArr[$key][$i] = $data[$i];
									        }
									        $key++;
									    }
									    fclose($handle);//close file handle
									}
									
									
									//VARIABLES TO VALIDATE CSV COLUMNS & FIELDS
									$countCol = count($csvArr[0]); //COLUMN FIRST ROW
									$countRow = count($csvArr); //TOTAL ROW
									$countErr = 0; //INIT ERROR COUNT
									$col = null;

									//SEARCHING ERROR
									for ($i = 0; $i < $countRow; $i++){
										$currentCol = count($csvArr[$i]); //CURRENT COLUMN COUNT
										//VALIDATE FIRST COLUMN WITH EACH ROW-COLUMN 
										if($currentCol != $countCol){
											$countErr = $countErr + 1;
										}
									}
									//VERIFY ERROR COUNT
									if($countErr > 0){
										//Send JSON...
									}else{
										//print_r($csvArr);

										// sql to create table
										$sql = "CREATE TABLE list_". $list_table_name ." ( row_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, ";

										for($i = 0; $i < $countCol; $i++){
											if($i < $countCol - 1){
												$sql .= clear_string_spaces($csvArr[0][$i]). " VARCHAR(25) NOT NULL, ";
												$col .= clear_string_spaces($csvArr[0][$i]) . ",";
											}elseif($i == $countCol){
												$sql .= clear_string_spaces($csvArr[0][$i]). " VARCHAR(25) NOT NULL )";
												$col .= clear_string_spaces($csvArr[0][$i]);
											}else{
												$sql .= clear_string_spaces($csvArr[0][$i]). " VARCHAR(25) NOT NULL )";
												$col .= clear_string_spaces($csvArr[0][$i]);
											}

										}

										//echo $sql;
										$guest = new mikeSQL();
										$guest->add_table($sql,0);
										
									}




									//ADDED TABLE
									$new_table = "list_".$list_table_name;
									//VERIFY THAT TABLE EXIST
									$guest = new mikeSQL();
									$guest->exist_table($new_table);
									if(isset($guest->ok)){
										$queries = "";
										for($i = 1; $i < $countRow; $i++){
											$currentColq = "";
											for($c = 0; $c < $countCol; $c++){
												if($c < $countCol - 1){
													$currentColq .= "'" .clear_string($csvArr[$i][$c])."',";
												}elseif($c == $countCol){
													$currentColq .= "'" .clear_string($csvArr[$i][$c])."'";
												}else{
													$currentColq .= "'" .clear_string($csvArr[$i][$c])."'";
												}
											}

											$queries .= "INSERT INTO $new_table ($col) VALUES ($currentColq); ";
										}
										$list_total = $countRow - 1;
										$new_list_table_name = 'list_'.$list_table_name;
										//INSERT LISTS TABLES
										$queries .= "INSERT INTO lists (list_name,list_table_name,file_name,list_total, created_by,created_date,active) VALUES('$list_name','$new_list_table_name','$newfilename','$list_total','$user_id',NOW(),1);";

										//echo $queries;
										$guest->multiple($queries);





									}
								}//File Extension
							}//File size
						}//Else table exist


						
					break;


				case 9:

						$guest = new mikeSQL();
						$guest->qry("DESCRIBE $table_name");


					break;
				case 10:

						$guest = new mikeSQL();
						$guest->qry("SELECT list_id FROM lists WHERE list_table_name = '$table_name'");

					break;
				case 11:
						$qty = count($fields);
						$sql = '';

						for($i = 0; $i < $qty; $i++){
							$sql .= "INSERT INTO fields_search (list_id,field_name) VALUES('$list_id','".$fields[$i]."');";
						}

						$guest = new mikeSQL();
						$guest->multiple($sql);

					break;

				case 12:

						$guest = new mikeSQL();
						$guest->qry("SELECT list_id, list_name, list_table_name, file_name FROM lists WHERE list_id = '$list_id'");

					break;
				case 13:

						$guest = new mikeSQL();
						$guest->qry("SELECT * FROM $table_name");

					break;
				case 14:
						$guest = new mikeSQL();
						$guest->_get("SELECT * FROM event_list WHERE event_id = '$event_id'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//echo $result[0]['list_id'];
						
						//GET FIELDS SEARCH FOR THIS EVENT
						$guest->_get("SELECT * FROM fields_search WHERE list_id = '".$result[0]['list_id']."'", 0);
						$list_id = $result[0]['list_id']; //GET LIST ID
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//COUNT OF FIELDS
						$qty_fields = count($result);
						//print_r($guest->rows);
						//echo $qty_fields;

						//GET SELECT OF QUERY
						$field_select = "";	
						for ($i = 0; $i < $qty_fields; $i++){
							
							$field_select .= " l.".$result[$i]['field_name']. ", "; 
							
						}

						//GET WHERE OF QUERY
						$field_where = "1 = 1 AND ";
						for ($i = 0; $i < $qty_fields; $i++){
							if($i < $qty_fields - 1){
								$field_where .= " l.".$result[$i]['field_name']. " LIKE '%$search%' OR "; 
							}else{
								$field_where .= " l.".$result[$i]['field_name']. " LIKE '%$search%' "; 
							}
						}


						//GET TABLE NAME
						$guest->_get("SELECT * FROM lists WHERE list_id = '".$list_id."'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//STORAGE TABLE NAME
						$table_name = $result[0]['list_table_name'];


						//GENERATE QUERY
						$query = "SELECT l.row_id AS ID, $field_select IF(ee.event_id IS NULL,'No','Yes') AS Attended FROM $table_name l LEFT JOIN event_entries ee ON l.row_id = ee.row_id AND ee.event_id = '$event_id' WHERE  $field_where  ORDER BY l.row_id LIMIT 10";

						$guest->_get($query);
		
					break;

				case 15:

						$guest = new mikeSQL();
						if($att == "No"){
							//INSERT EVENTS
							$guest->_add("INSERT INTO event_entries (row_id,event_id,created_by,created_date) VALUES('$row_id', '$event_id', '$user_id', NOW())");

						}else{
							$guest->_del("DELETE FROM event_entries WHERE row_id = '$row_id' AND event_id = '$event_id'");
						}

					break;
				case 16:
				
						$guest = new mikeSQL();
						$guest->_get("SELECT * FROM event_list WHERE event_id = '$event_id'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						//GET LIST INFO
						$guest->_get("SELECT * FROM lists WHERE list_id = '".$result[0]['list_id']."'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$table_name = $result[0]['list_table_name'];
						//GET COUNT OF ROWS
						$guest->_get("SELECT COUNT(row_id) AS total_rows FROM $table_name ", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$total_rows = $result[0]["total_rows"];

						//GET COUNT OF ATTENDED
						$guest->_get("SELECT COUNT(row_id) AS total_rows FROM event_entries WHERE event_id = '$event_id' ", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$total_attended = $result[0]["total_rows"];

						$calc = $total_attended * 100;
						$perc = $calc / $total_rows;

						//GET TOTAL USERS WORKING
						$guest->_get("SELECT COUNT(DISTINCT created_by) AS total_rows FROM event_entries WHERE event_id = '$event_id' ", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$total_users = $result[0]["total_rows"];

						echo json_encode(array("success"=>true,"total_rows"=>$total_rows,"total_attended"=>$total_attended,"perc"=>round($perc), 'users_working'=>$total_users));

					break;
				case 17:


					break;
				case 18:

						$guest = new mikeSQL();
						$guest->_get("SELECT * FROM event_list WHERE event_id = '$event_id'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						//GET LIST INFO
						$guest->_get("SELECT * FROM lists WHERE list_id = '".$result[0]['list_id']."'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//STORAGE TABLE NAME
						$table_name = $result[0]['list_table_name'];

						//GET FIELDS SEARCH FOR THIS EVENT
						$guest->_get("SELECT * FROM fields_search WHERE list_id = '".$result[0]['list_id']."'", 0);
						$list_id = $result[0]['list_id']; //GET LIST ID
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//COUNT OF FIELDS
						$qty_fields = count($result);
						//GET SELECT OF QUERY
						$field_select = "";	
						for ($i = 0; $i < $qty_fields; $i++){
							
							$field_select .= " l.".$result[$i]['field_name']. ", "; 
							
						}
						//START DATE
						$start = $record_date . ' 0'.$hour.':00:00';
						//END DATE
						$end = $record_date . ' 0'.$hour.':59:59';

						//GET ATTENDED RECORD
						$guest->_get("SELECT $field_select ee.created_date AS Registered FROM event_entries ee JOIN $table_name l ON l.row_id = ee.row_id WHERE ee.created_date between '$start' and '$end' ORDER BY ee.created_date");



					break;
				case 19: 

						$guest = new mikeSQL();
						$guest->_get("SELECT MIN(created_date) AS min_date, MAX(created_date) AS max_date,
						DATEDIFF(MIN(created_date), MAX(created_date)) AS days, DATE_FORMAT(MAX(created_date),'%Y-%m-%d') AS txt_date FROM event_entries WHERE event_id = '$event_id'");


					break;
				case 20: 

						$guest = new mikeSQL();

						/************1************/
						$hs = $selected_date . ' 01:00:00';
						$he = $selected_date . ' 01:59:59';

						
						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h1 = $result[0]['total'];

						/************2************/
						$hs = $selected_date . ' 02:00:00';
						$he = $selected_date . ' 02:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h2 = $result[0]['total'];
						

						/************3************/
						$hs = $selected_date . ' 03:00:00';
						$he = $selected_date . ' 03:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h3 = $result[0]['total'];
						

						/************4************/
						$hs = $selected_date . ' 04:00:00';
						$he = $selected_date . ' 04:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h4 = $result[0]['total'];
						

						/************5************/
						$hs = $selected_date . ' 05:00:00';
						$he = $selected_date . ' 05:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h5 = $result[0]['total'];
						

						/************6************/
						$hs = $selected_date . ' 06:00:00';
						$he = $selected_date . ' 06:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h6 = $result[0]['total'];

						/************7************/
						$hs = $selected_date . ' 07:00:00';
						$he = $selected_date . ' 07:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h7 = $result[0]['total'];

						/************8************/
						$hs = $selected_date . ' 08:00:00';
						$he = $selected_date . ' 08:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h8 = $result[0]['total'];

						/************9************/
						$hs = $selected_date . ' 09:00:00';
						$he = $selected_date . ' 09:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h9 = $result[0]['total'];

						/************10************/
						$hs = $selected_date . ' 10:00:00';
						$he = $selected_date . ' 10:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h10 = $result[0]['total'];

						/************11************/
						$hs = $selected_date . ' 11:00:00';
						$he = $selected_date . ' 11:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h11 = $result[0]['total'];

						/************12************/
						$hs = $selected_date . ' 12:00:00';
						$he = $selected_date . ' 12:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h12 = $result[0]['total'];

						/************13************/
						$hs = $selected_date . ' 13:00:00';
						$he = $selected_date . ' 13:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h13 = $result[0]['total'];

						/************14************/
						$hs = $selected_date . ' 14:00:00';
						$he = $selected_date . ' 14:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h14 = $result[0]['total'];

						/************15************/
						$hs = $selected_date . ' 15:00:00';
						$he = $selected_date . ' 15:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h15 = $result[0]['total'];

						/************16************/
						$hs = $selected_date . ' 16:00:00';
						$he = $selected_date . ' 16:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h16 = $result[0]['total'];

						/************17************/
						$hs = $selected_date . ' 17:00:00';
						$he = $selected_date . ' 17:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h17 = $result[0]['total'];

						/************18************/
						$hs = $selected_date . ' 18:00:00';
						$he = $selected_date . ' 18:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h18 = $result[0]['total'];

						/************19************/
						$hs = $selected_date . ' 19:00:00';
						$he = $selected_date . ' 19:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h19 = $result[0]['total'];

						/************20************/
						$hs = $selected_date . ' 20:00:00';
						$he = $selected_date . ' 20:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h20 = $result[0]['total'];

						/************21************/
						$hs = $selected_date . ' 21:00:00';
						$he = $selected_date . ' 21:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h21 = $result[0]['total'];

						/************22************/
						$hs = $selected_date . ' 22:00:00';
						$he = $selected_date . ' 22:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h22 = $result[0]['total'];

						/************23************/
						$hs = $selected_date . ' 23:00:00';
						$he = $selected_date . ' 23:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h23 = $result[0]['total'];


						/************24************/
						$hs = $selected_date . ' 24:00:00';
						$he = $selected_date . ' 24:59:59';

						$guest->_get("SELECT count(*) AS total FROM event_entries WHERE event_id = '$event_id' AND  created_date BETWEEN '$hs' and '$he'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

						$h24 = $result[0]['total'];

						echo json_encode(array("h1"=>$h1,"h2"=>$h23,"h3"=>$h3,"h4"=>$h4,"h5"=>$h5,"h6"=>$h6,"h7"=>$h7,"h8"=>$h8,"h9"=>$h9,"h10"=>$h10,"h11"=>$h11,"h12"=>$h12,"h13"=>$h13,"h14"=>$h14,"h15"=>$h15,"h16"=>$h16,"h17"=>$h17,"h18"=>$h18,"h19"=>$h19,"h20"=>$h20,"h21"=>$h21,"h22"=>$h22,"h23"=>$h23,"h24"=>$h24,));




					break;

				case 21:

						$guest = new mikeSQL();
						if ($search == -1){
							$guest->qry("SELECT user_id, fullname, username, created_date FROM users LIMIT ".$limit_rows);
						}else{
							$guest->qry("SELECT user_id, fullname, username, created_date FROM users WHERE fullname LIKE '%$search%' LIMIT ".$limit_rows);
						}


					break;
				case 22:

						$guest = new mikeSQL();
						$password = md5($passw);
						//INSERT USERS
						$guest->_add("INSERT INTO users (fullname,username,passw,admin,created_date) VALUES('$fullname', '$username', '$password', '$admin', NOW())");


					break;
				case 23:

						$guest = new mikeSQL();
						$guest->qry("SELECT COUNT(username) AS qty FROM users WHERE username = '$username'");

					break;
				case 24:

						$guest = new mikeSQL();
						$guest->qry("SELECT user_id, fullname, username, admin FROM users WHERE user_id = '$user_id'");

					break;
				case 25:

						if($change_pass == 1){
							$guest = new mikeSQL();
							$values = array("fullname"=> $fullname, "username"=> $username, "passw"=> md5($passw), "admin"=> $admin);
							$guest->update("users", $values, 'user_id', $user_id);
						}else{
							$guest = new mikeSQL();
							$values = array("fullname"=> $fullname, "username"=> $username, "admin"=> $admin);
							$guest->update("users", $values, 'user_id', $user_id);
						}

					break;
				case 26:

						$guest = new mikeSQL();
						$guest->_del("DELETE FROM users WHERE user_id = '$user_id'");

					break;
				case 27:

						$guest = new mikeSQL();
						$guest->qry("SELECT * FROM settings");

					break;
				case 28:

						

						if($image_or_text == 1){

							if($_FILES){

								$guest = new mikeSQL();
								$guest->_get("SELECT * FROM settings", 0);
								//RESULT OF BEFORE QUERY
								$result = $guest->rows;


								$allowed =  array('gif','GIF','jpg','JPG','jpeg','JPEG','png','PNG');//GET ACCEPTED EXTENSION FILE
								$filename = $_FILES['image']['name'];//GET FILENAME
								$ext = pathinfo($filename, PATHINFO_EXTENSION);//GET EXTENSION FILE
								$path = "../img/";//PATH
								$upload_file = $path . basename($_FILES['image']['name']);//UPLOAD PATH
								//VALIDATE EXTENSION
								if(!in_array($ext,$allowed) ) {
								    
								    json_encode(array("success"=> 0));
								   

								}else{
									if (move_uploaded_file($_FILES["image"]["tmp_name"], $upload_file)) {
								        json_encode(array("success"=> true));
								        //DELETE PREVIOUS FILE
								        unlink('../img/'.$result[0]["logo_url"]);
								        //EDIT SETTINGS INFO
								        $guest = new mikeSQL();
										$values = array("logo_image_or_text"=> $image_or_text, "logo_url"=> $_FILES['image']['name'], "logo_text"=> $logo_text, "logo_text_color"=> $logo_text_color, "bg_color"=> $bg_color, "font_color"=> $font_color);
										$guest->update("settings", $values, 'setting_id', '1');



								    } else {
								        json_encode(array("success"=> 0));
								    }


								}
							}else{
								$guest = new mikeSQL();
								$values = array("logo_image_or_text"=> $image_or_text, "logo_text"=> $logo_text, "logo_text_color"=> $logo_text_color, "bg_color"=> $bg_color, "font_color"=> $font_color);
									$guest->update("settings", $values, 'setting_id', '1');
									json_encode(array("success"=> true));

							}



						}else{

							$guest = new mikeSQL();
							$values = array("logo_image_or_text"=> $image_or_text, "logo_text"=> $logo_text, "logo_text_color"=> $logo_text_color, "bg_color"=> $bg_color, "font_color"=> $font_color);
									$guest->update("settings", $values, 'setting_id', '1');
									json_encode(array("success"=> true));

						}

						

					break;
				case 29:

						$guest = new mikeSQL();
						$guest->qry("SELECT list_id, field_name FROM fields_search WHERE list_id = '$list_id'");

					break;
				case 30:

						$guest = new mikeSQL();
						$guest->_del("DELETE FROM fields_search WHERE list_id = '$list_id'", 0);

						$qty = count($fields);
						$sql = '';

						for($i = 0; $i < $qty; $i++){
							$sql .= "INSERT INTO fields_search (list_id,field_name) VALUES('$list_id','".$fields[$i]."');";
						}

						$guest = new mikeSQL();
						$guest->multiple($sql);
					break;
				case 31:

						$guest = new mikeSQL();
						//Update list
						$sql = "UPDATE lists SET list_name='$list_name', list_table_name='$list_table_name' WHERE list_id='$list_id'; ";
						//Update table name
						$sql .= "RENAME TABLE $old_list_table_name TO $list_table_name;";
						$guest->multiple($sql);

					break;
				case 32:

						$guest = new mikeSQL();
						$guest->_get("SELECT count(*) AS total FROM event_list WHERE list_id = '$list_id'", 0);
						$result = $guest->rows;

						if($result[0]["total"] > 0){
							echo json_encode(array('success'=> false)); 
						}else{
							$guest = new mikeSQL();
							$guest->_del("DELETE FROM lists WHERE list_id = '$list_id'");
						}

					break;



				}



		}


?>