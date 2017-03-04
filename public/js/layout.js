$(function() {
	//cache DOM elements
	var mainContent = $('#main-content'),
		header = $('#header'),
		sidebar = $('#side-nav'),
		sidebarTrigger = $('#nav-trigger'),
		topNavigation = $('.top-nav'),
		searchForm = $('#sitewide-search');

	//on resize, move search and top nav position according to window width
	var resizing = false;
	moveNavigation();
	$(window).on('resize', function(){
		if( !resizing ) {
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
			resizing = true;
		}
	});

	//on window scrolling - fix sidebar nav
	var scrolling = false;
	checkScrollbarPosition();
	$(window).on('scroll', function(){
		if( !scrolling ) {
			(!window.requestAnimationFrame) ? setTimeout(checkScrollbarPosition, 300) : window.requestAnimationFrame(checkScrollbarPosition);
			scrolling = true;
		}
	});

	//mobile only - open sidebar when user clicks the hamburger menu
	sidebarTrigger.on('click', function(event){
		event.preventDefault();
		$([sidebar, sidebarTrigger]).toggleClass('nav-is-visible');
	});
    
    // highlight search magnifying glass on focus
    var searchInput = searchForm.find('input');

    searchInput.on('input keyup paste', function(event) {
        if($(this).val().length == 0) {
           $('.search-submit').stop().animate({opacity: 0.1},500); 
        } else {
            $('.search-submit').stop().animate({opacity: 1},500);
        }
    });
    searchInput.on('blur', function(event) {
        $('.search-submit').stop().animate({opacity: 0.1},500);
    });
    
    //
    sidebar.find('li').each(function(i){
        var t = $(this);
        setTimeout(function(){
            t.css('opacity',1);
            t.addClass('animated slideInLeft'); 
        }, (i+1) * 100);
    });


//~~~~~~~~~~~ //
// FUNCTIONS //
//~~~~~~~~~~//

function checkMQ() {
    var width = $(window).width();
    if(width <= 768) {
        return 'mobile';
    } else {
        return 'non-mobile'
    }
}

function moveNavigation(){
    var mq = checkMQ();

    if ( mq == 'mobile' && topNavigation.parents('#side-nav').length == 0 ) {
        detachElements();
        topNavigation.appendTo(sidebar);
        searchForm.removeClass('is-hidden').prependTo(sidebar);
    } else if ( ( mq == 'non-mobile') &&  topNavigation.parents('#side-nav').length > 0 ) {
        detachElements();
        searchForm.insertAfter(header.find('.logo'));
        topNavigation.appendTo(header.find('#navbar'));
    }
    resizing = false;
}

function detachElements() {
    topNavigation.detach();
    searchForm.detach();
}

function checkScrollbarPosition() {
    var mq = checkMQ();

    if( mq != 'mobile' ) {
        var sidebarHeight = sidebar.outerHeight(),
            windowHeight = $(window).height(),
            mainContentHeight = mainContent.outerHeight(),
            scrollTop = $(window).scrollTop();

        ( ( scrollTop + windowHeight > sidebarHeight ) && ( mainContentHeight - sidebarHeight != 0 ) ) ? sidebar.addClass('is-fixed').css('bottom', 0) : sidebar.removeClass('is-fixed').attr('style', '');
    }
    scrolling = false;
}
    
});
