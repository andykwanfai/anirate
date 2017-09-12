$(document).ready(setTimeout(function () {        
    //tooltip
    $(document).ready(function(){
        $('.tooltip').tooltipster({
        });
        $('#button-chart, .rate-button:eq(0)').tooltipster('show');
            setTimeout(function(){
                $('#button-chart, .rate-button:eq(0)').tooltipster('hide');
            }, 5000);
        });
}, 3000));
