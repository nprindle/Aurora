import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

export default class MainMenuUI {
    static renderMainMenu(): HTMLElement {
        return UI.makeDivContaining([
            UI.makeHeader("Aurora", 1),
            UI.makeDivContaining([
                UI.makeButton("Start", () => GameWindow.startGame())
            ]),
        ], ["main-menu"]);
    } 
}
