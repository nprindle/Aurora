import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import PauseMenu from "../menu/PauseMenu.js";
import TransitionScreen from "../transitionScreen/TransitionScreen.js";
import ProductionScreen from "../ProductionScreen.js";
import ResearchScreen from "../ResearchScreen.js";
import { Page } from "../Page.js";

export default class WorldScreenHeader implements Page {
    readonly html: HTMLElement;

    constructor(private game: Game, private buttonState: "disabled" | "enabled" = "enabled") {
        this.html = UI.makeDivContaining([
            UI.makeButton(
                "Pause Game",
                () => GameWindow.show(new PauseMenu(this.game)),
                [],
                this.buttonState
            ),
            UI.makeButton(
                "Manage Production",
                () => GameWindow.show(new ProductionScreen(this.game)),
                [],
                this.buttonState
            ),
            UI.makeButton(
                "Research Projects",
                () => GameWindow.show(new ResearchScreen(this.game)),
                [],
                this.buttonState
            ),
            UI.makeButton(
                "Next Turn",
                () => {
                    const transitionScreen = new TransitionScreen(this.game);
                    GameWindow.show(transitionScreen);
                    transitionScreen.startLoading();
                },
                [],
                this.buttonState
            ),
        ], ["world-screen-header"]);
        this.refresh();
    }

    refresh(): void {}
}
