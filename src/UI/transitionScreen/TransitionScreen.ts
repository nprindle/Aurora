import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

// "loading" screen shown between turns
export default class TransitionScreen {
    private html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv();

        UI.fillHTML(this.html, [
            UI.makePara("Loading..."), // TODO animation
        ]);
    }

    getHTML() {
        return this.html;
    }

    revealButton() {
        UI.fillHTML(this.html, [
            UI.makeButton("Continue", this.continueToNextTurn)
        ]);
    }

    private continueToNextTurn() {
        GameWindow.showWorldScreen();
    }
}
