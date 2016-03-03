/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var search_limit_rows = 10; //Search limit rows
var event_info = null; //Get event info Obj
var table_name = null;
var list_id = null;
var list_info = null;
var searched_info = null;
var search_arr = Array();
var available_arr = Array();

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init List Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_list(){

	load_list_list();

  //Init search
  $("#btn_search").click(function(){

    load_list_list();
    
  });

   //Init add event dialog
  $("#add_list").click(function(){

    init_add_list_dialog();
    
  });

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load List into Content
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_list_list(){

  $.ajax({
    type: "POST",
    url: 'php/actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_lists', 
      search: (($("#txt_search").val()) ? $("#txt_search").val() : -1 ),
      limit_rows: search_limit_rows
    },
    success: function(response){

      //Quantity of Rows
    	var qty = response.length;
      if(qty > 0){
      	var htm = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
      	for(var i = 0; i < qty; i++){
      		htm += '<div class="panel panel-default">'+
                 '<div class="panel-heading" role="tab" id="headingOne">' +
                    '<h4 class="panel-title">' +
                      '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+response[i]["list_id"]+'" aria-expanded="true" aria-controls="collapseOne" style="text-decoration: none;">'+
                        response[i]["list_name"] +
                      '</a>' +
                      '<div class="btn-group pull-right" data-toggle="buttons" style="position: relative; top: -2px;">' +
                        '<label class="btn btn-default btn-xs btn_search_filter_fields" title="Search Filter" rel="'+response[i]["list_id"]+'">' +
                        	'<span class="glyphicon glyphicon-filter" aria-hidden="true"></span>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs btn_view_table" title="View Records"  rel="'+response[i]["list_id"]+'">' +
                         '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs btn_edit_event" rel="'+response[i]["list_id"]+'" title="Edit">' +
                          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                       ' </label>' +
                        '<label class="btn btn-default btn-xs btn_delete_event" rel="'+response[i]["list_id"]+'" title="Delete">' +
                          '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
                        '</label>' +
                       
                      '</div>' +
                     
                    '</h4>' +
                 ' </div>' +
                  '<div id="collapse'+response[i]["list_id"]+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
                    '<div class="panel-body">' + response[i]["list_name"] +
                    '<br><small><strong>Created Date: </strong>' + response[i]["created_date"] + '</small>' +
                    '</div>' +
                  '</div>' +
                '</div>';

               
      	}

          if(qty > 9){
            htm+= '<br><div class="row"><div class="col-md-2 col-md-offset-5">'+
            '<div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">'+ 
              '<button type="button" class="btn btn-default" id="btn_more">More result</button>'+
            '</div></div></div>';
          }

      	htm += '</div>';
      }else{
        htm = '<div class="alert alert-info" role="alert">No Record found</div>';
      }

    $("#general-content").html(htm);


      program_events();
   }
  });

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Program Events
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function program_events(){
  
 

  //Init more result
  $("#btn_more").click(function(){
    search_limit_rows = parseInt(search_limit_rows) + 10;
    load_list_list();
    
  });

  //Init delete event
  $(".btn_delete_event").click(function(){
    delete_event($(this).attr("rel"));
  });

  //Init edit event
  $(".btn_edit_event").click(function(){
    get_info_to_edit_event($(this).attr("rel"));
  });
  //Init view table
  $(".btn_view_table").click(function(){
    init_view_table_list_dialog($(this).attr("rel"));
  });

  //Init search filter fields
  $(".btn_search_filter_fields").click(function(){
    filter_field_dialog($(this).attr("rel"));
  });

  

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Form of Add List into Dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_add_list_dialog(){
    //Open dialog
    $('#myModal').modal({
      keyboard: false
    });
    //Dialog title
    $(".modal-title").html('<img src="img/icons/excel.png" width="50"> Create List')
    //Create form
    var form = '<form id="form_add_list">'+
    '<div id="form_error"></div>'+
      '<div class="form-group">'+
        '<label for="">Name</label>'+
        '<input type="text" class="validate[required,custom[onlyLetterSp]] form-control" id="txt_list_name" placeholder="Name of List">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Table Name</label>'+
        '<input class="validate[required] form-control" id="txt_list_table_name" type="text" placeholder="" value=""  disabled>'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Choose the .csv file</label>'+
        '<input type="file" name="csv" accept="" class="validate[required] btn btn-default" id="csv_file">'+
      '</div>'+
      '<button type="submit" class="btn btn-default">Create</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);

    //Converting Name to Table Name in real time
    typing_table_name();


    //Init Validation Engine
    $("#form_add_list").validationEngine();

    //When submit add event
    $("#form_add_list").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      add_list();
    });


}




