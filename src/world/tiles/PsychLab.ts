import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { PsychLabTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";


@TileType
export default class PsychLab extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return PsychLabTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.PsychKnowledge, 10)],
            25,
        ),
    ];

    static readonly tileName: string = "Psychology Lab";
    static readonly tileDescription: string =
        "A laboratory for studying how humans behave in the isolated conditions of a remote colony";

    getTileName(): string {
        return PsychLab.tileName;
    }
    getTileDescription(): string {
        return PsychLab.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: PsychLab) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new PsychLab(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

