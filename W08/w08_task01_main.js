const apiBaseUrl = "https://www.land.mlit.go.jp/webland/api/TradeListSearch";

class BarChart {
  constructor() {
    this.data = [];
    this.from = new Quarter(2020,1);
    this.to   = new Quarter(2020,3);
    this.city = "28102";
  }

  // とりあえずJSONファイルを読み込んで初期化してみる
  init() {
    d3.json("https://machimachida.github.io/InfoVis2021/W04/w04_task2.json").then(res => {
      if(res.data === undefined) throw new Error("Invalid Format");
      else {
        this.data = parse(res.data);
        makeFig(this.data);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // APIを利用
  update() {
    this.from.year    = Number(document.getElementById("fy").value);
    this.from.quarter = Number(document.getElementById("fq").value);
    this.to.year      = Number(document.getElementById("ty").value);
    this.to.quarter   = Number(document.getElementById("tq").value);

    d3.json(apiBaseUrl + "?from=" + this.from.toString() + "&to=" + this.to.toString() +"&city=" + this.city.toString()).then(res => {
      if(res.data === undefined) throw new Error("Invalid Format");
      else {
        this.data = parse(res.data);
        makeFig(this.data);
        console.log("updated at " + new Date().toString());
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 降順へ整形
  render() {
    this.data.sort((a, b) => { return b.value-a.value; });
    makeFig(this.data);
  }
}

class Quarter {
  constructor(y, q) {
    this.year    = y;
    this.quarter = q;
  }
  toString() {
    return this.year.toString() + this.quarter.toString();
  }
}

function parse(data) {
  let parsed = [];
  let count = {};
  const resData = data.map(obj => obj.CityPlanning);
  for(let i=0; i<resData.length; i++) {
    const el = resData[i];
    count[el] = (count[el] || 0) + 1;
  }
  Object.keys(count).forEach((key) => {
    parsed.push({"label": key, "value": count[key]});
  });
  return parsed;
}

function makeFig(data) {
  height = 28 + data.length * 25;
  svg.style("height", height+50).style("width", width+50);
  svg.select('#drawing_region').attr('height', height);
  chart.selectAll('g').remove();
  chart.selectAll('rect').remove();
  const inner_width = width - margin.left - margin.right;
  const inner_height = height - margin.top - margin.bottom;
      
  // Initialize axis scales
  const xscale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, inner_width]);
      
  const yscale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, inner_height])
      .paddingInner(0.1);
      
  // Initialize axes
  const xaxis = d3.axisBottom(xscale)
      .ticks(5)
      .tickSizeOuter(0);
      
  const yaxis = d3.axisLeft(yscale)
      .tickSizeOuter(0);
      
  // Draw the axis
  const xaxis_group = chart.append('g')
      .attr('transform', `translate(0, ${inner_height})`)
      .call(xaxis)
      .append("text")
      .attr("fill", "black")
      .attr("x", (width - margin.left - margin.right)/2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "10pt")
      .attr("font-weight", "middle")
      .text("件数");

      
  const yaxis_group = chart.append('g')
      .call(yaxis)
      .append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", -(height - margin.top - margin.bottom)/2 - margin.top)
      .attr("y", -150)
      .attr("transform", "rotate(-90)")
      .attr("font-size", "10pt")
      .attr("font-weight", "middle")
      .text("計画");
        
  // Draw bars
  chart.selectAll("rect").data(data).enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => yscale(d.label))
      .attr("width", d => xscale(d.value))
      .attr("height", yscale.bandwidth());
}

const bc = new BarChart();
bc.init();

const width = 512;
let height = 128;
const margin = {top:10, right:10, bottom:20, left:160};

const svg = d3.select('#drawing_region')
    .attr('width', width)
    .attr('height', height);
const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);