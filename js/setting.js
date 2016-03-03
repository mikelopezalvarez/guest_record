/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var search_limit_rows = 10; //Search limit rows
var selected_tab = null; //Indicate selected tab
var user_info = null; //User Information
var settings = null; //Settings Information


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init List Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_setting(){

  selected_tab = $(".tab-content").find(".active").attr('id');


  switch(selected_tab){
    case 'users':
        //Load users list
        load_list_users();

        //Init search
        $("#btn_search").click(function(){

          load_list_users();
          
        });
      break;

    case 'settings':
    alert();
        form_settings();
      break;
  }


  change_tab_event();

  
  

  //Init add event dialog
  $("#add_user").click(function(){
    init_add_user_dialog();
    
  });


}


function change_tab_event(){

  $(".tab-setting").click(function(){

    selected_tab = $(".tab-content").find(".active").attr('id');


    switch(selected_tab){
      case 'users':
          //Load users list
          load_list_users();

          //Init search
          $("#btn_search").click(function(){

            load_list_users();
            
          });
        break;

      case 'settings':
          form_settings();
        break;
    }
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load users into users tab
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function load_list_users(){

  $.ajax({
    type: "POST",
    url: 'php/actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_users', 
      search: (($("#txt_search").val()) ? $("#txt_search").val() : -1 ),
      limit_rows: search_limit_rows
    },
    success: function(response){

      //Quantity of Rows
    	var qty = response.length;
      if(qty > 0){
      	var htm = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"><br>';
      	for(var i = 0; i < qty; i++){
      		htm += '<div class="panel panel-default">'+
                 '<div class="panel-heading" role="tab" id="headingOne">' +
                    '<h4 class="panel-title">' +
                      '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+response[i]["user_id"]+'" aria-expanded="true" aria-controls="collapseOne" style="text-decoration: none;">'+
                        response[i]["fullname"] +
                      '</a>' +
                      '<div class="btn-group pull-right" data-toggle="buttons" style="position: relative; top: -2px;">' +
                        '<label class="btn btn-default btn-xs btn_edit_user" rel="'+response[i]["user_id"]+'" title="Edit">' +
                          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                       ' </label>' +
                        '<label class="btn btn-default btn-xs btn_delete_user" rel="'+response[i]["user_id"]+'" title="Delete">' +
                          '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
                        '</label>' +
                       
                      '</div>' +
                     
                    '</h4>' +
                 ' </div>' +
                  '<div id="collapse'+response[i]["user_id"]+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
                    '<div class="panel-body">' + response[i]["fullname"] +
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

    $("#users").html(htm);


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
    load_list_users();
    
  });

  //Init delete user
  $(".btn_delete_user").click(function(){
    delete_user($(this).attr("rel"));
  });

  //Init edit user
  $(".btn_edit_user").click(function(){
    get_info_to_edit_user($(this).attr("rel"));
  });
 
  

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Form of Add List into Dialog
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_add_user_dialog(){
  //Open dialog
  $('#myModal').modal({
      keyboard: false
    });
    //Dialog title
    $(".modal-title").html('<img src="img/icons/user-group.png" width="50"> Create User')
    //Create form
    var form = '<form id="form_add_user">'+
    '<div id="form_error"></div>'+
      '<div class="form-group">'+
        '<label for="">Fullname</label>'+
        '<input type="text" class="validate[required] form-control" id="txt_fullname" placeholder="Fullname">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Username</label>'+
        '<input class="validate[required] form-control" id="txt_username" type="text" placeholder="Username" data-errormessage-custom-error="">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Password</label>'+
        '<input class="validate[required] form-control" id="txt_password1" type="password" placeholder="Password">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Repeat Password</label>'+
        '<input class="validate[required,equals[txt_password1]] form-control" id="txt_password2" type="password" placeholder="Repeat Password">'+
      '</div>'+
      '<div class="form-group">'+
        '<label for="">Admin</label><br>'+
        '<input class="" id="chk_admin" type="checkbox" />'+
      '</div>'+
      '<button type="submit" class="btn btn-default">Create</button>'+
    '</form>';
    

   
    //Load dialog wiht form
    $(".modal-body").html(form);


    //Init Validation Engine
    $("#form_add_user").validationEngine();

    //When submit add event
    $("#form_add_user").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      add_user();
    });


}



function add_user(){

	var status =  $("#form_add_user").validationEngine('validate');
  var validateSpace = hasWhiteSpace($("#txt_username").val());
  var username = $("#txt_username").val();
  var admin = (($("#chk_admin").is(":checked")) ? 1 : 0);


  if (!validateSpace) {
    //get email in databases
    $.ajax({
          type: "POST",
          url: 'php/actions.php',
          dataType : 'JSON',
          data: { 
            action: 'validate_exist_username', 
            username: $("#txt_username").val(),
          },
          success: function(response){

            if(response[0]['qty'] < 1){

              if(status == true){
                  //Send params to add user
                  $.ajax({
                      type: "POST",
                      url: 'php/actions.php',
                      dataType : 'JSON',
                      data: { 
                        action: 'add_user', 
                        fullname: $("#txt_fullname").val(),
                        username: $("#txt_username").val(),
                        passw: $("#txt_password1").val(),
                        admin: admin
                      },
                      success: function(response){
                        if(response.success){
                          //Close dialog
                          $('#myModal').modal('hide');
                          //Reload event list
                          load_list_users();
                        }
                      }
                    });

                  }

            }else{
              //Show error message when the username exist
              $('#txt_username').validationEngine('showPrompt', 'The username is already exist.', 'load');
            }//end if



          }//ense success
    });

  	
  }else{
    //Show the error message when username has a whitespaces
    $('#txt_username').validationEngine('showPrompt', 'This field does not accept blanks spaces', 'load');
  }
}


function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}















function get_info_to_edit_user(user_id){

  //Get user information
   $.ajax({
      type: "POST",
      url: 'php/actions.php',
      dataType : 'JSON',
      data: { 
        action: 'get_user_info_by_id',
        user_id: user_id
      },
      success: function(response){

        user_info = response; //response[0]['list_table_name'];
        //console.log(response);

        if(response){

          //Open dialog
          $('#myModal').modal({
              keyboard: false
          });
          //Dialog title
          $(".modal-title").html('<img src="img/icons/pencil.png" width="50"> Edit User');

          //Edit form
          var form = '<form id="form_edit_user">'+
          '<div id="form_error"></div>'+
            '<div class="form-group">'+
              '<label for="">Fullname</label>'+
              '<input type="text" class="validate[required] form-control" id="txt_fullname" placeholder="Fullname" value="'+user_info[0]["fullname"]+'">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="">Username</label>'+
              '<input class="validate[required] form-control" id="txt_username" type="text" placeholder="Username" data-errormessage-custom-error="" value="'+user_info[0]["username"]+'">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="">Change Password</label><br>'+
              '<input class="" id="chk_password" type="checkbox" />'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="">Password</label>'+
              '<input class="form-control" id="txt_password1" type="password" placeholder="Password" readonly="readonly">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="">Repeat Password</label>'+
              '<input class="form-control" id="txt_password2" type="password" placeholder="Repeat Password" readonly="readonly">'+
            '</div>'+
            '<div class="form-group">'+
              '<label for="">Admin</label><br>'+
              '<input class="" id="chk_admin" type="checkbox" />'+
            '</div>'+
            '<button type="submit" class="btn btn-default">Edit</button>'+
          '</form>';


         
          //Load dialog wiht form
          $(".modal-body").html(form);


          //Verify admin to checked
          if(user_info[0]["admin"] == 1){
            $('#chk_admin').prop('checked', true);
          }


          change_password_event();



          //Init Validation Engine
          $("#form_edit_user").validationEngine();

          //When submit add event
          $("#form_edit_user").submit(function(event){
            //Prevent Default
            event.preventDefault();
            //Call add event function
            edit_user();
          });

          


        }


      }
  });



}



function change_password_event(){

  $("#chk_password").click(function(){
    if($(this).is(':checked')){
      $("#txt_password1").attr("readonly", false);
      $("#txt_password1").attr("class", "validate[required] form-control");
      $("#txt_password2").attr("readonly", false);
      $("#txt_password2").attr("class", "validate[required,equals[txt_password1]] form-control");
      $('#form_edit_user').validationEngine('hideAll');

    }else{
      $("#txt_password1").attr("readonly", true);
      $("#txt_password1").attr("class", "form-control");
      $("#txt_password2").attr("readonly", true);
      $("#txt_password2").attr("class", "form-control");
      $('#form_edit_user').validationEngine('hideAll');

    }
  });



}



function edit_user(){
  var status =  $("#form_edit_user").validationEngine('validate');
  var validateSpace = hasWhiteSpace($("#txt_username").val());
  var username = $("#txt_username").val();

  if (!validateSpace) {
    //get email in databases
    $.ajax({
          type: "POST",
          url: 'php/actions.php',
          dataType : 'JSON',
          data: { 
            action: 'validate_exist_username', 
            username: $("#txt_username").val(),
          },
          success: function(response){
            
            if(response[0]['qty'] < 1){

              if(status == true){
                  submit_edit_user();
              }

            }else{

              if($("#txt_username").val() != user_info[0]["username"]){
                //Show error message when the username exist
                $('#txt_username').validationEngine('showPrompt', 'The username is already exist.', 'load');
              }else{
                if(status == true){
                  submit_edit_user();
                }
              }
             
            }//end if



          }//ense success
    });

    
  }else{
    //Show the error message when username has a whitespaces
    $('#txt_username').validationEngine('showPrompt', 'This field does not accept blanks spaces', 'load');
  }
}




function submit_edit_user(){

  var admin = (($("#chk_admin").is(":checked")) ? 1 : 0);


  if($("#chk_password").is(':checked')){

    $.ajax({
      type: "POST",
      url: 'php/actions.php',
      dataType : 'JSON',
      data: { 
        action: 'edit_user', 
        fullname: $("#txt_fullname").val(),
        username: $("#txt_username").val(),
        passw: $("#txt_password1").val(),
        admin: admin,
        change_pass: 1,
        user_id: user_info[0]["user_id"]
      },
      success: function(response){
        if(response.success){
          //Close dialog
          $('#myModal').modal('hide');
          //Reload event list
          load_list_users();
        }
      }
    });

  }else{

    $.ajax({
      type: "POST",
      url: 'php/actions.php',
      dataType : 'JSON',
      data: { 
        action: 'edit_user', 
        fullname: $("#txt_fullname").val(),
        username: $("#txt_username").val(),
        admin: admin,
        change_pass: 0,
        user_id: user_info[0]["user_id"]

      },
      success: function(response){
        if(response.success){
          //Close dialog
          $('#myModal').modal('hide');
          //Reload event list
          load_list_users();
        }
      }
    });

  }

}



function delete_user(u){
  var del = confirm("Do you want delete this user?");
    
    if (del == true) {
        
      //Send params to add event
      $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'del_user', 
          user_id: u
        },
        success: function(response){
          if(response.success){
          
            //Reload event list
            load_list_users();

          }
        }
      });

    }

}


