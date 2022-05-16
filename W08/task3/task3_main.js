d3.csv("https://lNORIKAl.github.io/InfoVis2022/W08/task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 128,
        };

       let pieChart = new PieChart(config, data);
	   pieChart.update();
	   
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || 128,
        };
        this.data = data;
        this.init();
    }
    
    init() {
        let self = this;
        console.log(self.data)

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);
            
        self.pie = d3.pie()
            .value( d => d.value );
        
        self.arc = d3.arc()
      		.innerRadius(0)
     		.outerRadius(self.config.radius);
     	
     	self.text = d3.arc()
    		.innerRadius(self.config.radius / 2)
    		.outerRadius(self.config.radius / 2);
    }
    
    update() {

        let self = this;
        self.render()
    }
    
    render() {
        let self = this;

        self.chart.selectAll("pie").data(self.pie(self.data)).enter()
    		.append("path")
   		 	.attr("d", self.arc)
   		 	.attr("fill", 'black')
   		 	.attr("stroke", 'white')
   	    	.style('stroke-width', '2px');
   	    
   	     self.chart.selectAll("pie").data(self.pie(self.data)).enter()
        	.append("text")
        	.attr("fill", 'white')
        	.attr("transform", d => `translate(${self.text.centroid(d)})`)
        	.attr("text-anchor", "middle")
        	.text(d => d.data.label)
        	
    }
    
}