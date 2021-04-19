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
        return this.x + this.y + this.z;
    }

    min() {
        return Math.min(this.x, this.y, this.z);
    }

    mid() {
        if(this.x >= this.y) {
            if(this.y >= this.z) {
                return this.y;
            } else if(this.x <= this.z) {
                return this.x;
            } else {
                return this.z;
            }
        } else if(this.x > this.z) {
            return this.x;
        } else if(this.y > this.z) {
            return this.z;
        } else {
            return this.y;
        }
    }

    max() {
        return Math.max(this.x, this.y, this.z);
    }
}