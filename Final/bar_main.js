const apiBaseUrl = "https://www.land.mlit.go.jp/webland/api/TradeListSearch";
const prefs = [
  "Hokkaido",
  "Aomori",
  "Iwate",
  "Miyagi",
  "Akita",
  "Yamagata",
  "Fukushima",
  "Ibaraki",
  "Tochigi",
  "Gunma",
  "Saitama",
  "Chiba",
  "Tokyo",
  "Kanagawa",
  "Niigata",
  "Toyama",
  "Ishikawa",
  "Fukui",
  "Yamanashi",
  "Nagano",
  "Gifu",
  "Shizuoka",
  "Aichi",
  "Mie",
  "Shiga",
  "Kyoto",
  "Osaka",
  "Hyogo",
  "Nara",
  "Wakayama",
  "Tottori",
  "Shimane",
  "Okayama",
  "Hiroshima",
  "Yamaguchi",
  "Tokushima",
  "Kagawa",
  "Ehime",
  "Kochi",
  "Fukuoka",
  "Saga",
  "Nagasaki",
  "Kumamoto",
  "Oita",
  "Miyazaki",
  "Kagoshima",
  "Okinawa"
]

class BarChart {
  constructor() {
    this.fig = [];
    this.q = new Quarter(2020,3);
    this.area = 28;
    this.isDesc = false;
    this.map = {
      "max": {},
      "Hokkaido": {},
      "Fukushima": {},
      "Yamagata": {},
      "Miyagi": {},
      "Iwate": {},
      "Akita": {},
      "Aomori": {},
      "Tokyo": {},
      "Tochigi": {},
      "Saitama": {},
      "Kanagawa": {},
      "Ibaraki": {},
      "Gunma": {},
      "Chiba": {},
      "Aichi": {},
      "Fukui": {},
      "Ishikawa": {},
      "Gifu": {},
      "Mie": {},
      "Nagano": {},
      "Niigata": {},
      "Shizuoka": {},
      "Toyama": {},
      "Yamanashi": {},
      "Hyogo": {},
      "Kyoto": {},
      "Wakayama": {},
      "Shiga": {},
      "Osaka": {},
      "Nara": {},
      "Hiroshima": {},
      "Shimane": {},
      "Tottori": {},
      "Yamaguchi": {},
      "Okayama": {},
      "Tokushima": {},
      "Kochi": {},
      "Ehime": {},
      "Kagawa": {},
      "Okinawa": {},
      "Kagoshima": {},
      "Miyazaki": {},
      "Kumamoto": {},
      "Oita": {},
      "Fukuoka": {},
      "Saga": {},
      "Nagasaki": {},
    };
  }

  async update() {
    this.q.year    = Number(document.getElementById("qy").value);
    this.q.quarter = Number(document.getElementById("qq").value);

    let res = [];
    let data = {};
    res.push((async () => {
      for(let i=1; i<=47; i++) {
        if (!this.map[prefs[i-1]][this.q.toString()]) {
          const areaId = i >= 1 && i <= 9 ? "0" + i.toString() : i.toString();
          console.log(apiBaseUrl + "?from=" + this.q.toString() + "&to=" + this.q.toString() +"&area=" + areaId)
          const d = await d3.json(apiBaseUrl + "?from=" + this.q.toString() + "&to=" + this.q.toString() +"&area=" + areaId)
          if(d.data !== undefined) {
            data[prefs[i-1]] = d.data.length;
          }
        }
      }
    })());
    await Promise.all(res)
    for(let key in data) {
      this.map[key][this.q.toString()] = data[key];
    }
    this.fig = []
    let tmpMax = 0;
    for(let key in this.map) {
      if(key === "max") continue;
      if(this.map[key][this.q.toString()] > tmpMax) tmpMax = this.map[key][this.q.toString()];
      this.fig.push({ "label": key, "value": this.map[key][this.q.toString()]});
    }
    this.map["max"][this.q.toString()] = tmpMax;
    this.fig.sort((a,b) => { return b.value - a.value; })
    this.makeFig(this.fig)
  }

  makeFig(data) {
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
        .text("都道府県");
          
    // Draw bars
    chart.selectAll("rect").data(data).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yscale(d.label))
        .attr("width", d => xscale(d.value))
        .attr("height", yscale.bandwidth());

    geoSvg.selectAll("path").remove()
    geoSvg.selectAll("path")   //都道府県の領域データをpathで描画
      .data(geoJson.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .style("stroke", "gray")
      .style("stroke-width", 0.25)
      .style("fill", d => getColor(this.map[d.properties.pref][this.q.toString()], this.map["max"][this.q.toString()]));
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

function getColor(i, max) {
  const g = 255 - Math.floor(i*255/max);
  let res = g.toString(16);
  if (res.length == 1) {
    res = "0" + res
  }
  return "#" + res + "ff" + res;
}

const bc = new BarChart();

const width = 512;
let height = 128;
const margin = {top:10, right:10, bottom:20, left:160};

const svg = d3.select('#drawing_region')
    .attr('width', width)
    .attr('height', height);
const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);