var data = [
    {x:20,y:20,r:10, color: "red"},
    {x:100,y:50,r:10, color: "blue"},
    {x:70,y:80,r:10, color: "green"},
    {x:170,y:30,r:10, color: "brown"},
    {x:150,y:70,r:10, color: "black"}];

var svg = d3.select('#drawing_region');

let circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle');

circles
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr("fill", d => d.color);

circles
    .on('mouseover', (e,d) => {
        d3.select('#tooltip')
            .style('opacity', 1)
            .html(`<div class="tooltip-label">Attributes</div>
            x: ${d.x}<br>
            y: ${d.y}<br>
            r: ${d.r}<br>
            color: ${d.color}
            `);
    })
    .on('mousemove', (e) => {
        const padding = 10;
        d3.select('#tooltip')
            .style('left', (e.pageX + padding) + 'px')
            .style('top', (e.pageY + padding) + 'px');
    })
    .on('mouseleave', () => {
        d3.select('#tooltip')
            .style('opacity', 0);
    });
