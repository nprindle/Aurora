import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "../menu/MainMenu.js";
import TransitionScreen from "../transitionScreen/TransitionScreen.js";
import ProductionScreen from "../productionScreen/ProductionScreen.js";
import ResearchScreen from "../researchScreen/ResearchScreen.js";

export default class WorldScreenHeader implements Page {
    readonly html: HTMLElement;
    private run: Game;

    constructor(run: Game) {
        this.html = UI.makeDiv(["world-screen-header"]);
        this.run = run;
        this.refresh();
    }

    refresh(): void {
        const quitButton = UI.makeButton("Quit Game", () => {
            GameWindow.show(new MainMenu());
        });
        const transitionButton = UI.makeButton("Next Turn", () => {
            const transitionScreen = new TransitionScreen(this.run);
            GameWindow.show(transitionScreen);
            transitionScreen.startLoading();
        });
        const productionScreenButton = UI.makeButton("Manage Production", () => {
            GameWindow.show(new ProductionScreen(this.run));
        });
        const researchScreenButton = UI.makeButton("Research Projects", () => {
            GameWindow.show(new ResearchScreen(this.run));
        });

        UI.fillHTML(this.html, [
            quitButton,
            productionScreenButton,
            researchScreenButton,
            transitionButton,
        ]);
    }
}
