import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";
import Wasteland from "./Wasteland.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";

export default class MiningFacility extends AbstractTile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [];

    resourceConversions = [
        new Conversion(
            [new Cost(Resource.Metal, 300)],
            [new Cost(Resource.BuildingMaterials, 150)]
        )
    ];

    getImgSrc(): string {
        return "assets/tiles/mining_facility.png";
    }

    static readonly tileName: string = "Ore Processing Center";  
    getTileName(): string {
        return MiningFacility.tileName;
    }
}