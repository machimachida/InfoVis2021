class LandAPI {
  constructor() {
    this.data = [];
    // for API
    this.apiBaseUrl = "https://www.land.mlit.go.jp/webland/api/TradeListSearch";
    this.from = new Quarter(2020,1);
    this.to   = new Quarter(2020,1);
    this.city = "28102";
  }

  async fetch() {
    await d3.json(this.apiBaseUrl +
      "?from=" + this.from.toString() +
      "&to="   + this.to.toString()   +
      "&city=" + this.city.toString()
    )
  }

  update() {
    this.from.year    = Number(document.getElementById("fy").value);
    this.from.quarter = Number(document.getElementById("fq").value);
    this.to.year      = Number(document.getElementById("ty").value);
    this.to.quarter   = Number(document.getElementById("tq").value);
    this.fetch();
  }
}