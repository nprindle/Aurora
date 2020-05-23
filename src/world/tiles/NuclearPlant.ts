import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { NuclearPlantTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";


@TileType
export default class NuclearPlant extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return NuclearPlantTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.Energy, 1000)],
            15,
        ),
    ];

    static readonly tileName: string = "Nuclear Power Plant";
    static readonly tileDescription: string = "A high-efficiency fission power plant";
    getTileName(): string {
        return NuclearPlant.tileName;
    }
    getTileDescription(): string {
        return NuclearPlant.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: NuclearPlant) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new NuclearPlant(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

