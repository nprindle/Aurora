import GridCoordinates from "../world/GridCoordinates";
import Game from "../Game";
import Cost from "../resources/Cost";
import TilePredicate from "../predicates/TilePredicate";
import WorldPredicate from "../predicates/WorldPredicate";
import { NamedTileType } from "../world/Tile";

type tileAction = ((position: GridCoordinates, run: Game) => void);

/* A project that can be performed by on tile
 * e.g., turning a wasteland tile into a habitat, or researching a technology
 */
export default class TileProject {

    constructor(
        readonly title: string,
        readonly projectDescription: string,
        private action: tileAction,
        readonly costs: Cost[],
        readonly completionRequirements: (TilePredicate | WorldPredicate)[],
        readonly visibilityRequirements: (TilePredicate | WorldPredicate)[]
    ) {}

    canDo(position: GridCoordinates, run: Game): boolean {
        return run.inventory.canAfford(this.costs)
            && this.isVisible(position, run)
            && this.completionRequirements.every(requirement => requirement.evaluate(run, position));
    }

    isVisible(position: GridCoordinates, run: Game): boolean {
        return this.visibilityRequirements.every(requirement => requirement.evaluate(run, position));
    }

    doAction(position: GridCoordinates, run: Game): void {
        if (!this.canDo(position, run)) {
            throw `tried to do project ${this.title} without meeting requirements`;
        }
        run.inventory.payCost(this.costs);
        this.action(position, run);
    }
}

export function constructionProject(tile: NamedTileType, costs: Cost[],
    completionRequirements: TilePredicate[], visibilityRequirements: TilePredicate[]): TileProject {
    return new TileProject(
        `Construct ${tile.tileName}`, tile.tileDescription,
        (position: GridCoordinates, game: Game) => game.world.placeTile(new tile(position)),
        costs, completionRequirements, visibilityRequirements);
}
