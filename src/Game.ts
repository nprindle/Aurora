import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import Resource from "./resources/Resource.js";
import AbstractTile from "./world/AbstractTile.js";
import Arrays from "./util/Arrays.js";

/* Holds the state of a run of the game, including the game world, inventory, and run statistics
 */
export default class Game {
    readonly world: World;
    readonly inventory: Inventory;
    private turnNumber: number = 1;

    constructor() {
        // TODO pass some sort of `WorldGenerationParameters` object to specify size, terrain frequency, etc
        this.world = new World (20, 20);
        this.inventory = new Inventory();
        // TODO set correct starting resources
        this.inventory.addQuantity(Resource.Colonists, 100);
    }

    // returns all available resource conversions in the order in which they will be applied
    getResourceConversions() {
        // TODO allow player to change production order, since the just going by the order of the tile grid will usually not be optimal
        let allConversions = Arrays.flatten(this.world.getTiles().map((tile: AbstractTile) => tile.resourceConversions));

        return allConversions;
    }

    // this is called at the end of each turn
    completeTurn() {
        // calculate resource production
        this.inventory.applyConversions(this.getResourceConversions());

        console.log(`Finished turn ${this.turnNumber}`)
        this.turnNumber++;
    }
}