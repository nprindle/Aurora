import { Schemas as S } from "@nprindle/augustus";

export default class GridCoordinates {

    constructor(
        readonly x: number,
        readonly y: number
    ) {}

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    distanceFrom(other: GridCoordinates): number {
        return Math.hypot(Math.abs(this.x - other.x), Math.abs(this.y - other.y));
    }

    static readonly schema = S.classOf({
        x: S.aNumber, y: S.aNumber
    }, ({ x, y }) => new GridCoordinates(x, y));
}
