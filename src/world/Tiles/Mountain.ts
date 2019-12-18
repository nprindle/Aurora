import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";

export default class Mountain extends AbstractTile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [];

    getImgSrc(): string {
        return "assets/tiles/mountain.png";
    }

    getTileName(): string {
        return "Mountains";
    }

    

}