import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { MiningFacilityTexture } from "../../UI/Images.js";

export default class MiningFacility extends Tile {
    protected texture: HTMLImageElement = MiningFacilityTexture;

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
    static readonly tileDescription: string = "A facility used to process ore into useful materials";
    getTileName(): string {
        return MiningFacility.tileName;
    }
    getTileDescription(): string {
        return MiningFacility.tileDescription;
    }
}