////////////////////////////////////SETTINGS/////////////////////////////////////////////

function form_settings(){

      //Get settings information
      $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'get_settings' 
        },
        success: function(response){

          settings = response;

          //Settings form
          var form = '<br>'+
          '<div class="col-lg-3 col-offset-6 centered">'+
          '<form id="form_settings">'+
          '<div id="form_error"></div>'+
          '<div class="row">'+
            '<div class="col-lg-12">'+
              '<div class="form-group">'+
                '<label for="">Logo Image or Text</label><br>'+
                '<input class="" id="chk_image_or_text" type="checkbox" />'+
              '</div>'+
            '</div>'+
            '<div class="col-lg-12">'+
              '<div class="form-group">'+
                '<label for="">Logo Text</label>'+
                '<input type="text" class="validate[required] form-control" id="txt_logo_text" value="'+settings[0]["logo_text"]+'">'+
              '</div>'+
            '</div>'+
            '<div class="col-lg-12">'+
              '<div class="form-group">'+
                '<label for="">Logo Text Color</label>'+
                  '<div class="input-group colorpicker-component colorp demo-auto colorpicker-element">'+
                    '<input type="text" value="'+settings[0]["logo_text_color"]+'" class="validate[required] form-control" id="txt_logo_text_color">'+
                      '<span class="input-group-addon"><i style="background-color: rgb(0, 170, 187);"></i></span>'+
                  '</div>'+
              '</div>'+
            '</div>'+
            '<div id="hd_image">'+
            '<div class="col-lg-12">'+
              '<div class="form-group">'+
                '<label for="">Image</label>'+
                '<input class="form-control" type="file" name="image" accept="image/*" id="upl_image"><div id="logo_image"></div>'+
              '</div>'+
            '</div>'+ 
            '</div>'+ 
            '<div class="col-lg-12">'+ 
              '<div class="form-group">'+
                '<label for="">Background Color</label>'+
                '<div class="input-group colorpicker-component colorp demo-auto colorpicker-element">'+
                    '<input type="text" value="'+settings[0]["bg_color"]+'" class="validate[required] form-control" id="txt_bg_color">'+
                      '<span class="input-group-addon"><i style="background-color: rgb(0, 170, 187);"></i></span>'+
                  '</div>'+
              '</div>'+
            '</div>'+  
            '<div class="col-lg-12">'+
              '<div class="form-group">'+
                '<label for="">Font Color</label>'+
                '<div class="input-group colorpicker-component colorp demo-auto colorpicker-element">'+
                    '<input type="text" value="'+settings[0]["font_color"]+'" class="validate[required] form-control" id="txt_font_color">'+
                      '<span class="input-group-addon"><i style="background-color: rgb(0, 170, 187);"></i></span>'+
                  '</div>'+
              '</div>'+
            '</div>'+ 
            '<div class="col-lg-12">'+
              '<button type="submit" class="btn btn-default">Save</button>'+
            '</div>'
          '</div>'
          '</form></div>';

        //Put form in page
        $("#settings").html(form);
        //Init event form
        show_image_input_event();

        //Init color picker plugins
        $('.colorp').colorpicker();

        //Init Validation Engine
        $("#form_settings").validationEngine();

        //When submit add event
        $("#form_settings").submit(function(event){
          //Prevent Default
          event.preventDefault();
          //Call add event function
          edit_settings();
        });

      }
    });
}