function typing_table_name(){

	$("#txt_list_name").keyup(function(){
		$("#txt_list_table_name").val('');
		var list_name = $("#txt_list_name").val();

		var list_table_name = list_name.replace(" ", "_");

		$("#txt_list_table_name").val($("#txt_list_name").val().split(" ").join('_').toLowerCase());


	});

}


function add_list(){

	var status =  $("#form_add_list").validationEngine('validate');

	if(status == true){
		var form = new FormData(); 
		form.append("action", "create_list");
		form.append("list_name", $("#txt_list_name").val());
		form.append("list_table_name", $("#txt_list_table_name").val());
		form.append("file", $("#csv_file")[0].files[0]);
		table_name = 'list_' +  $("#txt_list_table_name").val();
		
		$.ajax({
			type: "POST",
			url: 'php/actions.php',
			cache: false,
			dataType : 'JSON',
			processData: false, 
        	contentType: false,
			data: form,
			success: function(response){
			    if(response.success == true){
			    	filter_search_field_after_create_list();
			    }else{
			    	$("#form_error").html('<div class="alert alert-danger" role="alert">'+response.error+'</div>');
			    }
			}
		});
	}
}





function filter_search_field_after_create_list(){

	//Dialog title
    $(".modal-title").html('<img src="img/icons/filter.png" width="50"> Search Filter');
    //Create form
    var form = '<form id="form_add_search_fields">'+
    '<div id="form_error"></div>'+
    '<div class="row">'+
	    '<div class="col-lg-5">'+
	    	'<div class="form-group">'+
	        	'<label for="">Fields Available</label>'+
	        		'<select multiple class="form-control" style="height: 250px;" id="ddl_fields_available">'+
					'</select>'+
	      	'</div>'+
	    '</div>'+
	    '<div class="col-lg-2">'+
	    	'<div class="btn-group-vertical" role="group" aria-label="Vertical button group" style="position: relative; top: 100px; left: 15px;">'+
      			'<button type="button" class="btn btn-default" id="btn_fields_to_right"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
      			'<button type="button" class="btn btn-default" id="btn_fields_to_left"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>'+
			'</div>'+
	    '</div>'+
	    '<div class="col-lg-5">'+
	    	'<div class="form-group">'+
	        	'<label for="">Search Engine</label>'+
	        		'<select multiple class="form-control" style="height: 250px;" id="ddl_search_engine">'+
					'</select>'+
	      	'</div>'+
	    '</div>'+
	  '</div>'+
      '<button type="submit" class="btn btn-default">Save</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);

    //Load DDL of fields available
    load_ddl_fields_available();

    //Default disable button
    $('#btn_fields_to_left').prop('disabled', true);

    //Add fields available to search 
    $("#btn_fields_to_right").click(function(){
      add_fields_available_to_search();
    });

    //Remove search fields to fields available 
    $("#btn_fields_to_left").click(function(){
      add_to_search_fields_available();
    });

    $("#form_add_search_fields").submit(function(event){
      event.preventDefault();
      save_search_filter_fields();
    });

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load DDL of Field Available
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_ddl_fields_available(){
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_fields_available',
          table_name: table_name
        },
        success: function(response){
          console.log(response);
          //Quantity list
          var qty = response.length;
          //Load ddl
          for (var i = 1; i < qty; i++){
            $('#ddl_fields_available').append($('<option>', {
                value: response[i]['Field'],
                text: response[i]['Field']
            }));
          }
        }
    });

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
When click button will add fields into search select multiple
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function add_fields_available_to_search(){
  
  $('#ddl_fields_available :selected').each(function(i, selected){
    
    //Remove element
    $(this).remove(); 
    
    //Adding element in Search 
    $("#ddl_search_engine").append(selected);

    //Verify to disable button
    disable_button();

  });
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
When click button will back the search field to fields available
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function add_to_search_fields_available(){
  $('#ddl_search_engine :selected').each(function(i, selected){
    
    //Remove element
    $(this).remove(); 

    //Adding element in Search 
    $("#ddl_fields_available").append(selected);

    //Verify to disable button
    disable_button();

  });
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
To diable and enable left and right button when add or back fields
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function disable_button(){
  //Quantity of fields available option
  var qty_left = $('#ddl_fields_available option').size();

  //Quantity of fields search option
  var qty_right = $('#ddl_search_engine option').size();  
    
  //If not there more option, disable button
  if(qty_left < 1){
    $('#btn_fields_to_right').prop('disabled', true);
  }else{
    $('#btn_fields_to_right').prop('disabled', false);
  }

  //If not there more option, disable button
  if(qty_right < 1){
    $('#btn_fields_to_left').prop('disabled', true);
  }else{
    $('#btn_fields_to_left').prop('disabled', false);
  }

  //Clear form error
  $("#form_error").html('');
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Save search filter selected
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function save_search_filter_fields(){

  var qty = $('#ddl_search_engine option').size();  

  if(qty < 1){
    $("#form_error").html('<div class="alert alert-danger" role="alert">You must select at least one field.</div>');
  }else{
    var search_fields = []; 

    $("#ddl_search_engine option").each(function(){
      search_fields.push($(this).val()); 
    });
    console.log(search_fields)
    //Get list_id
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_list_id_by_table_name',
          table_name: table_name
        },
        success: function(response){
          console.log(response);
          list_id = response[0]['list_id'];


            //Send and Save Search Engine Fields
             $.ajax({
                type: "POST",
                url: 'php/actions.php',
                dataType : 'JSON',
                data: { 
                  action: 'add_fields_search',
                  list_id: list_id,
                  fields: search_fields
                },
                success: function(response){
                  console.log(response)
                  if(response.success){
                    //Close dialog
                    $('#myModal').modal('hide');
                    //Reload event list
                    load_list_list();
                  }
                }
              });


           }
         });

  }
  
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init view table list dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_view_table_list_dialog(row_id){

  //Open dialog
  $('#myModal').modal({
      keyboard: false
    });

  $('.modal-dialog').css("width","60%");
  //Dialog title
  $(".modal-title").html('<img src="img/icons/table.png" width="50"> View Table')
    
  load_view_table_list(row_id);

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Set columns in view table
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_view_table_list(row_id){

  var html = '<div id="badge_total" class="pull-right"></div><br><br><div id="dialog_table_content" style="height: 300px; overflow-y: scroll;"><table class="table table-hover" id="tbt_fields_table"></table></div>';
  
  //Load dialog wiht form
  $(".modal-body").html(html);

  //Get list information
   $.ajax({
      type: "POST",
      url: 'php/actions.php',
      dataType : 'JSON',
      data: { 
        action: 'get_list_info_by_id',
        list_id: row_id
      },
      success: function(response){

        table_name = response[0]['list_table_name'];

        //Get fields of table
        $.ajax({
          type: "POST",
          url: 'php/actions.php',
          dataType : 'JSON',
          data: { 
            action: 'get_fields_available',
            table_name: table_name
          },
          success: function(response){
            //Quantity list
            var qty = response.length;
            //Init var to storage html content
            var table_content = '<thead><tr>';

            //Load ddl 
            for (var i = 0; i < qty; i++){
              table_content += '<th>'+response[i]['Field']+'</th>';
            }


            table_content += '</tr></thead>';
            //Load table content
            $("#tbt_fields_table").append(table_content);

            //Load rows table
            load_rows_view_table();

          }//End get fields
        });

      }//End get file info
    });

        


   
    
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Set rows in view table
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_rows_view_table(){
  $.ajax({
    type: "POST",
    url: 'php/actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_all_rows_to_view_table',
      table_name: table_name
    },
    success: function(response){

      console.log(response)
      //Convert Obj to Array
      var col = $.map(response[0], function(el) { return el });
      var qty_rows = response.length; //Qty Rows
      var qty_col = col.length; //Qty Coluns

      //Init var to storage html content
      var table_content = '<tbody>';
      
      //For rows
      for(var i = 0; i < qty_rows; i++){
        table_content += '<tr>';
        //For columns
        for(var e = 0; e < qty_col; e++){
          var colunm = $.map(response[i], function(el) { return el });
          if(e == 0){
            table_content += '<th>'+colunm[e]+'</th>';
          }else{
            table_content += '<td>'+colunm[e]+'</td>';
          }
        }
        table_content += '</tr>';

      }

      table_content += '</tbody>';

      //Append Table
      $("#tbt_fields_table").append(table_content);

      //Total of Rows
      $("#badge_total").html('Total of rows: <span class="badge">'+qty_rows+'</span>');
    }
  });

}






function filter_field_dialog(list_id){

  $.ajax({
    type: "POST",
    url: 'php/actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_list_info_by_id',
      list_id: list_id
    },
    success: function(response){

      //Stablish table name
      list_info = response;

      //Call filter search content
      filter_search_field();

    }
  });


}

function filter_search_field(){

    //Open dialog
    $('#myModal').modal({
        keyboard: false
    });

    //Dialog title
    $(".modal-title").html('<img src="img/icons/filter.png" width="50"> Search Filter');
    //Create form
    var form = '<form id="form_add_search_fields">'+
    '<div id="form_error"></div>'+
    '<div class="row">'+
      '<div class="col-lg-5">'+
        '<div class="form-group">'+
            '<label for="">Fields Available</label>'+
              '<select multiple class="form-control" style="height: 250px;" id="ddl_fields_available">'+
          '</select>'+
          '</div>'+
      '</div>'+
      '<div class="col-lg-2">'+
        '<div class="btn-group-vertical" role="group" aria-label="Vertical button group" style="position: relative; top: 100px; left: 15px;">'+
            '<button type="button" class="btn btn-default" id="btn_fields_to_right"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
            '<button type="button" class="btn btn-default" id="btn_fields_to_left"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>'+
      '</div>'+
      '</div>'+
      '<div class="col-lg-5">'+
        '<div class="form-group">'+
            '<label for="">Search Engine</label>'+
              '<select multiple class="form-control" style="height: 250px;" id="ddl_search_engine">'+
          '</select>'+
          '</div>'+
      '</div>'+
    '</div>'+
      '<button type="submit" class="btn btn-default">Save</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);

    //Load dialog wiht form
    $(".modal-body").html(form);

    //Load DDL of fields available
    load_ddl_fields_available_search();

    //Default disable button
    //$('#btn_fields_to_left').prop('disabled', true);

    //Add fields available to search 
    $("#btn_fields_to_right").click(function(){
      add_fields_available_to_search();
    });

    //Remove search fields to fields available 
    $("#btn_fields_to_left").click(function(){
      add_to_search_fields_available();
    });

    
     //Init Validation Engine
    $("#form_add_search_fields").validationEngine();

    //When submit add event
    $("#form_add_search_fields").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      update_search_fields();
    });

}

