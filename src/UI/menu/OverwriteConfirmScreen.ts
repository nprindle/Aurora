import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import { enableCheats } from "../../util/Cheats.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import Game from "../../Game.js";
import MainMenu from "./MainMenu.js";

export default class OverwriteConfirmScreen implements Page {

    readonly html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv(["main-menu", "confirm-menu"]);
        this.refresh();
    }

    refresh(): void {
        // TODO change text is save doesn't exist

        UI.fillHTML(this.html, [
            UI.makeHeader("Overwrite Saved Data?", 1),
            UI.makeDivContaining([
                UI.makeButton("confirm", () => {
                    const newGame = Game.newGame();
                    enableCheats(newGame);
                    GameWindow.show(new WorldScreen(newGame));
                }),
                UI.makeButton("cancel", () => GameWindow.show(new MainMenu)),
            ], ["main-menu-options"]),
        ]);
    }
}
