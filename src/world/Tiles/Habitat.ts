import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";

export default class Habitat extends AbstractTile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [];

    resourceConversions = [];

    getImgSrc(): string {
        return "assets/tiles/habitat.png";
    }

    static readonly tileName: string = "Habitat Dome"
    getTileName(): string {
        return Habitat.tileName;
    }
}
