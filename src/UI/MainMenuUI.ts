import UI from "./UI.js";
import Game from "../Game.js";

export default class MainMenuUI {
    static renderMainMenu(): HTMLElement {
        const menuDiv = UI.makeDiv(["main-menu"]);
        menuDiv.appendChild(UI.makeHeader("Aurora", 1));
        menuDiv.appendChild(UI.makeOptions([
            ["Start", () => Game.startRun()]
        ]));
        return menuDiv;
    } 
}