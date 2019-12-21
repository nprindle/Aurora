import GridCoordinates from "./GridCoordinates.js";
import TileProject from "../tileProjects/TileProject.js";
import TilePredicate from "../predicates/TilePredicate.js";

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

    //overload this with a user-visible name for each specific tile subclass
    static readonly tileName: string = "If you're seeing this you forgot to overrid the tile name"; 

    abstract getTileName(): string; // should return the subclass's overload of tileName

    abstract getImgSrc(): string; // the path to the map texture for this tile type
 }