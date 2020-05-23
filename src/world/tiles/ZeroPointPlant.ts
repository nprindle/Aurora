import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { ZeroPointPlantTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { stripIndent } from "../../util/Text.js";
import World from "../World.js";


@TileType
export default class ZeroPointPlant extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return ZeroPointPlantTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
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

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: ZeroPointPlant) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new ZeroPointPlant(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