function update_search_fields(){

  var status =  $("#form_add_search_fields").validationEngine('validate');
  var search_fields = []; 

  $("#ddl_search_engine option").each(function(){
    search_fields.push($(this).val()); 
  });

  if(search_fields.length > 0){

    if(status == true){
      //Send and Save Search Engine Fields
      $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'update_fields_search',
          list_id: list_info[0]["list_id"],
          fields: search_fields
        },
        success: function(response){
          console.log(response)
            //Close dialog
            $('#myModal').modal('hide');
            //Reload event list
            load_list_list();
        }
      });
    }
  }else{
     $('#ddl_search_engine').validationEngine('showPrompt', 'This field is required.', 'load');
  }
}

function load_ddl_fields_available_search(){
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_fields_searched',
          list_id: list_info[0]["list_id"]
        },
        success: function(response){
          

          if(response){
            searched_info = response;
            //console.log(response);
            //Quantity list
            var qty = response.length;
            //Load ddl
            for (var i = 0; i < qty; i++){
              $('#ddl_search_engine').append($('<option>', {
                  value: response[i]['field_name'],
                  text: response[i]['field_name']
              }));
            }

            load_ddl_fields_available_compare();

          }else{
            load_ddl_fields_available();
          }//End else
          
        }//End success
    });

}



function load_ddl_fields_available_compare(){


  $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_fields_available',
          table_name: list_info[0]["list_table_name"]
        },
        success: function(response){

            available_arr = [];
            search_arr = [];
            //Load current available fields
            var qty = response.length;
            for (var i = 1; i < qty; i++){
              available_arr.push(response[i]['Field']);
            }

            //Load current search fields
            var qty2 = searched_info.length;
            for (var i = 0; i < qty2; i++){
              search_arr.push(searched_info[i]['field_name']);
            }
            

            //Preparing available fields 
            available_arr = available_arr.filter( function( el ) {
              return search_arr.indexOf( el ) < 0;
            } );
            
            console.log(available_arr);
            //Load DDL available fields
            var qty3 = available_arr.length;
            //Load ddl
            for (var i = 0; i < qty3; i++){
              $('#ddl_fields_available').append($('<option>', {
                  value: available_arr[i],
                  text: available_arr[i]
              }));
            }

        }
    });

}




Array.prototype.multisplice = function(){
    var args = Array.apply(null, arguments);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        this.splice(index, 1);
    }        
}

