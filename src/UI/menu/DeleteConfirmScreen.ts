import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "./MainMenu.js";
import SettingsScreen from "./SettingsScreen.js";
import { GameSave } from "../../persistence/GameSave.js";

export default class DeleteConfirmScreen implements Page {

    readonly html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv(["main-menu", "confirm-menu"]);
        this.refresh();
    }

    refresh(): void {
        // TODO change text is save doesn't exist

        UI.fillHTML(this.html, [
            UI.makeHeader("Delete Saved Data?", 1),
            UI.makeDivContaining([
                UI.makeButton("confirm", () => {
                    GameSave.clearProgress();
                    GameWindow.show(new SettingsScreen(new MainMenu()));
                }),
                UI.makeButton("cancel", () => GameWindow.show(new SettingsScreen(new MainMenu()))),
            ], ["main-menu-options"]),
        ]);
    }
}
