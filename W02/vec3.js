class Vec3 {
    // Constructor
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sum() {
        return this.x + this.y + this.z
    }

    min() {
        return Math.min(this.x, this.y, this.z)
    }

    mid() {
        const arr = [this.x, this.y, this.z]
        return arr.sort()[1]
    }

    max() {
        return Math.max(this.x, this.y, this.z)
    }
}