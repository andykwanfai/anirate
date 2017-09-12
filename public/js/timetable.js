$(document).ready(function() {

	var today = new Date().getDay();
	var $defaultTab = $("#tab li").eq(today).addClass("active");
	$($defaultTab.find('a').attr('href')).siblings().hide();

	$("#tab li").click(function() {
		if($(this).text()!='個人追番表'){
			$(this).addClass("active").siblings(".active").removeClass("active");
			var clickTab = $(this).find('a').attr('href');
			$(clickTab).fadeIn("fast").siblings().hide();
			return false;
		};
	});
});