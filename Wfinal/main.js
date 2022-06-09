d3.csv("https://lNORIKAl.github.io/InfoVis2022/Wfinal/data2.csv")
   .then( data => {
        data.forEach( d => { d.cal = +d.cal;  });

       barChart = new BarChart({
       		parent: '#drawing_region_barchart',
            width: 450,
            height: 300,
            margin: {top:25, right:10, bottom:80, left:200},
            xlabel: 'Calorie(kcal)',
            ylabel: 'Label'
       },data);
	   barChart.update();
	   
	   d3.select('#reverse').on('click', d => { barChart.sort('reverse'); barChart.update(); });
       d3.select('#descend').on('click', d => { barChart.sort('descend'); barChart.update(); });
       d3.select('#ascend').on('click', d => { barChart.sort('ascend'); barChart.update(); });
	   
	   let scatterPlot = new ScatterPlot({
       		parent: '#drawing_region_scatterplot',
            width: 400,
            height: 300,
            margin: {top:25, right:10, bottom:80, left:200},
            xlabel: 'Calorie(kcal)',
            ylabel: 'Label'
       }, data);
	   scatterPlot.update();
	   
    })
    .catch( error => {
        console.log( error );
    });

