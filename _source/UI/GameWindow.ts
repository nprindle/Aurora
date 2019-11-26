import MainMenuUI from "./MainMenuUI.js";
import UI from "./UI.js";


export default class GameWindow {

    private static rootDiv: HTMLElement = document.getElementById('rootdiv')!; // find the div that holds all graphical UI (see index.html)

    public static ShowMainMenu() {
        UI.fillHTML(this.rootDiv, [MainMenuUI.renderMainMenu()]);
    }
}