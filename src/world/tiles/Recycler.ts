import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { RecyclerTexture1, RecyclerTexture2 } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class Recycler extends Tile {
    private textureVariant: 1 | 2;

    constructor(world: World, position: GridCoordinates, textureVariant: 1 | 2 = 1) {
        super(world, position);
        this.textureVariant = textureVariant;
    }

    resourceConversions = [
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.Cavorite, 200), new Cost(Resource.Energy, 25)],
            300,
        ),
        Conversion.newConversion(
            this.world,
            [],
            [new Cost(Resource.Orichalcum, 200), new Cost(Resource.Energy, 25)],
            300,
        ),
    ];

    static readonly tileName: string = "Alien Ruins Recycler Excavation";
    static readonly tileDescription: string =
        "A facility that harvests and recycles exotic materials from the alien structure.";

    getTileName(): string {
        return Recycler.tileName;
    }
    getTileDescription(): string {
        return Recycler.tileDescription;
    }

    getTexture(): HTMLImageElement {
        switch (this.textureVariant) {
        case 1:
            return RecyclerTexture1;
        case 2:
            return RecyclerTexture2;
        }
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            resourceConversions: S.arrayOf(Conversion.schema),
            textureVariant: S.union(S.literal(1 as const), S.literal(2 as const)),
        }), (recycler: Recycler) => ({
            position: recycler.position,
            resourceConversions: recycler.resourceConversions,
            textureVariant: recycler.textureVariant,
        }), (world: World) => ({ position, textureVariant, resourceConversions }) => {
            const r = new Recycler(world, position, textureVariant);
            r.resourceConversions = resourceConversions;
            return r;
        }
    );
}

