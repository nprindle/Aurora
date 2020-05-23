import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { NeuralEmulatorTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { stripIndent } from "../../util/Text.js";
import World from "../World.js";

@TileType
export default class NeuralEmulator extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return NeuralEmulatorTexture;
    }

    static readonly tileName: string = "Neural Emulation Platform";
    static readonly tileDescription: string =
    stripIndent`
        A machine capable of interfacing with the alien monolith's hypercomputers and accessing the stored
        alien connectomes`;

    getTileName(): string {
        return NeuralEmulator.tileName;
    }
    getTileDescription(): string {
        return NeuralEmulator.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: NeuralEmulator) => ({ position: x.position }),
        (world: World) => ({ position }) => new NeuralEmulator(world, position),
    );
}

