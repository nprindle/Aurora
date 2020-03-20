import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { ZeroPointPlantTexture } from "../../UI/Images.js";


export default class ZeroPointPlant extends Tile {
    protected texture: HTMLImageElement = ZeroPointPlantTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        new Conversion(
            [],
            [new Cost(Resource.Energy, 10000)],
            40,
        ),
    ];

    static readonly tileName: string = "Zero Point Energy Plant";
    static readonly tileDescription: string =
        `A power plant that exploits exotic physics and alien science to produce vast amounts of ${Resource.Energy.name}.`;

    getTileName(): string {
        return ZeroPointPlant.tileName;
    }
    getTileDescription(): string {
        return ZeroPointPlant.tileDescription;
    }
}
