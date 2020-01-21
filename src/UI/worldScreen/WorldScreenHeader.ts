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
        const quitButton = UI.makeButton("Quit Game", () => {GameWindow.showMainMenu();});
        const transitionButton = UI.makeButton("Next Turn", () => {GameWindow.transitionToNextTurn();});
        const productionScreenButton = UI.makeButton("Manage Production", () => {GameWindow.showProductionScreen()});
        const questDescription = UI.makePara(`Objective: ${this.run.getCurrentQuestText()}`);

        UI.fillHTML(this.html, [
            quitButton,
            questDescription,
            productionScreenButton,
            transitionButton,
        ]);
    }

    getHTML(): HTMLElement {
        return this.html;
    }
}
