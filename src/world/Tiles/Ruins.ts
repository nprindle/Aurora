import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { RuinsTexture } from "../../UI/Images.js";

export default class Ruins extends Tile {
    texture: HTMLImageElement = RuinsTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }


    static readonly tileName: string = "Alien Ruins";
    static readonly tileDescription: string = "Abandoned structure built by a long-dead alien civilization";
    getTileName(): string {
        return Ruins.tileName;
    }
    getTileDescription(): string {
        return Ruins.tileDescription;
    }
}
