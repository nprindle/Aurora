import UI from "./UI.js";

export default class MainMenuUI {
    static renderMainMenu(): HTMLElement {
        const menuDiv = UI.makeDiv([]); //TODO apply CSS
        menuDiv.appendChild(UI.makeHeader("Aurora", [], 1));
        menuDiv.appendChild(UI.makePara("Welcome to Aurora!", []));
        return menuDiv;
    } 
}