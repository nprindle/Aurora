import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import CreditsScreen from "./CreditsScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import { enableCheats } from "../../util/Cheats.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import Game from "../../Game.js";
import { MusicManager } from "../../music/MusicManager.js";

export default class MainMenu implements Page {

    readonly html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv(["main-menu"]);
        this.refresh();
    }

    refresh(): void {
        const musicPlaying = MusicManager.isPlaying();
        let musicButton;
        if (!musicPlaying) {
            musicButton = UI.makeButton("enable audio", () => {
                MusicManager.initialize();
                this.refresh();
            });
        } else {
            musicButton = UI.makeButton("disable audio", async (button: HTMLButtonElement) => {
                button.disabled = true;
                button.innerText = "stopping audio...";
                await MusicManager.stop();
                this.refresh();
            });
        }

        UI.fillHTML(this.html, [
            UI.makeHeader("Aurora", 1),
            UI.makeDivContaining([
                UI.makeButton("start game", () => {
                    const newGame = new Game();
                    enableCheats(newGame);
                    GameWindow.show(new WorldScreen(newGame));
                }),
                musicButton,
                UI.makeButton("change settings", () => GameWindow.show(new SettingsScreen())),
                UI.makeButton("view credits", () => GameWindow.show(new CreditsScreen())),
            ], ["main-menu-options"]),
        ]);
    }
}
