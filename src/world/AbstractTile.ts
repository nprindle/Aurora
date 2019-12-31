import GridCoordinates from "./GridCoordinates.js";
import TileProject from "../tileProjects/TileProject.js";
import Conversion from "../resources/Conversion.js";

/**
 * A tile is an object in the world that occupies a map square
 * they can be natural formations (wasteland, mountains, etc),
 * or artificial constructions (habitat, factory, highway, etc)
 */

 export default abstract class AbstractTile {

    // projects that can be completed on tiles of this type
    abstract readonly possibleProjects: TileProject[];

    // conversion from input resources to output resources that the tile can perform at the end of each turn
    abstract resourceConversions: Conversion[];

    constructor(
        public position: GridCoordinates
    ) {}

    abstract getTileName(): string; // returns the name of the tile type

    abstract getImgSrc(): string; // returns the path to the map texture for this tile type
 }
