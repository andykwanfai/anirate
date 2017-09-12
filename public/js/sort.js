$(document).ready(function () {
    
    $("#sort-hover").hover(
  function () {
     $('#sort-menu').fadeIn(100);
  }, 
  function () {
     $('#sort-menu').fadeOut(100);
  });

  var sorting;
    function sort_asc(a, b){
        return parseFloat($(b).find(sorting).text()) < parseFloat($(a).find(sorting).text()) ? 1 : -1;    
    }
    
    function sort_desc(a, b){
       // console.log($(b).find(sorting).text())
        return parseFloat($(b).find(sorting).text()) > parseFloat($(a).find(sorting).text()) ? 1 : -1;    
    }

    $('#sort-menu li').click(function(){
        $('#sort-hover span').text($(this).text());
        $('#sort-menu').hide();
        switch($(this).text()){
            case '整體評分' :
                $('#stat li').hide();
                $('.overall_rate').parent('li').show();
                sorting='.overall_rate';
                break;
            case '分集評分' :
                $('#stat li').hide();
                $('.avg_epi_rate').parent('li').show();
                sorting='.avg_epi_rate';
                break;
            case '觀看人數':
                $('#stat li').hide();
                $('.followers').parent('li').show();
                sorting='.followers';
                break;
            case '棄番人數':
                $('#stat li').hide();
                $('.unfollowers').parent('li').show();
                sorting='.unfollowers';
                break;
                
        }
        $("#list .item").sort(sort_desc).appendTo('#list');
    });
    
    $('#asc').click(function(){
        $("#list .item").sort(sort_asc).appendTo('#list');
    })

    $('#desc').click(function(){
        $("#list .item").sort(sort_desc).appendTo('#list');
    })

});