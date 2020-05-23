import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Conversion from "../../resources/Conversion.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import Species from "../../resources/Species.js";
import { GreenhouseTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class Greenhouse extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return GreenhouseTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world, [new Cost(Resource.Energy, 10)], [new Cost(Resource.Food, 200)], 30
        ),
    ];

    static readonly tileName: string = "Greenhouse";
    static readonly tileDescription: string = `Produces ${Resource.Food.name} for ${Species.Human.name}`;
    getTileName(): string {
        return Greenhouse.tileName;
    }
    getTileDescription(): string {
        return Greenhouse.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: Greenhouse) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new Greenhouse(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

