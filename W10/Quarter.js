class Quarter {
  constructor(y, q) {
    this.year    = y;
    this.quarter = q;
  }
  toString() {
    return this.year.toString() + this.quarter.toString();
  }
}