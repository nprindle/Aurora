import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "./MainMenu.js";
import SettingsScreen from "./SettingsScreen.js";
import Game from "../../Game.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import { GameSave } from "../../persistence/GameSave.js";
import Conversion from "../../resources/Conversion.js";

export default class PauseMenu implements Page {
    readonly html: HTMLElement;

    constructor(private game: Game) {
        this.html = UI.makeDiv(["main-menu", "pause-menu"]);
        this.refresh();
    }

    refresh(): void {
        UI.fillHTML(this.html, [
            UI.makeHeader("Game Paused", 2),
            UI.makeDivContaining([
                UI.makeButton("resume_game", () => {
                    GameWindow.show(new WorldScreen(this.game));
                }),
                MainMenu.makeAudioButton(this),
                UI.makeButton("change_settings", () => {
                    GameWindow.show(new SettingsScreen(this));
                }),
                UI.makeButton("save_and_quit", () => {
                    GameSave.saveProgress({ game: this.game, nextConversionPriority: Conversion.unsafeGetNextPriority() });
                    GameWindow.show(new MainMenu());
                }),
            ], ["main-menu-options"]),
        ]);
    }
}
