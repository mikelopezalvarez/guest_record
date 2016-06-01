/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init List Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_installation(){


  //Init Validation Engine
    $("#form_install").validationEngine();

    //When submit add event
    $("#form_install").submit(function(event){
      //Prevent Default
      event.preventDefault();
      //Call add event function
      login();
    });


}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Load List into Content
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function login(){

  //Get form status
  var status = $("#form_install").validationEngine('validate');

  if(status == true){


    $.ajax({
      type: "POST",
      url: 'php/install.php',
      dataType : 'JSON',
      data: { 
        action: 'install', 
        hostname: $("#txt_host_name").val(),
        database_name: $("#txt_database_name").val(),
        database_username: $("#txt_database_username").val(),
        database_password: $("#txt_database_password").val(),
        fullname: $("#txt_fullname").val(),
        username: $("#txt_username").val(),
        password: $("#txt_password").val()
      },
      success: function(response){

        if(response.success == false){
              
              alert(response.err);

        }else{

              window.location = "index.html";

        }
        
      }
    });
  }

}
