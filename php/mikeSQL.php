<?php
require_once"parameters.php";
/**
 * Mysql Easy Control 1.0
 *
 * This class is used to easily control procedures related to the handling of mysql database. Use the mysqli library and for this reason requires PHP version is the 5 onwards. With this class you can create tables, insert records, update, delete etc. For more information you can check our manual.
 *
 * PHP version 5
 *
 * LICENSE: This source file is subject to version 3.01 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_01.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @category   DB Easy Control
 * @package    PackageName
 * @author     Miguel López Álvarez <miguel@cursosdelaweb.com>
 * @copyright  2014 Cursos de la Web
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 * @version    SVN: $Id$
 * @link       http://cursosdelaweb.com/developer
 * @see        NetOther, Net_Sample::Net_Sample()
 * @since      File available since Release 1.0.0
 * @deprecated File deprecated in Release 2.0.0
 */

class mikeSQL{
	
	private $host = DB_HOSTNAME;
	private $user = DB_USERNAME;
	private $pass = DB_PASS;
	private $db = DB_DATABASE;

	private $mysqli;
	private $sql; 
	private $table;
	private $fields;
	private $vals;
	private $type;
	private $key;
	private $all_tables;

	public $last_id;
	public $row_aff;
	public $stats;
	public $ok;
	public $rows;


	function __construct() {

		$this->mysqli = new mysqli ($this->host, $this->user, $this->pass, $this->db);
		$this->ok = false;
       
   	}
/*
   	public function all_tables(){

		$this->mysqli->query("SHOW TABLES");
		$this->all_tables = $this->mysqli->fetch_array(MYSQLI_BOTH);


		foreach ($this->all_tables as $val) {
			
			echo $val .'<br>';  

		}

   	}
*/


	public function insert($table, $values){

		$this->table = $table;

		$qty = count($values);
		$i = null;

		$field_arr = array();
		$val_arr = array();

		foreach ($values as $key => $val) {
		    $field_arr[] = $key;
		    $val_arr[] = $val;
		}

		foreach ($field_arr as $val) {
			$i++;
		    $this->fields .= ($i >= $qty) ? $val  : $val . ',';
			    if($i == $qty){
			    	$i = 0;
			    }
		}

		foreach ($val_arr as $val) {
			$i++;
		    $this->vals .= ($i >= $qty) ? "'".$val."'" : "'" .$val."',";
		}

		$sql = "INSERT INTO ".$this->table."(".$this->fields.") VALUES (".$this->vals.")";

		if (!$this->mysqli->query($sql)) {
		    printf("Errormessage: %s\n", $this->mysqli->error);
		}else{
			$this->ok = true;
			$this->row_aff = $this->mysqli->affected_rows;
			$this->last_id = $this->mysqli->insert_id;
			//echo json_encode(array("success" => true, "last_id" => $this->last_id));
		}

	}

	public function update($table, $values, $field_id, $id){

		$this->table = $table;

		$qty = count($values);
		$i = null;

		$set_fields = null;
		
		foreach($values as $key => $val) {
			$i++;
			$set_fields .= ($i >= $qty) ? $key ."='". $val ."'" : $key ."='". $val ."',";

		}

		$sql = "UPDATE ". $this->table. " SET " . $set_fields. " WHERE ".$field_id."='".$id."'";

		if (!$this->mysqli->query($sql)) {
		    printf("Errormessage: %s\n", $this->mysqli->error);
		}else{
			$this->ok = true;
			echo json_encode(array('success'=> true)); 
		}

	}

	public function _select($table, $fields, $where = "", $order = "", $limit = ""){

		$order = ($order != "") ? " ORDER BY ".$order." ASC " : "";
		$limit = ($limit != "") ? " LIMIT ".$limit : "";
				

		$sql = "SELECT ".$fields." FROM ".$table." ".$where.$order.$limit;


		if (!$this->mysqli->query($sql)) {
		    
		    printf("Errormessage: %s\n", $this->mysqli->error);
		
		}else{


			if ($result = $this->mysqli->query($sql)) {
				$arr = array();
			    while($row = $result->fetch_array(MYSQL_ASSOC)) {
			            $arr[] = $row;
			    }//end while
			    echo json_encode($arr);
			    $this->rows = $arr;
			    
			    //Free result
			    mysqli_free_result($result); 
			}

		}

	} 

	public function qry($sql){

		//$r = $connect->query('SELECT @userCount as userCount');
		//$row = $r->fetch_assoc(); 

		//echo 'fuera';
		if (!$this->mysqli->query($sql)) {
		    
		    printf("Errormessage: %s\n", $this->mysqli->error);
		    //echo "CALL failed: (" . $this->mysqli->errno . ") " . $this->mysqli->error;
		    // 'Error';
		
		}else{

			
			if ($result = $this->mysqli->query($sql)) {
				$arr = array();
			    while($row = $result->fetch_array(MYSQL_ASSOC)) {
			            $arr[] = $row;
			    }//end while
			    $this->rows = $arr;
			    echo json_encode($arr);
			    
			    //Free result
			    mysqli_free_result($result); 
			} 

		}

	}

	public function _get($sql, $json = 1){
		$this->rows = null;
		$rs = null; 
		//Calling the proc() procedure 
		$rs =$this->mysqli->query( $sql ); 
		$arr = array();
		while($row = $rs->fetch_array(MYSQL_ASSOC)) { 
			$arr[] = $row;
		} 
		//Send JSON
		if($json > 0){
			echo json_encode($arr);
		}
		//Storage in a global class row
		$this->rows = $arr; 
		//Free result
		mysqli_free_result($rs); 

	} 

	public function _add($sql, $json = 1){
		$this->mysqli->query( $sql ); 
		if($json > 0){
			echo json_encode(array('success'=> true)); 
		}
		$this->last_id = $this->mysqli->insert_id;
	} 

	public function _del($sql, $json = 1){
		$this->mysqli->query( $sql ); 
		if($json > 0){
			echo json_encode(array('success'=> true)); 
		}
	} 

	public function add_table($sql, $json = 1){
		$this->mysqli->query( $sql ); 
		if($json > 0){
			echo json_encode(array('success'=> true)); 
		}
	} 

	public function clear_param($param){
		return mysql_real_escape_string($param);
	}

	public function exist_table($table){
		$result = $this->mysqli->query("SHOW TABLES LIKE '".$table."'");
		if ($result->num_rows) {
			$this->ok = true;
		}else{
			$this->ok = false; 
		} 
		
	}

	public function multiple($sql){

		if ($this->mysqli->multi_query($sql) === TRUE) {
		    echo json_encode(array('success'=> true)); 
		} else {
		    echo json_encode(array('success'=> false)); 
		}

	} 




}





?>