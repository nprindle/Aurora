import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { MiningFacilityTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class MiningFacility extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return MiningFacilityTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [new Cost(Resource.Metal, 50)],
            [new Cost(Resource.BuildingMaterials, 50)],
            25,
        ),
        Conversion.newConversion(
            this.world,
            [new Cost(Resource.Metal, 50)],
            [new Cost(Resource.Electronics, 50)],
            25,
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

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: MiningFacility) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new MiningFacility(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

