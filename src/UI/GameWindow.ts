import MainMenuUI from "./MainMenuUI.js";
import UI from "./UI.js";
import WorldScreen from "./WorldScreen.js";


export default class GameWindow {

    private static rootDiv: HTMLElement = document.getElementById('rootdiv')!; // find the div that holds all graphical UI (see index.html)


    public static showMainMenu() {
        UI.fillHTML(this.rootDiv, [MainMenuUI.renderMainMenu()]);
    }

    public static showWorldScreen() {
        let worldScreen = new WorldScreen();
        UI.fillHTML(this.rootDiv, [worldScreen.rerenderWorldScreen()]);
        
        // Attach keyboard input listener
        document.onkeydown = (e: KeyboardEvent) => {
            worldScreen.handleKeyDown(e);
        };
    }
}