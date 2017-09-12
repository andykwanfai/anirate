$(document).ready(function(){
    resizer();
    $(window).resize(resizer);
});

var resizer = function(){
    if(window.innerHeight > window.innerWidth){
        $('.trans-panel').css('width','90%');
        $('.panel').hide();
        if($('#panel-reg-success'))
            $('#panel-reg-success').css('left','5%');
    }else{
        $('.trans-panel').css('width','35%');
        $('.panel').show();
        if($('#panel-reg-success'))
            $('#panel-reg-success').css('left','25%');
    }
}