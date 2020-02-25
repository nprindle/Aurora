import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { RoadTexture } from "../../UI/Images.js";


export default class Road extends Tile {
    texture: HTMLImageElement = RoadTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    static readonly tileName: string = "Road";
    static readonly tileDescription: string = "Allows transportation of workers and supplies";
    getTileName(): string {
        return Road.tileName;
    }
    getTileDescription(): string {
        return Road.tileDescription;
    }
}
