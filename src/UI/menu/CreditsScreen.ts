import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

export default class CreditsScreen {
    static render(): HTMLElement {
        return UI.makeDivContaining([
            UI.makeHeader("Credits", 1),
            UI.makeDivContaining([
                UI.makeButton("Back", () => GameWindow.showMainMenu())
            ]),
        ], []);
    } 
}
