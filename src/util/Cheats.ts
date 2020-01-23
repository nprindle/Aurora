import Resource from "../resources/Resource.js";
import Game from "../Game.js";
import WorldScreen from "../UI/worldScreen/WorldScreen.js";
import Species from "../resources/Species.js";

// container for cheat methods for debugging/testing via the browser console
class Cheats {
    constructor(
        private currentGame: Game,
        private worldScreen: WorldScreen // we need this to trigger UI updates when cheats change things
    ){}

    // call this to update game and ui after each cheat's effect
    refresh() {
        this.currentGame.updateQuestState();
        this.worldScreen.refreshComponents();
    }

    addResource(resource: Resource, quantity: number) {
        this.currentGame.inventory.addResource(resource, quantity);
        this.refresh();
    }

    addPopulation(species: Species, quantity: number) {
        this.currentGame.inventory.addWorkers(species, quantity);
        this.refresh();
    }
}

// makes cheat methods available from the console (should be enabled whenever on the world screen)
export function enableCheats(run: Game, worldScreen: WorldScreen) {

    const cheatsObject = new Cheats(run, worldScreen);
    (window as any).cheatsAddResource = (resource: Resource, quantity: number) => cheatsObject.addResource(resource, quantity);
    (window as any).cheatsAddPopulation = (species: Species, quantity: number) => cheatsObject.addPopulation(species, quantity);

    // these classes also need to be made globally accessible so their instances can be used as parameters for cheats
    // unfortunately this makes it possible for players to access and modify or multitons that are supposed to be constant
    (window as any).Resources = Resource;
    (window as any).Species = Species;
}

// removes cheats and associated attributes from global scope
export function disableCheats() {
    (window as any).cheats = undefined;
    (window as any).Resources = undefined;
    (window as any).Species = undefined;
}
