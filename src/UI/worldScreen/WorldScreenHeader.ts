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
        let quitButton = UI.makeButton("Quit Game", () => {this.transition();});

        UI.fillHTML(this.html, [
            quitButton,
        ]);
    }

    private transition() {
        GameWindow.showMainMenu();
    }



    getHTML(): HTMLElement {
        return this.html;
    }
}