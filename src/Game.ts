import GameWindow from "./UI/GameWindow.js";
import World from "./world/World.js";

export default class Game {
    
    static world: World = new World(5, 5);

    static startRun() {

        this.world = new World(5, 5);

        GameWindow.showWorldScreen();
    }
}