class LineChart {
  constructor() {
    this.data = [
      {x:0, y:100},
      {x:40, y:5},
      {x:120, y:80},
      {x:150, y:30},
      {x:200, y:50}
    ];
    this.drawing = false;
    this.svg = null;
    this.xscale = null;
    this.yscale = null;
  }

  init() {
    this.makeFig(this.data);
  }

  update() {
    this.data.push({
      x: Number(document.getElementById("x").value),
      y: Number(document.getElementById("y").value)
    });
    this.data.sort((a, b) => { return b.x-a.x; });
    this.makeFig(this.data);
  }

  makeFig() {
    const width = 1024;
    const height = 128*4;
    const margin = {top:10, right:10, bottom:60, left:60};

    this.svg = d3.select('#line_region')
        .attr('width', width)
        .attr('height', height);
    this.svg.selectAll('g').remove();

    this.svg = this.svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.xscale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.x)])
      .range([0, width - margin.left - margin.right]);

    this.yscale = d3.scaleLinear()
      .domain([d3.max(this.data, d => d.y), 0])
      .range([0, height - margin.top - margin.bottom]);

    const xaxis = d3.axisBottom(this.xscale)
      .ticks(12);

    var yaxis = d3.axisLeft(this.yscale)
      .ticks(12);

    this.svg.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(xaxis)
      .append("text")
      .attr("fill", "black")
      .attr("x", (width - margin.left - margin.right)/2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "10pt")
      .attr("font-weight", "middle")
      .text("四半期");

    this.svg.append('g')
      .call(yaxis)
      .append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", -(height - margin.top - margin.bottom)/2 - margin.top)
      .attr("y", -35)
      .attr("transform", "rotate(-90)")
      .attr("font-size", "10pt")
      .attr("font-weight", "middle")
      .text("土地取引数");

    const line = d3.line()
          .x( d => this.xscale(d.x) )
          .y( d => this.yscale(d.y) );

    this.svg.append('path')
        .attr('d', line(this.data))
        .attr('stroke', 'black')
        .attr('fill', 'none');

    // 頂点
    this.svg.selectAll('c').data(this.data).enter().append("circle")
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', 5);

  }
}

const lc = new LineChart();
lc.init();