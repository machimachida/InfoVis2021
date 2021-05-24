class BarChart {
  constructor (config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
      margin: config.margin || {top:10, right:10, bottom:10, left:10},
      title: config.title || '',
      xlabel: config.xlabel || '',
      ylabel: config.ylabel || '',
      barColor: config.barColor || "steelblue",
      isDesc: false,
    };
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    self.svg = d3.select(self.config.parent)
      .attr('width', self.config.width)
      .attr('height', self.config.height);

    self.chart = self.svg.append('g')
      .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

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
      .attr('transform', `translate(0, ${self.inner_height})`);

    self.yaxis_group = self.chart.append('g');

    const title_space = 10;
    self.svg.append('text')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('x', self.config.width / 2)
      .attr('y', self.config.margin.top - title_space)
      .text( self.config.title );

    const xlabel_space = 40;
    self.svg.append('text')
      .attr('x', self.config.width / 2)
      .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
      .text( self.config.xlabel );

    const ylabel_space = 90;
    self.svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('y', self.config.margin.left - ylabel_space)
      .attr('x', -(self.config.height / 2))
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .text( self.config.ylabel );
  }

  update() {
    let self = this;

    const space = 10;
    const xmin = 0;
    const xmax = d3.max(self.data, d => d.value) + space;
    self.xscale.domain([xmin, xmax]);

    const items = self.data.map(d => d.label);
    self.yscale.domain(items);

    self.render();
  }

  render() {
    let self = this;

    self.chart.selectAll("rect")
        .data(self.data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => self.yscale(d.label))
        .attr("width", d => self.xscale(d.value))
        .attr("height", self.yscale.bandwidth())
        .attr("fill", self.config.barColor);

    self.xaxis_group.call(self.xaxis);
    self.yaxis_group.call(self.yaxis);
  }

  reverse() {
    let self = this;

    this.data = self.data.reverse();
    self.render();
  }

  sort() {
    let self = this;

    if(self.config.isDesc) {
      this.data = self.data.sort((a, b) => { return -b.value+a.value; });
    } else {
      this.data = self.data.sort((a, b) => { return b.value-a.value; });
    }
    this.config.isDesc = !self.config.isDesc
    self.render();
  }
}