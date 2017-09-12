var url = 'https://demo-project-qqwq.c9.io/search/animeauto/';
var url_cv = "https://demo-project-qqwq.c9.io/search/cvauto/";
var url_staff = "https://demo-project-qqwq.c9.io/search/staffauto/";
$(document).ready(function(){
   // alert("test");
$('input.typeahead').typeahead({
name: 'typeahead',
remote: {
        url: url,
        
        replace: function () {
            var q = url;
            //if($())
            if ($('.typeahead').val()) {
                q += encodeURIComponent($('.typeahead').val());
               
            }
            return q;
        }
    }
});});