var config = {
  parent: '#drawing_region',
  width: 512,
  height: 256,
  margin: {top:25, right:10, bottom:50, left:100},
  title: 'Sample Data',
  xlabel: 'Value',
  ylabel: 'Label'
};

var bc = new BarChart(config, []);

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W08/data1.csv")
  .then(data => {
    data.forEach(d=>{ d.value = +d.value; });
    bc.data = data;
    bc.update();
  }).catch(error => {
    console.log(error);
  });