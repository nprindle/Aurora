import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { ConstructionFactoryTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class ConstructionFactory extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return ConstructionFactoryTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [new Cost(Resource.Metal, 1000)],
            [new Cost(Resource.BuildingMaterials, 1000)],
            250,
        ),
    ];

    static readonly tileName: string = "Construction Materials Factory";
    static readonly tileDescription: string = `A facility for producing ${Resource.BuildingMaterials.name}`;
    getTileName(): string {
        return ConstructionFactory.tileName;
    }
    getTileDescription(): string {
        return ConstructionFactory.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (rec: ConstructionFactory) => ({
            position: rec.position,
            resourceConversions: rec.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new ConstructionFactory(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

