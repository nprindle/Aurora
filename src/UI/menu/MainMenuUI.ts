import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

export default class MainMenuUI {
    static renderMainMenu(): HTMLElement {
        const menuDiv = UI.makeDiv(["main-menu"]);
        menuDiv.appendChild(UI.makeHeader("Aurora", 1));
        menuDiv.appendChild(UI.makeOptions([
            ["Start", () => GameWindow.startGame()]
        ]));
        return menuDiv;
    } 
}