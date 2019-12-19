import MainMenuUI from "./menu/MainMenuUI.js";
import UI from "./UI.js";
import WorldScreen from "./worldScreen/WorldScreen.js";
import Game from "../Game.js";


export default class GameWindow {

    private static rootDiv: HTMLElement = document.getElementById('rootdiv')!; // find the div that holds all graphical UI (see index.html)
    private static currentRun: Game;

    public static showMainMenu() {
        UI.fillHTML(this.rootDiv, [MainMenuUI.renderMainMenu()]);
    }

    public static startGame() {
        this.currentRun = new Game();
        this.showWorldScreen();
    }

    public static showWorldScreen() {
        let worldScreen = new WorldScreen(this.currentRun);
        UI.fillHTML(this.rootDiv, [worldScreen.getHTML()]);
        
        // Attach keyboard input listener
        document.onkeydown = (e: KeyboardEvent) => {
            worldScreen.handleKeyDown(e);
        };
    }
}