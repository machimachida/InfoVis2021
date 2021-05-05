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
  const margin = {top: 50, right: 10, bottom: 70, left: 70};

  var svg = d3.select("body").append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  var xscale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, width - margin.left - margin.right]);

  var yscale = d3.scaleLinear()
    .domain([d3.max(data, d => d.y), 0])
    .range([0, height - margin.top - margin.bottom]);

  var xaxis = d3.axisBottom(xscale)
    .ticks(20);

  var yaxis = d3.axisLeft(yscale)
    .ticks(12);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
    .call(xaxis)
    .append("text")
    .attr("fill", "black")
    .attr("x", (width - margin.left - margin.right)/2)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "middle")
    .text("X-Label");

  svg.append('g')
    .call(yaxis)
    .append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", -(height - margin.top - margin.bottom)/2 - margin.top)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("font-size", "10pt")
    .attr("font-weight", "middle")
    .text("Y-Label");

  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16pt") 
    .text("W6-Task2");

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xscale(d.x))
    .attr("cy", d => yscale(d.y))
    .attr("r", d => d.r);
};
