d3.csv("https://lNORIKAl.github.io/InfoVis2022/W06/w06_task1.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256 + 50,
            height: 256 + 50,
            margin: { top:10 , right: 10, bottom: 20, left: 10 },
            chart_margin: { top: 10, right: 10, bottom: 30, left: 40 },
            xticks: 10,
            yticks: 10,
            padrate: 0.2,
            xlabel: "xlabel",
            ylabel: "ylabel",
            title: "title",
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

function padrange(vmin, vmax, rate) {
    var len = vmax - vmin;

    return [vmin - rate * len, vmax + rate * len];
}

class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
             chart_margin: config.chart_margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xticks: config.xticks || 10,
            yticks: config.yticks || 10,
            padrate: config.padrate || 10,
            xlabel: config.xlabel || "",
            ylabel: config.ylabel || "",
            title: config.title || "",
        }
        this.data = data;
        this.init();
    }

   init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        // Chart settings
        var xOffset = self.config.margin.left + self.config.chart_margin.left;
        var yOffset = self.config.margin.top + self.config.chart_margin.top;
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${xOffset}, ${yOffset})`);

        self.inner_width = self.config.width
            - self.config.margin.left - self.config.margin.right
            - self.config.chart_margin.left - self.config.chart_margin.right;
        self.inner_height = self.config.height
            - self.config.margin.top - self.config.margin.bottom
            - self.config.chart_margin.top - self.config.chart_margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(self.config.xticks);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(self.config.yticks)

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        var xOffset = self.config.margin.left;
        var yOffset = self.config.margin.top;
        self.labels = self.svg.append('g')
            .attr('transform', `translate(${xOffset}, ${yOffset})`);
    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        // self.xscale.domain([xmin, xmax]);
        self.xscale.domain(padrange(xmin, xmax, self.config.padrate));

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);
        self.yscale.domain(padrange(ymin, ymax, self.config.padrate));

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r);
        
        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis)
            
                // ylabel
      self.labels.append("text")
            .attr("x", -self.inner_width / 2
                - self.config.margin.top - self.config.chart_margin.top)
            .attr("y", self.config.margin.left)
            .attr("transform", "rotate(-90)")
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.ylabel);

        // xlabel
        self.labels.append("text")
            .attr("x", self.inner_width / 2
                + self.config.margin.left + self.config.chart_margin.left)
            .attr("y", self.inner_height
                + self.config.margin.top + self.config.chart_margin.top
                + self.config.chart_margin.bottom)
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.xlabel);

        //title
        self.labels.append("text")
            .attr("x", self.inner_width / 2
                + self.config.margin.left + self.config.chart_margin.left)
            .attr("y", self.config.margin.top)
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.title);
    }
}