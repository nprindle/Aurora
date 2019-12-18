import GridCoordinates from "./GridCoordinates.js";
import TileProject from "../tileProjects/TileProject.js";

/**
 * A tile is an object in the world that occupies a map square
 * They can be natural formations (wasteland, mountains, etc),
 * or artificial constructions (habitat, factory, highway, etc)
 */

 export default abstract class AbstractTile {
    position: GridCoordinates;

    // projects that can be completed on tiles of this type
    abstract readonly possibleProjects: TileProject[];

    constructor(position: GridCoordinates) {
        this.position = position;
    }

    abstract getTileName(): string; // user-visible label for the tile type

    abstract getImgSrc(): string; // the path to the map texture for this tile type
 }