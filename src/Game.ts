import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import Resource from "./resources/Resource.js";

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

    // this is called at the end of each turn
    completeTurn() {
        console.log(`Finished turn ${this.turnNumber}`)
        this.turnNumber++;

        // TODO calculate resource update
    }
}