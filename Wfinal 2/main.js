let input_data;
let scatterPlot;
let barChart;
let filter = [];

d3.csv("https://lNORIKAl.github.io/InfoVis2022/Wfinal/data2.csv")
   .then( data => {
       input_data = data;
        input_data.forEach( d => {
            d.label = +d.label;
            d.cal = +d.cal;
        });
        
         const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);
        
        scatterPlot = new ScatterPlot({
       		parent: '#drawing_region_scatterplot',
            width: 400,
            height: 300,
            margin: {top:25, right:10, bottom:80, left:200},
            xlabel: 'Calorie(kcal)',
            ylabel: 'Label',
            cscale: color_scale
       }, input_data);
	   scatterPlot.update();

       barChart = new BarChart({
       		parent: '#drawing_region_barchart',
            width: 450,
            height: 300,
            margin: {top:25, right:10, bottom:80, left:200},
            xlabel: 'Calorie(kcal)',
            ylabel: 'Species',
            cscale: color_scale
       },input_data);
	   barChart.update();
	   
	   
	   
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatterPlot.data = input_data;
    }
    else {
        scatterPlot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatterPlot.update();
}

