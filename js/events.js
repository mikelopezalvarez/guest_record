
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var search_limit_rows = 10; //Search limit rows
var event_info = null; //Get event info Obj
var search_arr = null; //Storage search
var basic_analytics = null; //Storage Basic Analytics
var LineChart = null;
var refreshStatics = null; //Automatic Refresh
var refreshChart = null; //Automatic Refresh chart


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Event Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_event(){

	load_event_list();

  //Init search
  $("#btn_search").click(function(){

    load_event_list();
    
  });


  //Load header search
  load_header_search();

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load Search of Header
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_header_search(){
  //Set screen title
  $("#lbl_title").text('Events');

  var html = '<div class="col-md-4 col-lg-4">'+
            '<div class="input-group">'+
              '<input type="text" class="form-control" placeholder="Search for..." id="txt_search">'+
              '<span class="input-group-btn">'+
                '<button class="btn btn-default" type="button" id="btn_search">Search</button>'+
              '</span>'+
            '</div>'+
          '</div>'+
         ' <div class="col-md-8 col-lg-8">'+
            '<img src="img/icons/add.png" width="35" style=" float: right; cursor: pointer;" id="add_event"/>'+
          '</div>';

  $("#header-content").html(html);

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
                        
                        '<label class="btn btn-default btn-xs btn_analytics_event" rel="'+response[i]["event_id"]+'">' +
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

  //Init analytics event
  $(".btn_analytics_event").click(function(){
    init_full_analytics_events($(this).attr("rel"));
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




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Display Form 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_display_form(event_id, title){
  //Init Fullscreen Mode
  $(document).fullScreen(true);

  $(document).bind("fullscreenchange", function() {
    var mode = ($(document).fullScreen() ? "on" : "off");
    if(mode == "off"){
      init_event();
      clearInterval(refreshStatics);
    }
  });

  //Put title
  $("#lbl_title").text(title);

  //HTML Empty
  $("#header-content").html('');

  var form = '<div class="row"><div class="col-lg-8"><form id="form_search_in_list">'+ 
  '<div class="input-group">' +
    '<input type="text" class="form-control" placeholder="Search any fields in list..." id="txt_search">'+
      '<span class="input-group-btn">'+
        '<button class="btn btn-default" type="submit" id="btn_search">Search</button>'+
      '</span>'+
  '</div></form></div><div class="col-lg-4" id="search_analytics"></div></div><hr><div id="table-content"></div>';

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

  //Load first time analytics bar
  display_percent_attended(event_id);
  //Reload Analytics Bar each 5s
  refreshStatics = setInterval(display_percent_attended, 5000, event_id);


}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Search into List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function search_in_list(event_id){

  //Display percent attended
  display_percent_attended(event_id);

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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load Search Table 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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
        if(search_arr[i]['Attended'] == "Yes"){
          table_content += '<tr class="success row_id" rel="'+search_arr[i]['ID']+'" att="'+search_arr[i]['Attended']+'">';
        }else{
          table_content += '<tr class="row_id" rel="'+search_arr[i]['ID']+'" att="'+search_arr[i]['Attended']+'">';
        }
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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Register Guest
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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
          //search_in_list(event_id);

          $("#txt_search").val('').focus();
          $("#table-content").empty();
        }
      });



  }

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Put the Percent Bar into HTML
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function display_percent_attended(event_id){

  get_basic_analytics_event({
    event_id : event_id,
    success: function(result){

      $("#search_analytics").html('<div class="progress" style="margin-bottom: 0px !important;">'+
        '<div class="progress-bar" role="progressbar" aria-valuenow="'+result.perc+'" aria-valuemin="0" aria-valuemax="100" style="width: '+result.perc+'%;">'+
            result.perc +'%'+
        '</div>'+
      '</div><div class="pull-right">'+result.total_attended+ ' attended of '+result.total_rows+' guest</div>');

    }
  });

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Get Basic Analytics Information
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function get_basic_analytics_event(p){
  
  $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action:   'get_basic_analytics_event', 
          event_id  : p.event_id
        },
        success: function(result){

                if(p && p.success)
                p.success(result);
        }
  });


}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Full Analytics Dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_full_analytics_events(event_id){

  //Open dialog
  $('#myModal').modal({
      keyboard: false
    });
    //Dialog title
    $(".modal-title").html('<img src="img/icons/powerpoint.png" width="50"> Statistics Event')
    //Resize modal
    $('.modal-dialog').css("width","60%");
    //Create form
    var content = '<div class="row"><div class="col-lg-12 col-md-12"><div id="modal-analytics-bar"></div>'+
    '<hr><div id="modal-analytics-text"></div>'+
    '<hr><div id="modal-analytics-chart">'+
    '<div class="row">'+
      '<div class="col-lg-4 col-md-6 col-sm-11 col-xs-12" style="padding-right: 0;">'+
        '<input type="text" class="form-control" placeholder="Select date" id="txt_chart_date" disabled="disabled" />'+
      '</div>'+
      '<div class="col-lg-4 col-md-6 col-sm-1 col-xs-12" style="padding-left: 0;">'+
        '<button class="btn btn-default" type="button" id="btn_chart_date">'+
            '<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>'+
        '</button>'+
      '</div>'+
      '</div>'+
        '<divs id="chart" style=""></div>'+
      '</div>'+
      '<hr><div id="modal-analytics-users"></div></div></div>';
    
    //Load dialog wiht form
    $(".modal-body").html(content);
    
    //Get Basic Info
    get_basic_analytics_event({
      event_id : event_id,
      success: function(result){

        $("#modal-analytics-bar").html('<div class="progress" style="margin-bottom: 0px !important;">'+
        '<div class="progress-bar" role="progressbar" aria-valuenow="'+result.perc+'" aria-valuemin="0" aria-valuemax="100" style="width: '+result.perc+'%;">'+
            result.perc +'%'+
        '</div>'+
      '</div><div class="pull-right">');

        $("#modal-analytics-text").html('<div class="row"><div class="col-lg-6"><dl class="dl-horizontal">'+
            '<dt>Total:</dt>'+
            '<dd>'+result.total_rows+'</dd>'+
            '<dt>Attended:</dt>'+
            '<dd>'+result.total_attended+'</dd>'+
          '</dl></div><div class="col-lg-6"><dl class="dl-horizontal">'+
            '<dt>Percentage:</dt>'+
            '<dd>'+result.perc+'%</dd>'+
            '<dt>Users Working:</dt>'+
            '<dd>'+result.users_working+'</dd>'+
          '</dl></div></div>');

        init_chart_event(event_id);


      }
    });

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Chart 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_chart_event(event_id){

  //Get Min and Max Date Record
    get_min_max_date_of_event({
      event_id : event_id,
      success: function(result){
        //Init datepicker
        $("#txt_chart_date").datepicker({ 
          dateFormat: 'yy-mm-dd',
          minDate: result[0]['min_date'],
          maxDate: result[0]['max_date']
        });

        //Fill text field with Date (First Time)
        $("#txt_chart_date").val(result[0]['txt_date']);
         
        //Init Date Picker
        $("#btn_chart_date").click(function(event){
          //event.preventDefault();
            $("#txt_chart_date").datepicker('show');
        });


        //Init Date Picker
        $("#txt_chart_date").change(function(){
            load_chart_event(event_id);
        });



        //When window resize call chart function
        $( window ).resize(function() {
          load_chart_event(event_id);
        });

        //Call chart each 3 second
        refreshChart = setInterval(load_chart_event, 3000, event_id);
        //Clear interval when modal is close
        $('#myModal').on('hidden.bs.modal', function (e) {
          clearInterval(refreshChart);
        })



      }
    });
  
}

  


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Display Line Chart
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_chart_event(event_id){ 

  //Get Count of Each Hours 
  get_count_event_all_hours({
    event_id : event_id,
    selected_date: $("#txt_chart_date").val(),
    success: function(result){

   

      /* Add a basic data series with six labels and values */
      var data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
        series: [
          {
            data: [result.h1, result.h2, result.h3, result.h4, result.h5, result.h6, result.h7, result.h8, result.h9, result.h10, result.h11, result.h12, result.h13, result.h14, result.h15, result.h16, result.h17, result.h18, result.h19, result.h20, result.h21, result.h22, result.h23, result.h24]
          }
        ]
        
      };

      var w = $('.modal-dialog').width()  + "px"; 

      /* Set some base options (settings will override the default settings in Chartist.js *see default settings*). We are adding a basic label interpolation function for the xAxis labels. */
      var options = {
        axisX: {
          labelInterpolationFnc: function(value) {
              return '<div class="chart-label" rel="'+value+'">h <strong>' + value + '</strong></div>';
          }
        },
        width: w,
        height: '200px',
        low: 100,
        showArea: true,
        fullWidth: true,
        showPoint: true
      };

      /* Now we can specify multiple responsive settings that will override the base settings based on order and if the media queries match. In this example we are changing the visibility of dots and lines as well as use different label interpolations for space reasons. */
      var responsiveOptions = [
        ['screen and (min-width: 641px) and (max-width: 1024px)', {
          showPoint: false,
          axisX: {
            labelInterpolationFnc: function(value) {
              return '<div class="chart-label" rel="'+value+'">h <strong>' + value + '</strong></div>';
            }
          },
          width: $('.modal-dialog').width()  + "px"
        }],
        ['screen and (max-width: 640px)', {
          showLine: false,
          axisX: {
            labelInterpolationFnc: function(value) {
              return '<div class="chart-label" rel="'+value+'">h <strong>' + value + '</strong></div>';
            }
          },
          width: $('.modal-dialog').width()  + "px"
        }]
      ];


      /* Initialize the chart with the above settings */
      var chart = new Chartist.Line('#chart', data, options, responsiveOptions);

      chart.on('created', function(){
        chart_event_settting(event_id);
      });
    
     }
  });
  
  
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Chart Tooltip Configuration
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function chart_event_settting(event_id){
   
//Display Tooltip
  $('.ct-point').click(function(e){
      e.stopPropagation();
      var hour = parseInt($(this).index()) - 1;
      //console.log(hour);

    var div = $("#chart-tooltip");
    div.css( {
        display: 'inline',
        position:"absolute", 
        top:event.pageY, 
        left: event.pageX
    });

    //Get Attended Info by Hour
    get_chart_attended_by_hour({
      event_id : event_id,
      record_date: $("#txt_chart_date").val(),
      hour: hour,
      success: function(result){
       

        $("#title-tooltip").html('Hour : <span class="">'+ hour+'</span><br /><br />');


        //Convert Obj to Array
        var col = $.map(result[0], function(el) { return el });
        var qty_rows = result.length; //Qty Rows
        var qty_col = col.length; //Qty Coluns

        $("#chart_table_area").html('<table class="table table-bordered table-hover" id="chart_table"></table>');
        
        var table_content = '<thead> <tr>'; 
        var colunm = $.map(result[0], function(el) { return el });
        //Insert Column 
        $.each(result[0], function( key, obj ) {
          table_content += '<th>' +key+ '</th>';
        });

        table_content += '<tr></thead>';

            //Init var to storage html content
            table_content += '<tbody>';
            
            //For rows
            for(var i = 0; i < qty_rows; i++){
             
              table_content += '<tr class="row_id" rel="" att="">';
             
              //For columns
              for(var e = 0; e < qty_col; e++){
                var colunm = $.map(result[i], function(el) { return el });
                  table_content += '<td>'+colunm[e]+'</td>';
              }
              table_content += '</tr>';

            }

            table_content += '</tbody>';

            //Append Table
            $("#chart_table").append(table_content);
        
      }
    });
  });





  //Hide Tooltip
  $(document).on('click',function(){
    $("#chart-tooltip").hide();
  });

  //When click div not hide tooltip
  $('#chart-tooltip').click(function(e){
      e.stopPropagation();

  });




}





/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Get Chart Attended By Date & Hour
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function get_chart_attended_by_hour(p){
  
  $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action:   'get_chart_attended_by_hour', 
          event_id    : p.event_id,
          record_date : p.record_date,
          hour        : p.hour
        },
        success: function(result){

                if(p && p.success)
                p.success(result);
        }
  });


}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Get Min and Max Date of Event
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function get_min_max_date_of_event(p){
  
  $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action:   'get_min_max_date_of_event', 
          event_id    : p.event_id
        },
        success: function(result){

                if(p && p.success)
                p.success(result);
        }
  });


}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Get Count Event All Hours
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function get_count_event_all_hours(p){
  
  $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action:   'get_count_event_all_hours', 
          event_id    : p.event_id,
          selected_date: p.selected_date
        },
        success: function(result){

                if(p && p.success)
                p.success(result);
        }
  });


}