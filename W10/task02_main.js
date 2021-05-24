var svg = d3.select('#drawing_region');
d3.csv("https://machimachida.github.io/InfoVis2021/W10/data.csv").then(data => {

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
    });