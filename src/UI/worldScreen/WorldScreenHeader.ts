import Game from "../../Game.js";
import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

export default class WorldScreenHeader {
    private html: HTMLElement;
    private run: Game;

    constructor(run: Game) {
        this.html = UI.makeDiv(['world-screen-header']);
        this.run = run;
        this.refresh();
    }

    refresh() {
        let quitButton = UI.makeButton("Quit Game", () => {GameWindow.showMainMenu();});
        let transitionButton = UI.makeButton("Next Turn", () => {GameWindow.transitionToNextTurn();});
        let productionScreenButton = UI.makeButton("Manage Production", () => {GameWindow.showProductionScreen()});

        UI.fillHTML(this.html, [
            quitButton,
            productionScreenButton,
            transitionButton,
        ]);
    }

    getHTML(): HTMLElement {
        return this.html;
    }
}
