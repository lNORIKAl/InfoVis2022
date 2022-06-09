class BarChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 500,
            height: config.height || 300,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 185 },
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        };
        this.data = data;
        this.init();
    }
    
    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        let margin = self.config.margin
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.2)
            .paddingOuter(0.1);
            
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis_group = self.chart.append('g')
        
        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 200;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }
    
    update() {
        let self = this;
        
        const space = 10;
        const xmin = 0;
        const xmax = d3.max(self.data, d => d.cal) + space;
        self.xscale.domain([xmin, xmax]);

        const items = self.data.map(d => d.label);
        self.yscale.domain(items);

        self.render()
    }

    
    render() {
        let self = this;

        self.chart.selectAll("rect")
        	.data(self.data)
    		.join("rect")
    		.transition().duration(1000)
            .attr("x", 0)
		    .attr("y", d => self.yscale(d.label))
		    .attr("width", d => self.xscale(d.cal))
		    .attr("height", self.yscale.bandwidth());
		    
		self.xaxis_group.call(self.xaxis);

        self.yaxis_group
            .transition().duration(1000)
            .call(self.yaxis);
    }
    
    sort( order ) {
        let self = this;

        switch (order) {
        case 'reverse':
            self.data.reverse();
            break;
        case 'descend':
            self.data.sort( (a,b) => b.cal - a.cal );
            break;
        case 'ascend':
            self.data.sort( (a,b) => a.cal - b.cal );
            break;
        }
    }
}