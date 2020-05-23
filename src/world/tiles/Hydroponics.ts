import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Conversion from "../../resources/Conversion.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import Species from "../../resources/Species.js";
import { HydroponicsTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class Hydroponics extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return HydroponicsTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world, [new Cost(Resource.Energy, 150)], [new Cost(Resource.Food, 2000)], 50
        ),
    ];

    static readonly tileName: string = "Hydroponics Greenhouse";
    static readonly tileDescription: string =
        `Produces ${Resource.Food.name} for ${Species.Human.name} more efficiently than a standard greenhouse`;
    getTileName(): string {
        return Hydroponics.tileName;
    }
    getTileDescription(): string {
        return Hydroponics.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: Hydroponics) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new Hydroponics(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

