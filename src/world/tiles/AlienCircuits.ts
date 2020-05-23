import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { AlienCircuitsTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class AlienCircuits extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return AlienCircuitsTexture;
    }

    static readonly tileName: string = "Hypercomputer Network";
    static readonly tileDescription: string =
    `A self-replicating computing substrate that hosts a virtual reality for uploaded alien minds`;

    getTileName(): string {
        return AlienCircuits.tileName;
    }

    getTileDescription(): string {
        return AlienCircuits.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: AlienCircuits) => ({ position: x.position }),
        (world: World) => ({ position }) => new AlienCircuits(world, position),
    );
}

