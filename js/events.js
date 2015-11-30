
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var search_limit_rows = 10; //Search limit rows
var event_info = null; //Get event info Obj
var search_arr = null; //Storage search


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Event Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_event(){

	load_event_list();

  //Init search
  $("#btn_search").click(function(){

    load_event_list();
    
  });

   //Init add event dialog
  $("#add_event").click(function(){

    init_add_event_dialog();
    
  });

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load Event into Content
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_event_list(){

  $.ajax({
    type: "POST",
    url: 'php/actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_events', 
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
                      '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+response[i]["event_id"]+'" aria-expanded="true" aria-controls="collapseOne" style="text-decoration: none;">'+
                        response[i]["event_name"] +
                      '</a>' +
                      '<div class="btn-group pull-right" data-toggle="buttons" style="position: relative; top: -2px;">' +
                        '<label class="btn btn-success btn-xs btn_display_form" rel="'+response[i]["event_id"]+'" title="'+response[i]["event_name"]+'">' +
                           'Display the form' +
                        '</label>' +
                        
                        '<label class="btn btn-default btn-xs">' +
                         '<span class="glyphicon glyphicon-stats" aria-hidden="true"></span>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs btn_edit_event" rel="'+response[i]["event_id"]+'">' +
                          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                       ' </label>' +
                        '<label class="btn btn-default btn-xs btn_delete_event" rel="'+response[i]["event_id"]+'">' +
                          '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
                        '</label>' +
                       
                      '</div>' +
                     
                    '</h4>' +
                 ' </div>' +
                  '<div id="collapse'+response[i]["event_id"]+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
                    '<div class="panel-body">' + response[i]["event_desc"] +
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

  $(".btn_display_form").click(function(){
    init_display_form($(this).attr("rel"),$(this).attr("title"));
  });
  

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Form of Add Event into Dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_add_event_dialog(){
  //Open dialog
  $('#myModal').modal({
      keyboard: false
    });
    //Dialog title
    $(".modal-title").html('<img src="img/icons/calendar.png" width="50"> Create Event')
    //Create form
    var form = '<form id="form_add_event">'+
      '<div class="form-group">'+
        '<label for="">Name</label>'+
        '<input type="text" class="validate[required] form-control" id="txt_event_name" placeholder="Name of Event">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Description</label>'+
        '<textarea class="validate[required] form-control" rows="3" id="txt_event_desc"></textarea>'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">List</label>'+
        '<select class="validate[required] form-control" id="ddl_lists">'+
          '<option>Choose the List</option>'+
        '</select>'+
      '</div>'+
      '<button type="submit" class="btn btn-default">Create</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);

    //Load ddl_lists
    load_ddl_list();

    //Init Validation Engine
    $("#form_add_event").validationEngine();

    //When submit add event
    $("#form_add_event").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      add_event();
    });


}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load DDL of List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_ddl_list(){
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_all_list'
        },
        success: function(response){
          //Quantity list
          var qty = response.length;
          //Load ddl
          for (var i = 0; i < qty; i++){
            $('#ddl_lists').append($('<option>', {
                value: response[i]['list_id'],
                text: response[i]['list_name']
            }));
          }
        }
    });

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
When Add Event Form is Submit
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function add_event(){
  //Get form status
  var status = $("#form_add_event").validationEngine('validate');

  if(status == true){
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'add_event', 
          event_name: $("#txt_event_name").val(),
          event_desc: $("#txt_event_desc").val(),
          list_id: $("#ddl_lists").val()
        },
        success: function(response){
          if(response.success){
            //Close dialog
            $('#myModal').modal('hide');
            //Reload event list
            load_event_list();
          }
        }
      });

  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Delete Event by Event ID
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function delete_event(e){
  var del = confirm("Do you want delete this event?");
    
    if (del == true) {
        
      //Send params to add event
      $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'del_event', 
          event_id: e
        },
        success: function(response){
          if(response.success){
          
            //Reload event list
            load_event_list();

          }
        }
      });

    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Get Event Info to Edit It
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function get_info_to_edit_event(e){
        
      //Send params to add event
      $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_event_info', 
          event_id: e
        },
        success: function(response){
          //Storage event info obj
          event_info = response;
          console.log(response)
          //Init edit event dialog
          init_edit_event_dialog(e);
        }
      });

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Form of Add Event into Dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_edit_event_dialog(e){
  //Open dialog
  $('#myModal').modal({
      keyboard: false
    });
    //Dialog title
    $(".modal-title").html('<img src="img/icons/calendar.png" width="50"> Edit Event')
    //Create form
    var form = '<form id="form_edit_event">'+
      '<div class="form-group">'+
        '<label for="">Name</label>'+
        '<input type="text" class="validate[required] form-control" id="txt_event_name" placeholder="Name of Event" value="'+event_info[0]["event_name"]+'">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Description</label>'+
        '<textarea class="validate[required] form-control" rows="3" id="txt_event_desc">'+event_info[0]["event_desc"]+'</textarea>'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">List</label>'+
        '<input class="form-control" id="disabledInput" type="text" placeholder="" value="'+event_info[0]["list_name"]+'" rel="'+event_info[0]["list_id"]+'"  disabled>'+
      '</div>'+
      '<button type="submit" class="btn btn-default">Edit</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);


    //Init Validation Engine
    $("#form_edit_event").validationEngine();

    //When submit add event
    $("#form_edit_event").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      edit_event(e);
    });


}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Edit Event Info
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function edit_event(e){
  //Get form status
  var status = $("#form_edit_event").validationEngine('validate');

  if(status == true){
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'edit_event', 
          event_name: $("#txt_event_name").val(),
          event_desc: $("#txt_event_desc").val(),
          event_id: e
        },
        success: function(response){
          if(response.success){
            //Close dialog
            $('#myModal').modal('hide');
            //Reload event list
            load_event_list();
          }
        }
      });

  }
}





