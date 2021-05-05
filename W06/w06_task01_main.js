d3.csv("https://machimachida.github.io/InfoVis2021/W04/data.csv")
  .then(data => {
    data.forEach(d => { d.x = +d.x; d.y = +d.y; });
    ShowScatterPlot(data);
  })
  .catch(error => {
    console.log(error);
  });

function ShowScatterPlot(data) {
  const width = 256*2;
  const height = 256*2;
  const margin = {top: 10, right: 10, bottom: 30, left: 30};
  const axisMargin = {x: 20, y: 20};

  var svg = d3.select("body").append("svg")
    .attr('width', width+axisMargin.x)
    .attr('height', height+axisMargin.y)
    .append('g')
    .attr('transform', `translate(${margin.left+axisMargin.x}, ${margin.top})`);

  var xscale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([0, width - margin.left - margin.right]);

  var yscale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([0, height - margin.top - margin.bottom]);

  var xaxis = d3.axisBottom(xscale)
    .ticks(12);

  var yaxis = d3.axisLeft(yscale)
    .ticks(12);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.top - margin.bottom + axisMargin.x})`)
    .call(xaxis);

  svg.append('g')
    .attr('transform', `translate(${-axisMargin.y}, 0)`)
    .call(yaxis);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xscale(d.x))
    .attr("cy", d => yscale(d.y))
    .attr("r", d => d.r);
};
