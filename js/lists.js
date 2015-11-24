/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var search_limit_rows = 10; //Search limit rows
var event_info = null; //Get event info Obj
var table_name = null;

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
                        '<label class="btn btn-default btn-xs" title="Filter">' +
                        	'<span class="glyphicon glyphicon-filter" aria-hidden="true"></span>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs" title="View Records">' +
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
    load_event_list();
    
  });

  //Init delete event
  $(".btn_delete_event").click(function(){
    delete_event($(this).attr("rel"));
  });

  //Init edit event
  $(".btn_edit_event").click(function(){
    get_info_to_edit_event($(this).attr("rel"));
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
    $(".modal-title").html('<img src="img/icons/database.png" width="50"> Search Filter');
    //Create form
    var form = '<form id="form_add_list">'+
    '<div id="form_error"></div>'+
    '<div class="row">'+
	    '<div class="col-lg-5">'+
	    	'<div class="form-group">'+
	        	'<label for="">Fields Available</label>'+
	        		'<select multiple class="form-control" style="height: 250px;">'+
					  '<option>1</option>'+
					  '<option>2</option>'+
					  '<option>3</option>'+
					  '<option>4</option>'+
					  '<option>5</option>'+
					'</select>'+
	      	'</div>'+
	    '</div>'+
	    '<div class="col-lg-2">'+
	    	'<div class="btn-group-vertical" role="group" aria-label="Vertical button group" style="position: relative; top: 100px; left: 15px;">'+
      			'<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
      			'<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>'+
			'</div>'+
	    '</div>'+
	    '<div class="col-lg-5">'+
	    	'<div class="form-group">'+
	        	'<label for="">Search Engine</label>'+
	        		'<select multiple class="form-control" style="height: 250px;">'+
					  '<option>1</option>'+
					  '<option>2</option>'+
					  '<option>3</option>'+
					  '<option>4</option>'+
					  '<option>5</option>'+
					'</select>'+
	      	'</div>'+
	    '</div>'+
	  '</div>'+
      '<button type="submit" class="btn btn-default">Save</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);

}
