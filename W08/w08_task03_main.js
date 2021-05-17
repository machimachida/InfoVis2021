const apiBaseUrl = "https://www.land.mlit.go.jp/webland/api/TradeListSearch";

class PieChart {
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
    this.data.sort((a, b) => {
      if(a.label === "その他")      return b.value;
      else if(b.label === "その他") return -a.value;
      else                          return b.value-a.value
    });
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
  let amount = 0;
  Object.keys(count).forEach((key) => {
    amount += count[key];
    parsed.push({"label": key, "value": count[key]});
  });
  // 数が少ないものを「その他」とする
  const other = {"label": "その他", "value": 0, "color": "gray"};
 // その他の個数計算とグラフの色分け
  for(let i=0; i<parsed.length; i++) {
    if(parsed[i].value <= amount / 8) other.value += parsed[i].value;
    else {
      if(parsed[i].label.indexOf("住") !== -1) {
        parsed[i]["color"] = "orange";
      } else if(parsed[i].label.indexOf("工") !== -1) {
        parsed[i]["color"] = "red";
      } else if(parsed[i].label.indexOf("商") !== -1) {
        parsed[i]["color"] = "cyan";
      } else {
        parsed[i]["color"] = "green";
      }
    }
  };
  const primaries = parsed.filter(el => el.value > amount / 8);
  primaries.push(other);
  return primaries;
}

function makeFig(data) {
  const pie = d3.pie()
        .value( d => d.value )
        .sort(null);

  const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

  var chart = svg.selectAll('pie')
      .data(pie(data))
      .enter();
  chart.append('path')
      .attr('d', arc)
      .attr('fill', d => { return d.data.color; })
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

  chart.append("text")
      .attr("fill", "black")
      .attr("transform", d => { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", "5px")
      .attr("text-anchor", "middle")
      .text(d => { return d.data.label; });
}

const pc = new PieChart();
pc.init();

const width = 512;
const height = 512;
const radius = Math.min( width, height ) / 2;

var svg = d3.select('#drawing_region')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);