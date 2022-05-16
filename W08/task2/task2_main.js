d3.csv("https://lNORIKAl.github.io/InfoVis2022/W08/task2/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:50, left:50},
            xticks: 10,
        	yticks: 10,
        };

       let lineChart = new LineChart(config, data);
	   lineChart.update();
	   
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || { top: 10, right: 10, bottom: 50, left: 50 },
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
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

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

        self.area = d3.area()
            .x(d => self.xscale(d.x))
            .y1(d => self.yscale(d.y))
            .y0(d3.max(self.data, d => self.yscale(d.y)) + 5 );
    }
    
    update() {
    
        let self = this;
        self.render()
    }
    
    render() {
        let self = this;

        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'orange')

    }
}

