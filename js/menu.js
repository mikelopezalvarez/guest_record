


function init_menu(e){
	//Menu HTML
	var menu = '<li id="menu_home" class="menu_link" rel="home"><a href="index.html" ><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Home</a></li>' +
            '<li id="menu_events" class="menu_link" rel="events"><a href="events.html"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> Events</a></li>' +
            '<li id="menu_lists" class="menu_link" rel="lists"><a href="lists.html"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Lists</a></li>' +
            '<li id="menu_analytics" class="menu_link" rel="analytics"><a href="#"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span> Analytics</a></li>';
	//Append Menu
	$("#menu").append(menu);
	//Find Selected
	$(".menu_link").each(function() {
		if($(this).attr("rel") == e){
  			$(this).addClass( "active" );
  		}
	});

	right_menu();
} 


function right_menu(){


	var right_menu = '<li><a href="setting.html">Setting</a></li>'+
	'<li role="separator" class="divider"></li>'+
	'<li><a href="" id="btn_logout"><span class="glyphicon glyphicon-off" aria-hidden="true"></span> Log out</a></li>';
	
	$("#right-menu").html(right_menu);
}

