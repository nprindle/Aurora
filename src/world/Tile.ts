import GridCoordinates from "./GridCoordinates.js";
import TileProject from "../tileProjects/TileProject.js";
import Conversion from "../resources/Conversion.js";
import Species from "../resources/Species.js";
import Housing from "../resources/Housing.js";

/**
 * A tile is an object in the world that occupies a map square
 * they can be natural formations (wasteland, mountains, etc),
 * or artificial constructions (habitat, factory, highway, etc)
 */

 export default abstract class Tile {

    // projects that can be completed on tiles of this type
    readonly possibleProjects: TileProject[] = [];

    // conversion from input resources to output resources that the tile can perform at the end of each turn
    resourceConversions: Conversion[] = [];

    readonly populationCapacity: Housing | undefined = undefined;

    constructor(
        public position: GridCoordinates
    ) {}

    abstract getTileName(): string; // returns the name of the tile type

    abstract getImgSrc(): string; // returns the path to the map texture for this tile type
 }

 /* used by predicates to allow statically accessing the name of a Tile subclass
  * Tile subclasses that are used by pedicates in this way
  * will need to declare a static readonly tileName string
  */
 export type NamedTileType = typeof Tile & { readonly tileName: string };
