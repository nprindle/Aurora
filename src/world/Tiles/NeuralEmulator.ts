import Tile, { tileTypes } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { NeuralEmulatorTexture } from "../../UI/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { stripIndent } from "../../util/Text.js";

export default class NeuralEmulator extends Tile {
    protected texture: HTMLImageElement = NeuralEmulatorTexture;

    constructor(position: GridCoordinates) {
        super(position);
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

    static readonly schema = S.classOf(
        { position: GridCoordinates.schema },
        ({ position }) => new NeuralEmulator(position)
    );
}

tileTypes[NeuralEmulator.name] = NeuralEmulator;
