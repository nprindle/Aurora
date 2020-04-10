import { Page } from "../GameWindow.js";
import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import { Settings, SettingsOptions } from "../../persistence/Settings.js";
import { GameSave } from "../../persistence/GameSave.js";
import { Achievements } from "../../achievements/Achievements.js";
import { ConfirmScreen } from "./ConfirmScreen.js";

export default class SettingsScreen implements Page {
    readonly html: HTMLElement;

    // The current values of selected options
    options: SettingsOptions;

    constructor(
        private readonly backScreen: Page, // the page to return to
    ) {
        this.html = UI.makeDiv();
        this.options = Settings.loadOptions();
        this.refresh();
    }

    refresh(): void {
        // Make a slider with an adjacent label displaying its current value
        const makeTrackedSlider = (label: string, min: number, max: number, def: number,
            callback: (value: number) => void, step?: number): HTMLElement => {
            const tracker = UI.makePara(def.toString());
            const slider = UI.makeSlider(label, min, max, def, (value: number) => {
                callback(value);
                tracker.innerText = value.toString();
            }, step);
            return UI.makeDivContaining([slider, tracker], ["settings-slider"]);
        };

        const sliders: HTMLElement[] = [
            makeTrackedSlider("Volume", 0, 100, this.options.volume * 100, (value: number) => {
                this.options.volume = value / 100;
                Settings.saveOptions(this.options);
            }, 5),
            makeTrackedSlider("View width", 6, 18, this.options.viewWidth, (value: number) => {
                this.options.viewWidth = value;
                Settings.saveOptions(this.options);
            }),
            makeTrackedSlider("View height", 4, 12, this.options.viewHeight, (value: number) => {
                this.options.viewHeight = value;
                Settings.saveOptions(this.options);
            }),
        ];

        UI.fillHTML(this.html, [
            UI.makeDivContaining([
                UI.makeHeader("Settings", 1),
                UI.makeDivContaining(sliders),
                UI.makeDivContaining([
                    UI.makeButton("Restore defaults", () => {
                        this.options = SettingsOptions.defaultOptions();
                        Settings.saveOptions(this.options);
                        this.refresh();
                    }),
                ]),
                UI.makeDivContaining([
                    UI.makeButton("Clear saved game", () => {
                        GameWindow.show(new ConfirmScreen(
                            "Delete Saved Data?",
                            this,
                            () => {
                                GameSave.clearProgress();
                                this.refresh();
                                this.backScreen.refresh();
                                GameWindow.show(this);
                            }
                        ));
                    }, [], GameSave.saveExists() ? "enabled" : "disabled"),
                ]),
                UI.makeDivContaining([
                    UI.makeButton("Reset Achievements", () => {
                        GameWindow.show(new ConfirmScreen(
                            "Reset Achievements Progress?",
                            this,
                            () => {
                                Achievements.resetAchievements();
                                this.refresh();
                                this.backScreen.refresh();
                                GameWindow.show(this);
                            }
                        ));
                    }, [], Achievements.getUnlockedAchievements().length > 0 ? "enabled" : "disabled"),
                ]),
                UI.makeDivContaining([
                    UI.makeButton("Back", () => {
                        Settings.saveOptions(this.options);
                        GameWindow.show(this.backScreen);
                    }),
                ]),
            ], ["settings"])
        ]);
    }
}
