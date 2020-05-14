import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import PauseMenu from "../menu/PauseMenu.js";
import TransitionScreen from "../transitionScreen/TransitionScreen.js";
import ProductionScreen from "../ProductionScreen.js";
import ResearchScreen from "../ResearchScreen.js";

export default class WorldScreenHeader implements Page {
    readonly html: HTMLElement;

    constructor(private game: Game, private buttonState: "disabled" | "enabled" = "enabled") {
        this.html = UI.makeDiv(["world-screen-header"]);
        this.refresh();
    }

    refresh(): void {
        const quitButton = UI.makeButton("Pause Game", () => {
            GameWindow.show(new PauseMenu(this.game));
        }, [], this.buttonState);
        const transitionButton = UI.makeButton("Next Turn", () => {
            const transitionScreen = new TransitionScreen(this.game);
            GameWindow.show(transitionScreen);
            transitionScreen.startLoading();
        }, [], this.buttonState);
        const productionScreenButton = UI.makeButton("Manage Production", () => {
            GameWindow.show(new ProductionScreen(this.game));
        }, [], this.buttonState);
        const researchScreenButton = UI.makeButton("Research Projects", () => {
            GameWindow.show(new ResearchScreen(this.game));
        }, [], this.buttonState);

        UI.fillHTML(this.html, [
            quitButton,
            productionScreenButton,
            researchScreenButton,
            transitionButton,
        ]);
    }
}
