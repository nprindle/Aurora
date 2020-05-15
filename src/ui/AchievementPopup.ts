import { Page } from "./Page";
import Achievement from "../achievements/Achievement";
import { UI } from "./UI";

export class AchievementPopup implements Page {
    html: HTMLElement;

    constructor(achievement: Achievement) {
        this.html = UI.makeDivContaining([
            UI.makeHeader(`${achievement.emoji} Achievement Unlocked!`),
            UI.makePara(achievement.title),
        ], ["achievement-popup"]);
    }

    refresh(): void {}
}
