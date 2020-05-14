import Tile, { tileTypes } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { ZeroPointPlantTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { stripIndent } from "../../util/Text.js";


export default class ZeroPointPlant extends Tile {
    protected texture: HTMLImageElement = ZeroPointPlantTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        Conversion.newConversion(
            [],
            [new Cost(Resource.Energy, 10000)],
            40,
        ),
    ];

    static readonly tileName: string = "Zero Point Energy Plant";
    static readonly tileDescription: string = stripIndent`
        A power plant that exploits exotic physics and alien science to produce vast amounts
        of ${Resource.Energy.name}.`;

    getTileName(): string {
        return ZeroPointPlant.tileName;
    }
    getTileDescription(): string {
        return ZeroPointPlant.tileDescription;
    }

    static readonly schema = S.classOf({
        position: GridCoordinates.schema,
        resourceConversions: S.arrayOf(Conversion.schema),
    }, ({ position, resourceConversions }) => {
        const s = new ZeroPointPlant(position);
        s.resourceConversions = resourceConversions;
        return s;
    });
}

tileTypes[ZeroPointPlant.name] = ZeroPointPlant;