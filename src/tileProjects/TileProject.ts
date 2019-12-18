import AbstractTile from "../world/AbstractTile";
import GridCoordinates from "../world/GridCoordinates";
import World from "../world/World";

/* A project that can be performed by on tile
 * e.g., turning a wasteland tile into a habitat, or researching a technology
 */

export default class TileProject {
    readonly title: string;

    action: (position: GridCoordinates, world: World) => void;

    constructor(title: string, action: ((position: GridCoordinates, world: World) => void)) {
        this.title = title;
        this.action = action;
    }


}