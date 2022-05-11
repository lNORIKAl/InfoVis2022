d3.csv("https://lNORIKAl.github.io/InfoVis2022/W08/w08_task1.csv")
    .then( data => {
        data.forEach( d => { d.label = +d.label; d.value = +d.value; });

        var config = {
        	parent: '#drawing_region',
        	width = 256,
        	height = 128,
        	margin = {top:10, right:10, bottom:20, left:60}
        };
        
        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

	constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin ||{top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }
    
    int() {
    	let self = this;
    	
    	self.svg = d3.select( self.config.parent )
    		.attr('width' , self.config.width)
    		.attr('height' , self.config.height);
    		
    	self.chart = self.svg.append('g')
    		.attr('transform', `translate(${margin.left}, ${margin.top})`);
    	
    	self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
    	self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    	
    	self.xscale = d3.scaleLinear()
    		.domain([0, d3.max(data, d => d.value)])
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
        	.domain(data.map(d => d.label))
            .range( [0, self.inner_height] );
            .paddingInner(0.1);
        
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5);
      		.tickSizeOuter(0);
      		
      	self.yaxis = d3.axisBottom( self.yscale )
      		.tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
    }
    
    update() {
        let self = this;

        const ymin = d3.min(self.data, d => d.value);
        const ymax = d3.max(self.data, d => d.value);
        self.yscale.domain(padrange(ymin, ymax, self.config.padrate));

        self.render();
    }
    
     render() {
        let self = this;

        self.chart.selectAll("rect").data(self.data).enter()
    		.append("rect")
   		 	.attr("x", 0)
   		 	.attr("y", d => self.yscale(d.label))
   		 	.attr("width", d => self.xscale(d.value))
   		 	.attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis)
    }
