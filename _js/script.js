/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
    init();
});

var data = {};
function init()
{
    loadData('_data/data.csv');
    console.log(data);
    drawChart1();
}
function loadData(file)
{
    $.ajax({
        type: 'GET',
        url: file,
        success: function(d) {
            var lines = d.split('\n');
            for (var i = 1, j = lines.length; i < j; i++)
            {
                var line = lines[i].split(',');
                if (line.length > 1)
                {
                    var dept = line[0], monthNum = parseInt(line[1]), month = line[2], actual = parseFloat(line[3]), budget = parseFloat(line[4]);
                    var delta = actual - budget, deltaPercent = Math.round((actual - budget) / budget*1000)/10;
//           console.log(data);
                    if (!data[dept])
                        data[dept] = [];
                    var item = {monthNum: monthNum, month: month, actual: actual, budget: budget, delta: delta, deltaPercent: deltaPercent};
                    data[dept].push(item);
                }
            }

//            console.log(data);

        },
        async: false
    });
}


function drawChart1()
{
    for (var i in data)
    {
        $('#chart1').append("<div id='chart1-" + i + "' class='sub-chart1'></div>");
        var options = {
            chart: {
                renderTo: "chart1-" + i,
//                type: "column",
                plotBackgroundColor: {
                    linearGradient: {x1: 00, y1: 0,
                        x2: 1, y2: 0},
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [.25, 'rgb(255,255,255)'],
                        [.2501, 'rgb(240,240,255)'],
                        [.5, 'rgb(240,240,255)'],
                        [.501, 'rgb(255,255,255)'],
                        [.75, 'rgb(255,255,255)'],
                        [.7501, 'rgb(240,240,255)'],
                    ]
                },
                style: {
                    fontFamily: "Helvetica,Arial,sans-serif"
                }
            },
            legend: {
                borderRadius: 0,
                itemStyle: {
                    color: "#000000",
                    fontFamily: "Helvetica,Arial,sans-serif"
                }
            },
            plotOptions: {
                series: {
                    stacking: "normal"
                }
            },
            series: [],
            title: {
//                text: "Percentage Monthly Under/Over Spending by Department",

                style: {
                    color: "#000000",
                    fontFamily: "Helvetica,Arial,sans-serif",
//                    fontSize: "20px",
                    fontWeight: "bold"
                }
            },
            tooltip: {
                // hints: borderRadius, borderWidth, shadow  
//            borderRadius: "5px",
//            borderWidth: "2px",
                shadow: true,
                style: {
                    color: "#444444",
                    fontFamily: "Helvetica,Arial,sans-serif",
//                    fontSize: "14px",
                    fontWeight: "bold"
                            // hints: color, fontFamily, fontSize, padding
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    style: {
                        color: "#333333",
                        fontFamily: "Helvetica,Arial,sans-serif"
                    }
                }
            },
            yAxis: {
                gridLineColor: "#cccccc",
                gridLineDashStyle: "shortDot",
                // hints: gridLineColor, gridLineDashStyle
                labels: {
                    
                   format: '{value}%',
                    style: {
                        color: "#333333",
                        fontFamily: "Helvetica,Arial,sans-serif"
                    }
                },
                min: -70,
                max: 70,
                title: {
                    style: {display: 'none'}
//                    style: {
//                        color: "#333333",
//                        fontFamily: "Helvetica,Arial,sans-serif"
//                    },
//                    text: "# of Medals"
                }
            }
        };
        options.series[0] = {};
        options.series[0].name = i;
        options.title.text = i;
        options.series[0].data = [];
        options.series[0].stack = 0;
        options.series[0].type = 'column';

        var sum = 0;
        for (var j in data[i])
        {
            var item = data[i][j];
//            console.log(item);
            options.xAxis.categories.push(item['month']);
            sum += item['deltaPercent'];
            options.series[0].data.push(item['deltaPercent']);

        }
        var avg = Math.round(sum / data[i].length*10)/10;
        
        options.series[1] = {};
        options.series[1].name='Year Average';
        options.series[1].data=[];
        options.series[1].type = 'line';
        options.series[1].lineColor = 'rgb(255,64,64)';
        options.series[1].lineWidth = .5;
        options.series[1].marker={enabled:false, states:{hover:{enabled:false}}};
        for(var j = 0, k=data[i].length; j<k;j++)
            options.series[1].data.push(avg);
        
        console.log(options);
        console.log(options.series);
        // finally draw the chart by creating a new "Highcharts" object, which has settings that are defined in "options"
        var chart = new Highcharts.Chart(options);
    }

}