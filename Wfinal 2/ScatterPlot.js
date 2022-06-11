class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 500,
            height: config.height || 300,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 185 },
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
        this.data = data;
        this.init();
    }
    
    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        let margin = self.config.margin
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
        
        self.cvalue = d => d.species;
        self.xvalue = d => d.cal;
        self.yvalue = d => d.label;
        
        const xmin = d3.min( self.data, self.xvalue );
        const xmax = d3.max( self.data, self.xvalue );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, self.yvalue );
        const ymax = d3.max( self.data, self.yvalue );
        self.yscale.domain( [ymax, ymin] );

        self.render()
    }

    
    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        const circle_color = 'steelblue';
        const circle_radius = 3;
        circles
            .attr("r", circle_radius )
            .attr("cx", d => self.xscale( self.xvalue(d) ) )
            .attr("cy", d => self.yscale( self.yvalue(d) ) )
            .attr("fill", d => self.config.cscale( self.cvalue(d) ) );
		    
 		self.xaxis_group.call(self.xaxis);

        self.yaxis_group
            .transition().duration(1000)
            .call(self.yaxis);
    }
    
}