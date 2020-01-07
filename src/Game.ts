import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import Resource from "./resources/Resource.js";
import Tile from "./world/Tile.js";
import { Arrays } from "./util/Arrays.js";
import Conversion from "./resources/Conversion.js";
import WorldGenerationParameters from "./world/WorldGenerationParameters.js";
import Species from "./resources/Species.js";

// Holds the state of one run of the game, including the game world, inventory, and run statistics
export default class Game {
    readonly world: World;
    readonly inventory: Inventory;
    private turnNumber: number = 1;

    constructor() {
        this.world = new World (WorldGenerationParameters.standardWorldParameters());
        this.inventory = new Inventory();
        // TODO set correct starting resources
        this.inventory.addWorkers(Species.human, 100);
        this.inventory.releaseWorkers();
    }

    // returns all available resource conversions in the order in which they will be applied
    getResourceConversions() {
        const allConversions: Conversion[] = Arrays.flatten(this.world.getTiles().map((tile: Tile) => tile.resourceConversions));
        // sort by priority number
        allConversions.sort((a: Conversion, b: Conversion) => (a.priority - b.priority));
        return allConversions;
    }

    // this is called at the end of each turn
    completeTurn() {
        // calculate resource production
        this.inventory.applyConversions(this.getResourceConversions());
        this.inventory.releaseWorkers();
        this.turnNumber++;
    }

    // moves a resource conversion up by 1 in the production order
    increaseConversionPriority(conversion: Conversion) {
        if (conversion.priority == 0) {
            return; // priority #0 is for the free conversions (conversions with no inputs), which should not be moved to any other priority
        }

        const conversionsList = this.getResourceConversions();
        const index = conversionsList.indexOf(conversion);

        if (index == -1) {
            return; // conversion not found in the current world
        }
        else if (index == 0) {
            return; // already first in line
        }

        // swap priority number with the previous conversion
        const conversionAbove = conversionsList[index - 1];

        if (conversionAbove.priority == 0) {
            return; // can't move into priority 0 because only conversions with no inputs should be priority 0
        }
        [conversion.priority, conversionAbove.priority] = [conversionAbove.priority, conversion.priority];
        
    }

    // moves a resource conversion down by 1 in the production order
    decreaseConversionPriority(conversion: Conversion) {
        if (conversion.priority == 0) {
            return; // priority #0 is for the free conversions (conversions with no inputs), which should not be moved to any other priority
        }
        
        const conversionsList = this.getResourceConversions();
        const index = conversionsList.indexOf(conversion);

        if (index == -1) {
            return; // conversion not found in the current world
        }
        else if (index == (conversionsList.length - 1)) {
            return; // already first last in line
        }

        // swap priority number with the next conversion
        const conversionBelow = conversionsList[index + 1];
        [conversion.priority, conversionBelow.priority] = [conversionBelow.priority, conversion.priority];
    }
}
