import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { MiningFacilityTexture } from "../../UI/Images.js";

export default class MiningFacility extends Tile {
    texture: HTMLImageElement = MiningFacilityTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.BuildingMaterials, 100)],
            60,
        ),
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.Electronics, 100)],
            30,
        )
    ];

    static readonly tileName: string = "Ore Processing Center";
    getTileName(): string {
        return MiningFacility.tileName;
    }
}