function init_display_form(event_id, title){
  //Init Fullscreen Mode
  $(document).fullScreen(true);

  //Put title
  $("#lbl_title").text(title);

  //HTML Empty
  $("#header-content").html('');

  var form = '<form id="form_search_in_list">'+ 
  '<div class="input-group">' +
    '<input type="text" class="form-control" placeholder="Search any fields in list..." id="txt_search">'+
      '<span class="input-group-btn">'+
        '<button class="btn btn-default" type="submit" id="btn_search">Search</button>'+
      '</span>'+
  '</div></form><hr><div id="table-content"></div>';

  $("#general-content").html(form);

  //Init Validation Engine
  $("#form_search_in_list").validationEngine();

  //When submit add event
  $("#form_search_in_list").submit(function(event){
    //Prevent Default
    event.preventDefault();
    //Call add event function
    search_in_list(event_id);
  });



}


function search_in_list(event_id){

  //Get form status
  var status = $("#form_search_in_list").validationEngine('validate');

  if(status == true){
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'search_in_list', 
          search: $("#txt_search").val(),
          event_id: event_id
        },
        success: function(response){

          if(response){
            search_arr = response;

            load_search_table(event_id);
          }else{
            $("#table-content").html('<div class="alert alert-info" role="alert">No Record found</div>');
          }
        }
      });

  }

}



function load_search_table(event_id){
  //Convert Obj to Array
  var col = $.map(search_arr[0], function(el) { return el });
  var qty_rows = search_arr.length; //Qty Rows
  var qty_col = col.length; //Qty Coluns

  $("#table-content").html('<table class="table table-bordered table-hover" id="search_table"></table>');
  
  var table_content = '<thead> <tr>'; 
  var colunm = $.map(search_arr[0], function(el) { return el });
  //Insert Column 
  $.each(search_arr[0], function( key, obj ) {
    table_content += '<th>' +key+ '</th>';
  });

  table_content += '<tr></thead>';

      //Init var to storage html content
      table_content += '<tbody>';
      
      //For rows
      for(var i = 0; i < qty_rows; i++){
        table_content += '<tr class="row_id" rel="'+search_arr[i]['ID']+'" att="'+search_arr[i]['Attended']+'">';
        //For columns
        for(var e = 0; e < qty_col; e++){
          var colunm = $.map(search_arr[i], function(el) { return el });
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
      $("#search_table").append(table_content);

      $(".row_id").click(function(){
        register_guest($(this).attr("rel"), event_id, $(this).attr("att"));
      });


}



function register_guest(row_id,event_id,att){

  if(att == 'No'){
    var msg = 'Do you want to register this guest?'
  }else{
    var msg = 'Do you want to remove the assistance of this guest?'
  }

  var register = confirm(msg);
    
  if (register == true) {
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action:   'register_guest', 
          row_id    : row_id,
          event_id  : event_id,
          att       : att
        },
        success: function(response){
          search_in_list(event_id);
        }
      });
  }

}
