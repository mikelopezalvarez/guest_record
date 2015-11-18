


function init_menu(e){
	//Menu HTML
	var menu = '<li id="menu_home" class="menu_link" rel="home"><a href="index.html" >Home</a></li>' +
            '<li id="menu_events" class="menu_link" rel="events"><a href="events.html">Events</a></li>' +
            '<li id="menu_lists" class="menu_link" rel="lists"><a href="lists.html">Lists</a></li>' +
            '<li id="menu_analytics" class="menu_link" rel="analytics"><a href="#">Analytics</a></li>' +
            '<li id="menu_setting" class="menu_link" rel="setting"><a href="setting.html">Setting</a></li>' +
            '<li id="menu_logout" class="menu_link" rel="logout"><a href="#">Log out</a></li>';
	//Append Menu
	$("#menu").append(menu);
	//Find Selected
	$(".menu_link").each(function() {
		if($(this).attr("rel") == e){
  			$(this).addClass( "active" );
  		}
	});
} 