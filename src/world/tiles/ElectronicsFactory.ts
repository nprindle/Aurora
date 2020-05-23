import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { ElectronicsFactoryTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class ElectronicsFactory extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return ElectronicsFactoryTexture;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [new Cost(Resource.Metal, 500)],
            [new Cost(Resource.Electronics, 500)],
            100,
        )
    ];

    static readonly tileName: string = "Electronics Factory";
    static readonly tileDescription: string = `A facility for producing ${Resource.Electronics.name}`;
    getTileName(): string {
        return ElectronicsFactory.tileName;
    }
    getTileDescription(): string {
        return ElectronicsFactory.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
        }),
        (x: ElectronicsFactory) => ({
            position: x.position,
            resourceConversions: x.resourceConversions,
        }),
        (world: World) => ({ position, resourceConversions }) => {
            const s = new ElectronicsFactory(world, position);
            s.resourceConversions = resourceConversions;
            return s;
        }
    );
}

