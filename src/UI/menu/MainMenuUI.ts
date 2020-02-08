import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";

// this may need to become a real class in the future
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MainMenuUI {
    static renderMainMenu(): HTMLElement {
        return UI.makeDivContaining([
            UI.makeHeader("Aurora", 1),
            UI.makeDivContaining([
                UI.makeButton("start_game", () => GameWindow.startGame()),
                UI.makeButton("display_credits", () => GameWindow.showCredits()),
            ], ["main-menu-options"]),
        ], ["main-menu"]);
    }
}
