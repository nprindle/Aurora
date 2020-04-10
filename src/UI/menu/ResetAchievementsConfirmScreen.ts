import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "./MainMenu.js";
import SettingsScreen from "./SettingsScreen.js";
import { Achievements } from "../../achievements/Achievements.js";

export default class ResetAchievementsConfirmScreen implements Page {

    readonly html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv(["main-menu", "confirm-menu"]);
        this.refresh();
    }

    refresh(): void {
        // TODO change text is save doesn't exist

        UI.fillHTML(this.html, [
            UI.makeHeader("Reset Achievements Progress?", 1),
            UI.makeDivContaining([
                UI.makeButton("confirm", () => {
                    Achievements.resetAchievements();
                    GameWindow.show(new SettingsScreen(new MainMenu()));
                }),
                UI.makeButton("cancel", () => GameWindow.show(new SettingsScreen(new MainMenu()))),
            ], ["main-menu-options"]),
        ]);
    }
}
