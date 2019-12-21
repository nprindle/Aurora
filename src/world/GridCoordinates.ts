// grid coordinates
export default class GridCoordinates {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`
    }

    distanceFrom(other: GridCoordinates): number {
        return Math.hypot(Math.abs(this.x - other.x), Math.abs(this.y - other.y));
    }
}