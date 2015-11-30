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
		"edit_event",					/*6*/
		"get_lists",					/*7*/
		"create_list",					/*8*/
		"get_fields_available",			/*9*/
		"get_list_id_by_table_name",	/*10*/
		"add_fields_search",			/*11*/
		"get_list_info_by_id",			/*12*/
		"get_all_rows_to_view_table",	/*13*/
		"search_in_list"				/*14*/
		
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
							if ($_FILES["file"]["size"] > 500000) {
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
												$sql .= str_replace(' ', '_', $csvArr[0][$i]). " VARCHAR(50) NOT NULL, ";
												$col .= str_replace(' ', '_', $csvArr[0][$i]) . ",";
											}else{
												$sql .= str_replace(' ', '_', $csvArr[0][$i]). " VARCHAR(50) NOT NULL )";
												$col .= str_replace(' ', '_', $csvArr[0][$i]);
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
													$currentColq .= "'" .$csvArr[$i][$c]."',";
												}else{
													$currentColq .= "'" .$csvArr[$i][$c]."'";
												}
											}

											$queries .= "INSERT INTO $new_table ($col) VALUES ($currentColq); ";
										}
										$list_total = $countRow - 1;
										$new_list_table_name = 'list_'.$list_table_name;
										//INSERT LISTS TABLES
										$queries .= "INSERT INTO lists (list_name,list_table_name,file_name,list_total, created_by,created_date,active) VALUES('$list_name','$new_list_table_name','$newfilename','$list_total',1,NOW(),1);";

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
						//echo 'hola';
						$guest = new mikeSQL();
						$guest->_get("SELECT * FROM event_list WHERE event_id = '$event_id'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;

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
								$field_where .= " l.".$result[$i]['field_name']. " = '$search' OR "; 
							}else{
								$field_where .= " l.".$result[$i]['field_name']. " = '$search' "; 
							}
						}

						//GET TABLE NAME
						$guest->_get("SELECT * FROM lists WHERE list_id = '".$list_id."'", 0);
						//RESULT OF BEFORE QUERY
						$result = $guest->rows;
						//STORAGE TABLE NAME
						$table_name = $result[0]['list_table_name'];

						//GENERATE QUERY
						$query = "SELECT l.row_id AS ID, $field_select IF(ee.event_id IS NULL,'No','Yes') AS Attended FROM $table_name l LEFT JOIN event_entries ee ON l.row_id = ee.row_id WHERE $field_where ";
						$guest->_get($query);
						//echo $query;

					break;


				}



		}


?>