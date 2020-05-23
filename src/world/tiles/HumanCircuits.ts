import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { HumanCircuitsTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class HumanCircuits extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return HumanCircuitsTexture;
    }

    static readonly tileName: string = "Hypercomputer Network";
    static readonly tileDescription: string =
    `A self-replicating computing substrate hosting a utopian virtual reality for uploaded human minds`;

    getTileName(): string {
        return HumanCircuits.tileName;
    }

    getTileDescription(): string {
        return HumanCircuits.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: HumanCircuits) => ({ position: x.position }),
        (world: World) => ({ position }) => new HumanCircuits(world, position)
    );
}

