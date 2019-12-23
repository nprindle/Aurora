import GridCoordinates from "./GridCoordinates.js";
import TileProject from "../tileProjects/TileProject.js";
import TilePredicate from "../predicates/TilePredicate.js";
import Conversion from "../resources/Conversion.js";

/**
 * A tile is an object in the world that occupies a map square
 * They can be natural formations (wasteland, mountains, etc),
 * or artificial constructions (habitat, factory, highway, etc)
 */

 export default abstract class AbstractTile {
    position: GridCoordinates;

    // projects that can be completed on tiles of this type
    abstract readonly possibleProjects: TileProject[];

    // conversion from input resources to output resources that the tile can perform at the end of each turn
    abstract resourceConversions: Conversion[];

    constructor(position: GridCoordinates) {
        this.position = position;
    }

    // Should return the subclass's tile name. The tileName should
    // optimally be taken from a `static readonly tileName: string` property on
    // the subclass, so it can be used in tile predicates.
    abstract getTileName(): string;

    abstract getImgSrc(): string; // the path to the map texture for this tile type
 }