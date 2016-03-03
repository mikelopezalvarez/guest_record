/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Global Variables List
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var logo_text = 'Your Logo';
var logo_text_color = '#777777';  
var logo_image_or_text = null; 
var logo_image = null;
var bg_color = '#FFFFFF'; 
var font_color = '#333333'; 

var settings = null;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
Init Set Appearance
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function init_appearance(){


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

          set_appearance();

        }
      });


  
}




function set_appearance(){


  var css = {
    color: settings[0]['font_color'],
    backgroundColor:  settings[0]['bg_color']
  }

  //Set fonts
  $("body").css(css);


  if(settings[0]["logo_image_or_text"] == 1){
    //Set Logo Image
    $("#logo_text").html('<img src="img/'+settings[0]["logo_url"]+'" height="130"/>');
  }else{
    //Set Logo Text
    $("#logo_text").text(settings[0]['logo_text']);
  }



}

