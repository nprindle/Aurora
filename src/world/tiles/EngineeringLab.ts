import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { EngineeringLabTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";


@TileType
export default class EngineeringLab extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return EngineeringLabTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.EngineeringKnowledge, 5)],
            30,
        ),
    ];

    static readonly tileName: string = "Engineering Lab";
    static readonly tileDescription: string = "A workshop for developing new technology";
    getTileName(): string {
        return EngineeringLab.tileName;
    }
    getTileDescription(): string {
        return EngineeringLab.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: EngineeringLab) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new EngineeringLab(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