function show_image_input_event(){

  //Verify if image or text to checked
  if(settings[0]["logo_image_or_text"] == 1){
    $('#chk_image_or_text').prop('checked', true);
    $('#logo_image').html('<img src="img/'+settings[0]["logo_url"]+'" height="200"/>');
  }

  //When init tab
  if($("#chk_image_or_text").is(':checked')){
    $("#hd_image").show();
  }else{
    $("#hd_image").hide();
  }

  //When click checkbox
  $("#chk_image_or_text").click(function(){

    if($(this).is(':checked')){
      $("#hd_image").show();
    }else{
      $("#hd_image").hide();
    }

  });


}



function edit_settings2(){
  //Get form status
  var status = $("#form_settings").validationEngine('validate');
  var image_or_text = (($("#chk_image_or_text").is(":checked")) ? 1 : 0);

  if(status == true){
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        dataType : 'JSON',
        data: { 
          action: 'edit_settings', 
          image_or_text: image_or_text,
          image: $("#upl_image").val(),
          bg_color: $("#txt_bg_color").val(),
          font_color: $("#txt_font_color").val()
        },
        success: function(response){
          if(response.success){
            //Reload form setting
            form_settings();
          }
        }
      });

  }

}



function edit_settings(){
  var status = $("#form_settings").validationEngine('validate');
  var image_or_text = (($("#chk_image_or_text").is(":checked")) ? 1 : 0);
  var form = new FormData(); 
  form.append("image", $("#upl_image")[0].files[0]);


  form.append("action", "edit_settings");
  form.append("logo_text", $("#txt_logo_text").val());
  form.append("logo_text_color", $("#txt_logo_text_color").val());
  form.append("image_or_text", image_or_text);
  form.append("image", $("#upl_image").val());
  form.append("bg_color", $("#txt_bg_color").val());
  form.append("font_color", $("#txt_font_color").val());

  if(status == true){
    //Send params to add event
    $.ajax({
        type: "POST",
        url: 'php/actions.php',
        cache: false,
        contentType: false,
        processData: false,
        data: form,
        dataType : 'JSON',
        success: function(response){

          if(response.success){
            //Reload form setting
            form_settings();
            init_appearance();
          }
        }
      });

  }
}
























function filter_search_field_after_create_list(){

	//Dialog title
    $(".modal-title").html('<img src="img/icons/database.png" width="50"> Search Filter');
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