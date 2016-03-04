/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init List Page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_session(){


  $.ajax({
    type: "POST",
    url: 'php/o.actions.php',
    dataType : 'JSON',
    data: { 
      action: 'get_login'
    },
    success: function(response){

      if(response.success == false){
            
            window.location = "login.html";

      }else{

            $("#login_fullname").text(response.fullname);
            init_logout_event();

      }
      
    }
  });


  


}



function init_logout_event(){


  $("#btn_logout").click(function(){
    //event.preventDefault();

    $.ajax({
      type: "POST",
      url: 'php/o.actions.php',
      dataType : 'JSON',
      data: { 
        action: 'logout'
      },
      success: function(response){

        if(response.success){
              
              window.location = "login.html";

        }
      }
    });

  });
  
}

