
var search_limit_rows = 10; //Search limit rows

function init_event(){

	load_event_list();

  //Init search
  $("#btn_search").click(function(){

    load_event_list();
    
  });

  



	

}



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
                        '<label class="btn btn-success btn-xs">' +
                           'Display the form' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs">' +
                           '<span>attended: <span class="badge">789</span></span>' +
                        '</label>' +
                        
                        '<label class="btn btn-default btn-xs">' +
                         '<span class="glyphicon glyphicon-signal" aria-hidden="true"></span>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs">' +
                          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                       ' </label>' +
                        '<label class="btn btn-default btn-xs">' +
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



function program_events(){
  
  //Init add event dialog
  $("#add_event").click(function(){

    init_ass_event_dialog();
    
  });

  //Init more result
  $("#btn_more").click(function(){
    search_limit_rows = parseInt(search_limit_rows) + 10;
    load_event_list();
    
  });
  

}


function init_ass_event_dialog(){

  $('#myModal').modal({
      keyboard: false
    });

    $(".modal-title").text("Create Event")

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
        '<select class="form-control" id="ddl_lists">'+
          '<option>Choose the List</option>'+
          '<option>2</option>'+
          '<option>3</option>'+
          '<option>4</option>'+
          '<option>5</option>'+
        '</select>'+
      '</div>'+
      '<button type="submit" class="btn btn-default">Create</button>'+
    '</form>';
    

   

    $(".modal-body").html(form);

    $("#form_add_event").validationEngine();

}