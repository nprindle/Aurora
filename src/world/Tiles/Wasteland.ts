import AbstractTile from "../AbstractTile.js";

export default class Wasteland extends AbstractTile {
    constructor(x: number, y: number) {
        super(x, y);
    }

    getImgSrc(): string {
        return "assets/tiles/wasteland.png";
    }

    getTileName(): string {
        return "Wasteland";
    }
}