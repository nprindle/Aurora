import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { AlignmentLabTexture } from "../../ui/Images.js";
import { stripIndent } from "../../util/Text.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class AlignmentLab extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return AlignmentLabTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.AlignmentKnowledge, 10)],
            100,
        ),
    ];

    static readonly tileName: string = "AI Alignment Lab";
    static readonly tileDescription: string = stripIndent`
        A research center for developing techniques that could allow humans to control an
        artificial intelligence or modify its goal programming`;
    getTileName(): string {
        return AlignmentLab.tileName;
    }
    getTileDescription(): string {
        return AlignmentLab.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: AlignmentLab) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new AlignmentLab(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

