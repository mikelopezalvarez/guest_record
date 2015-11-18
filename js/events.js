


function init_event(){

	load_event_list();

	

}



function load_event_list(){

	var rows = [
	    [1, "Asamblea Anual", 167, "11-23-2016"],
	    [2, "Junta de Delegados", 145, "11-24-2016"],
	    [3, "Asamblea Trimestral", 130, "11-11-2016"]
	];

	var qty = rows.length;
	var htm = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
	for(var i = 0; i < qty; i++){
		htm += '<div class="panel panel-default">'+
           '<div class="panel-heading" role="tab" id="headingOne">' +
              '<h4 class="panel-title">' +
                '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+rows[i][0]+'" aria-expanded="true" aria-controls="collapseOne" style="text-decoration: none;">'+
                  rows[i][1] +
                '</a>' +
                '<div class="btn-group pull-right" data-toggle="buttons" style="position: relative; top: -2px;">' +
                  '<label class="btn btn-success btn-xs">' +
                     'Display the form' +
                  '</label>' +
                  '<label class="btn btn-default btn-xs">' +
                     '<span>attended: <span class="badge">'+rows[i][2]+'</span></span>' +
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
            '<div id="collapse'+rows[i][0]+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
              '<div class="panel-body">' +
                'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.'+
              '</div>' +
            '</div>' +
          '</div>';
	}

	htm += '</div>';

	$("#general-content").html(htm);


  program_events();

}



function program_events(){

  $("#add_event").click(function(){

    init_ass_event_dialog();
    
  });

}


function init_ass_event_dialog(){

  $('#myModal').modal({
      keyboard: false
    });

    $(".modal-title").text("Create Event")

    var form = '<form id="form_event">'+
      '<div class="form-group">'+
        '<label for="">Title</label>'+
        '<input type="text" class="validate[required] form-control" id="" placeholder="Title">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Description</label>'+
        '<textarea class="validate[required] form-control" rows="3"></textarea>'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">List</label>'+
        '<select class="form-control">'+
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

    $("#form_event").validationEngine();

}