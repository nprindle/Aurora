import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import { Achievements } from "../../achievements/Achievements.js";
import Achievement from "../../achievements/Achievement.js";
import { Page } from "../Page.js";

export default class AchievementsScreen implements Page {

    readonly html: HTMLElement;
    constructor(
        backScreen: Page, // the page to return to
    ) {
        // array of achievements with most-recently-unlocked at the top
        const unlockedAchievements: Achievement[] = Achievements.getUnlockedAchievements().reverse();
        const percentage = Math.floor(100 * unlockedAchievements.length / Achievement.values().length);

        this.html = UI.makeDivContaining([
            UI.makeHeader(`Achievements ${percentage}%`),
            ...unlockedAchievements.map(a => this.renderAchievement(a)),
            UI.makeButton("Back", () => GameWindow.show(backScreen)),
        ], ["achievements-screen"]);
    }

    private renderAchievement(achievement: Achievement): HTMLElement {
        return UI.makeDivContaining([
            UI.makeDivContaining([
                UI.makeHeader(achievement.emoji),
                UI.makeHeader(achievement.title),
            ], ["achievement-header"]),
            UI.makePara(achievement.description),
        ], ["achievement"]);
    }

    refresh(): void {}
}
