import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";

export default class MiningFacility extends Tile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [];

    resourceConversions = [
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.BuildingMaterials, 100)]
        ),
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.Electronics, 100)]
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
