import World from "./world/World.js";

/* Holds the state of a run of the game, including the game world, inventory, and run statistics
 */
export default class Game {
    readonly world: World;

    constructor() {
        // TODO pass some sort of `WorldGenerationParameters` object to specify size, terrain frequency, etc
        this.world = new World (20, 20); 
    }
}