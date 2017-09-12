

$(document).ready(function () {        


    //draw graph
        var rating=[];
        var follower_num=[];
        var unfollower_num=[];
        // remove off aired episode
        for(var i = 0 ; i < episode.length ;i++)
            if(episode[i].off_air == 1)episode.splice(i,1);
        
        rating[0] = [0, 0];
        follower_num[0]=[0, 0];
        unfollower_num[0]=[0, 0];

        for(var i=1; i<=episode.length; i++){
            rating[i] = [episode[i-1].episode, episode[i-1].rating];
            follower_num[i]=[episode[i-1].episode, episode[i-1].follower_num];
            unfollower_num[i]=[episode[i-1].episode, episode[i-1].unfollower_num];
        }
        
        
        var dataset = [
                        {label: "分數",
                        data: rating},
                        
                        {label: "觀看人數",
                        data: follower_num},
                        
                        {label: "棄番人數",
                        data: unfollower_num},
                        
                        ];
        

        
        
        var options = {
            series: {
                lines: { show: true },
                points: {
                    radius: 5,
                    show: true
                }
            },
            xaxis : {
                labelHeight: 30,
                min: 0,
                tickDecimals: 0, 
                minTickSize: 1,
                max: episode.length + 1
            },
            yaxis : {
                labelWidth: 30,
                min: 0,
                tickDecimals: 0,
                minTickSize: 1,
            }
            
        };
        
        var i = 0;
		$.each(dataset, function(key, val) {
			val.color = i;
			++i;
		});

		// insert checkboxes 
		var choiceContainer = $("#choices");
		$.each(dataset, function(key, val) {
			choiceContainer.append("<br/><input type='checkbox' name='" + key +
				"' checked='checked' id='id" + key + "'></input>" +
				"<label for='id" + key + "'>"
				+ val.label + "</label>");
		});
		
		

		choiceContainer.find("input").click(plotAccordingToChoices);

		function plotAccordingToChoices() {

			var data = [];

			choiceContainer.find("input:checked").each(function () {
				var key = $(this).attr("name");
				if (key && dataset[key]) {
					data.push(dataset[key]);
				}
			});

			if (data.length > 0) {
				$.plot("#chart-holder", data, options);
			}
		}
		
		$("<div id='x-axis-label'></div>").text("集數").appendTo($('#chart-body'));
		//$("<div id='y-axis-label'></div>").text("人數").appendTo($('#chart-body'));

        $(window).resize(function() {
            $('#chart').width($(window).width() * 0.85);
            $('#chart-body').width($(window).width() * 0.8);
            $('#chart-holder').width($('#chart-body').width() * 0.8);
            $('#chart-holder').height($('#chart-holder').width() * 0.5);
            //$('#chart-body').height($('#chart-holder').height() * 1.1);
            plotAccordingToChoices();
            
        });
        //resize graph panel
        $(window).trigger('resize');
});

