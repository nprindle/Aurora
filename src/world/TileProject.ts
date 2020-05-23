import GridCoordinates from "../world/GridCoordinates";
import Game from "../Game";
import Cost from "../resources/Cost";
import DescribedTileQuery from "../queries/DescribedTileQuery";
import { TileQuery, queryTile } from "../queries/Queries.js";
import { NamedTileType } from "./Tile";
import World from "./World";

/* A project that can be performed by on tile
 * e.g., turning a wasteland tile into a habitat, or researching a technology
 */
export default class TileProject {

    constructor(
        readonly title: string,
        readonly projectDescription: string,
        protected action: ((position: GridCoordinates, game: Game) => void),
        readonly costs: Cost[],
        readonly completionRequirements: DescribedTileQuery[],
        readonly visibilityRequirements: TileQuery[],
    ) {}

    canDo(position: GridCoordinates, game: Game): boolean {
        return game.inventory.canAfford(this.costs)
            && this.isVisible(position, game)
            && this.completionRequirements.every(requirement => requirement.evaluate(game, position));
    }

    isVisible(position: GridCoordinates, game: Game): boolean {
        return this.visibilityRequirements.every(query => queryTile(query)(game, position));
    }

    doAction(position: GridCoordinates, game: Game): void {
        if (!this.canDo(position, game)) {
            console.warn(`tried to do project ${this.title} without meeting requirements`);
        } else {
            game.inventory.payCost(this.costs);
            this.action(position, game);
        }
    }
}

export function constructionProject(
    world: World,
    tile: NamedTileType,
    costs: Cost[],
    completionRequirements: DescribedTileQuery[],
    visibilityRequirements: TileQuery[]
): TileProject {
    return new TileProject(
        `Construct ${tile.tileName}`, tile.tileDescription,
        (position: GridCoordinates, game: Game) => game.world.placeTile(new tile(world, position)),
        costs, completionRequirements, visibilityRequirements
    );
}
