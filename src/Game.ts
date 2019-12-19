import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import { Resource } from "./resources/Resource.js";

/* Holds the state of a run of the game, including the game world, inventory, and run statistics
 */
export default class Game {
    readonly world: World;
    readonly inventory: Inventory;

    constructor() {
        // TODO pass some sort of `WorldGenerationParameters` object to specify size, terrain frequency, etc
        this.world = new World (20, 20);
        this.inventory = new Inventory();
        // TODO set correct starting resources
        this.inventory.add(Resource.colonists, 100);
    }
}