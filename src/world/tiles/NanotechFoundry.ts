import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { NanotechFoundryTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class NanotechFoundry extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return NanotechFoundryTexture;
    }

    static readonly tileName: string = "Nanotech Foundry";
    static readonly tileDescription: string =
        `A nanotechnology manufacturing facility capable of completing the unfinished alien Monolith device`;
    getTileName(): string {
        return NanotechFoundry.tileName;
    }
    getTileDescription(): string {
        return NanotechFoundry.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: NanotechFoundry) => ({ position: x.position }),
        (world: World) => ({ position }) => new NanotechFoundry(world, position)
    );
}

