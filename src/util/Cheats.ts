import Resource from "../resources/Resource";
import Game from "../Game";
import WorldScreen from "../UI/worldScreen/WorldScreen";

// container for cheat methods for debugging/testing via the browser console
export default class Cheats {

    constructor(
        private currentGame: Game,
        private worldScreen: WorldScreen // we need this to trigger UI updates when cheats change things
        ){}

    addResource(resource: Resource, quanity: number) {
        this.currentGame.inventory.addQuantity(resource, quanity);
        this.worldScreen.refreshComponents();
        console.log(`Added ${quanity} ${resource.name}`);
    }
}