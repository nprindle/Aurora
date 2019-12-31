import AbstractTile from "../world/AbstractTile";
import GridCoordinates from "../world/GridCoordinates";
import World from "../world/World";
import Game from "../Game";
import Cost from "../resources/Cost";
import TilePredicate from "../predicates/TilePredicate";

type tileAction = ((position: GridCoordinates, run: Game) => void);

/* A project that can be performed by on tile
 * e.g., turning a wasteland tile into a habitat, or researching a technology
 */
export default class TileProject {

    constructor(
        readonly title: string,
        private action: tileAction,
        readonly costs: Cost[],
        readonly completionRequirements: TilePredicate[]
    ){}

    canDo(position: GridCoordinates, run: Game): boolean {
        return run.inventory.canAfford(this.costs)
            && this.completionRequirements.every(requirement => requirement.evaluate(run, position));
    }

    doAction(position: GridCoordinates, run: Game) {
        if (!this.canDo(position, run)) {
            throw `tried to do project ${this.title} without meeting requirments`;
        }
        run.inventory.payCost(this.costs);
        this.action(position, run);
    }
}
