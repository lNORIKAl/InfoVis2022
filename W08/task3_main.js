d3.csv("https://lNORIKAl.github.io/InfoVis2022/W08/task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
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

        let margin = self.config.margin
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${margin.width / 2}, ${margin.height / 2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.x)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.y)])
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis);

        self.pie = d3.pie()
            .value( d => d.value );
        
        self arc = d3.arc()
      		.innerRadius(0)
     		.outerRadius(radius);

    }
    
    update() {
    
        let self = this;
        self.render()
    }
    
    render() {
        let self = this;

        self.chart.selectAll("pie").data(self.pie(data)).enter()
    		.append("path")
   		 	.attr("d", self.arc)
   		 	.attr("fill", 'black')
   		 	.attr("stroke", 'white')
   	    	.style('stroke-width', '2px');
    }
}