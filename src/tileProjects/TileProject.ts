import AbstractTile from "../world/AbstractTile";
import GridCoordinates from "../world/GridCoordinates";
import World from "../world/World";
import Game from "../Game";
import Cost from "../resources/Cost";
import TilePredicate from "../predicates/TilePredicate";

/* A project that can be performed by on tile
 * e.g., turning a wasteland tile into a habitat, or researching a technology
 */

type tileAction = ((position: GridCoordinates, run: Game) => void);

export default class TileProject {
    readonly title: string;

    private action: (position: GridCoordinates, run: Game) => void;

    readonly costs: Cost[];

    readonly completionRequirements: TilePredicate[];

    constructor(title: string, action: tileAction, costs: Cost[], completionRequirements: TilePredicate[]) {
        this.title = title;
        this.action = action;
        this.costs = costs;
        this.completionRequirements = completionRequirements;
    }

    canDo(position: GridCoordinates, run: Game): boolean {
        
        return run.inventory.canAfford(this.costs)
            && this.completionRequirements.every((req: TilePredicate) => req.evaluate(run, position));
    }

    doAction(position: GridCoordinates, run: Game) {
        if (!this.canDo(position, run)) {
            throw `tried to do project ${this.title} without meeting requirments`;
        }
        run.inventory.payCost(this.costs);
        
        this.action(position, run);
    }


}