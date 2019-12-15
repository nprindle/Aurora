import AbstractTile from "../AbstractTile.js";

export default class Habitat extends AbstractTile {

    constructor(x: number, y: number) {
        super(x, y);
    }

    getImgSrc(): string {
        return "assets/tiles/habitat.png";
    }

}