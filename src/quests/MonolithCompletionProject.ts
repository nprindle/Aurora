import GridCoordinates from "../world/GridCoordinates";
import Game from "../Game";
import Cost from "../resources/Cost";
import { GameWindow } from "../ui/GameWindow";
import DescribedTileQuery from "../queries/DescribedTileQuery";
import { TileQuery } from "../queries/Queries.js";
import { sleep } from "../util/Util";
import TileProject from "../world/TileProject";
import AlienSeedCore from "../world/tiles/AlienSeedCore";
import HumanSeedCore from "../world/tiles/HumanSeedCore";
import HumanCircuits from "../world/tiles/HumanCircuits";
import AlienCircuits from "../world/tiles/AlienCircuits";
import WorldScreen from "../ui/worldScreen/WorldScreen";
import World from "../world/World";


// special TileProject used to win the game
export class MonolithCompletionProject extends TileProject {
    constructor(
        private world: World,
        readonly title: string,
        readonly projectDescription: string,
        private readonly activeMonolithTile: typeof AlienSeedCore | typeof HumanSeedCore,
        private readonly circuitsTile: typeof AlienCircuits | typeof HumanCircuits,
        readonly costs: Cost[],
        readonly completionRequirements: DescribedTileQuery[],
        readonly visibilityRequirements: TileQuery[],
    ) {
        super(
            title,
            projectDescription,
            () => {},
            costs,
            completionRequirements,
            visibilityRequirements);
    }

    doAction(position: GridCoordinates, game: Game): void {
        if (!this.canDo(position, game)) {
            console.warn(`tried to do project ${this.title} without meeting requirements`);
        } else {
            game.inventory.payCost(this.costs);
            game.world.placeTile(new this.activeMonolithTile(this.world, position));

            // disable "pause game", "next turn", etc. buttons
            GameWindow.show(new WorldScreen(game, "disabled"));

            /* starts the spread of circuit tiles across the map
             * this happens asynchronously with timeouts between each step, so the player can still move around the map
             * and click on tiles while this is happening.
             */
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.endSequence(game, position);
        }
    }

    // the  end of the game shows the "circuits" tiles spreading out from the monolith and consuming the world
    private async endSequence(game: Game, center: GridCoordinates): Promise<void> {



        const world = game.world;

        game.updateQuestState();
        game.inventory.applyPopulationCaps();
        GameWindow.refreshCurrentPage();

        // circuits expansion animation
        let radius = 1;
        let tilesInRadius = [];

        while (tilesInRadius.length < (world.width * world.height)) {
            tilesInRadius = world.getTilesInCircle(center, radius);
            for (const target of tilesInRadius) {
                if (!(target instanceof this.activeMonolithTile) && !(target instanceof this.circuitsTile)) {
                    world.placeTile(new this.circuitsTile(this.world, target.position));
                }
            }

            game.updateQuestState();
            game.inventory.applyPopulationCaps();
            GameWindow.refreshCurrentPage();

            await sleep(100);
            radius = radius * 1.01 + 0.05;
        }

        // once the entire world is consumed, all resources should disappear
        for (const resource of game.inventory.getResourceList()) {

            game.inventory.removeResource(resource, game.inventory.getResourceQuantity(resource));
        }
        GameWindow.refreshCurrentPage();
    }
}
