define(['jquery','core/theme-app','core/lib/storage','core/theme-tpl-tags','theme/js/jquery.velocity.min'],function($,App,Storage,TplTags){

	/* App Events */

	App.on('refresh:start',function(){
		$("#refresh-button").removeClass("refresh-off").addClass("refresh-on");
	});

	App.on('refresh:end',function(result){

		scrollTop();
        Storage.clear('scroll-pos'); 
		
		$("#refresh-button").removeClass("refresh-on").addClass("refresh-off");
		
		$("#menu li").removeClass("menu-active-item");
		$("#menu li:first-child").addClass("menu-active-item");
		
		if ( result.ok ) {
			showMessage("Content updated successfully :)");
		}else{
			showMessage(result.message);
		}

	});

	App.on('error',function(error){
		showMessage(error.message);
	});

	App.on('screen:showed',function(current_screen,view){

//		scrollTop();

		if (TplTags.displayBackButton()) {
			$("#back-button").css("display","block");
			$("#menu-button").css("display","none");
		} else {
			$("#back-button").css("display","none");
			$("#menu-button").css("display","block");
		}

		if (isMenuOpen) {

			$("#content").css("left","85%");
			closeMenu();
		}

		if (current_screen.screen_type=="single") {
			cleanImgTag();
            $("#container").on("click",".single-template a",openInBrowser);
		}

		if( current_screen.screen_type == "list" ){
			var pos = Storage.get("scroll-pos",current_screen.fragment);
			if( pos !== null ){
				$("#content").scrollTop(pos);
			}else{
				scrollTop();
			}
		}else{
			scrollTop();
		}
        
	});

	App.on('screen:leave',function(current_screen,queried_screen,view){
		//current_screen.screen_type can be 'list','single','page','comments'
		if( current_screen.screen_type == "list" ){
			Storage.set("scroll-pos",current_screen.fragment,$("#content").scrollTop());
		}
	});
    
    //PhoneGap Plugins Support
    
     try {
        StatusBar.overlaysWebView(false);
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString("#F8F8F8");
    } catch(e) {
        alert("StatusBar plugin not available");
        // https://build.phonegap.com/plugins/715
    }

	/* UI Events */
    
	var isMenuOpen = false;

	$("#container").on("touchstart","#menu-button",menuButtonTapOn);
	$("#container").on("touchend","#menu-button",menuButtonTapOff);

	$("#container").on("touchstart","#refresh-button",refreshTapOn);
	$("#container").on("touchend","#refresh-button",refreshTapOff);

	$("#container").on("click","#menu li a",menuItemTap);
	$("#container").on("click","#content .content-item a",contentItemTap);

	$("#container").on("touchstart","#back-button",backButtonTapOn);
    $("#container").on("touchend","#back-button",backButtonTapOff);

    /* Functions */

	function scrollTop(){
		window.scrollTo(0,0);
	}
    
	function openMenu() {

		$("#menu").css("display","block");

        $("#content,#header").velocity({
			left:"85%",
			},300, function() {
				isMenuOpen=true;
			});
	}

	function closeMenu(action,menuItem) {

		isMenuOpen = false;

        $("#content,#header").velocity({
			left:"0",
		},300, function() {

				$("#menu").css("display","none");

				if (action==1) {
					App.navigate(menuItem.attr("href"));
				}

			});
	}

	function toggleMenu() {

		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	function menuButtonTapOn() {
		$("#menu-button").removeClass("button-tap-off").addClass("button-tap-on");
	}

	function menuButtonTapOff() {

		$("#menu-button").removeClass("button-tap-on").addClass("button-tap-off");
		toggleMenu();
		return false;

	}

	function menuItemTap() {	

		if (isMenuOpen) {

			$("#menu li").removeClass("menu-active-item");
			$(this).closest("li").addClass("menu-active-item");

			closeMenu(1,$(this));
		}

		return false;
	}

	function contentItemTap() {

		if (!isMenuOpen) {
			App.navigate($(this).attr("href"));
		} else {
			closeMenu();
		}
		return false;
	}

	function showMessage(msgText) {
		$("#refresh-message").html(msgText);
		$("#refresh-message").removeClass("message-off").addClass("message-on");
		setTimeout(hideMessage,3000);
	}

	function hideMessage() {
		$("#refresh-message").removeClass("message-on").addClass("message-off");	
		$("#refresh-message").html("");
	}

	function refreshTapOn() {
		$("#refresh-button").removeClass("button-touch-off").addClass("button-touch-on");
	}

	function refreshTapOff() {
		if (!App.isRefreshing()) {
			$("#refresh-button").removeClass("button-touch-on").addClass("button-touch-off");
			$("#refresh-button").removeClass("refresh-off").addClass("refresh-on");
			App.refresh();
		}
	}

	function stopRefresh() {
		$("#refresh-button").removeClass("refresh-on").addClass("refresh-off");	
	}

	function backButtonTapOn() {
		$("#back-button").removeClass("button-tap-off").addClass("button-tap-on");
	}

	function backButtonTapOff() {
		$("#back-button").removeClass("button-tap-on").addClass("button-tap-off");
		App.navigate(TplTags.getPreviousScreenLink());
	}

	function scrollTop(){
		window.scrollTo(0,0);
	}

	function cleanImgTag() {

		$(".single-template img").removeAttr("width height");
		$(".single-template .wp-caption").removeAttr("style");
		$(".single-template .wp-caption a").removeAttr("href");

	}
    
    function openInBrowser(e) {
        window.open(e.target.href,"_blank","location=yes");
        e.preventDefault();
    }

});