/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init List Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_login(){


  //Init Validation Engine
    $("#form_login").validationEngine();

    //When submit add event
    $("#form_login").submit(function(event){
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

  $.ajax({
    type: "POST",
    url: 'php/o.actions.php',
    dataType : 'JSON',
    data: { 
      action: 'login', 
      username: $("#txt_username").val(),
      password: $("#txt_password").val()
    },
    success: function(response){

      if(response.success == false){
            
            alert("The username or password is incorrect.")

      }else{

            window.location = "index.html";

      }
      
    }
  });

}
