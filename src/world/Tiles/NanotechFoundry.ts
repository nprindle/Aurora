import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Monolith from "./Monolith.js";
import { NanotechFoundryTexture } from "../../UI/Images.js";

export default class NanotechFoundry extends Tile {
    protected texture: HTMLImageElement = NanotechFoundryTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    static readonly tileName: string = "Nanotech Foundry";
    static readonly tileDescription: string =
        `A nanotechnology manufacturing facility capable of completing the aliens' unfinished ${Monolith.tileName} machine.`;
    getTileName(): string {
        return NanotechFoundry.tileName;
    }
    getTileDescription(): string {
        return NanotechFoundry.tileDescription;
    }
}
