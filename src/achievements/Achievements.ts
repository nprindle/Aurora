import Achievement from "./Achievement";
import Game from "../Game";
import { Storage } from "../persistence/Storage";
import { Schemas } from "../serialize/Schema";
import { GameWindow } from "../UI/GameWindow";
import { AchievementPopup } from "../UI/AchievementPopup";

export namespace Achievements {
    let unlockedAchievements: Achievement[] = [];

    const lsKey = "unlockedAchievements";

    const achievementArraySchema = Schemas.arrayOf(Achievement.schema);

    function loadAchievementProgress(): void {
        console.log("loading achievements...");
        const stored = Storage.loadItem(lsKey, achievementArraySchema);
        if (stored?.resultType === "success") {
            for (const storedAchievement of stored.result) {
                if (!unlockedAchievements.includes(storedAchievement)) {
                    unlockedAchievements.push(storedAchievement);
                }
            }
        } else {
            console.warn("failed to load achievements");
        }
    }

    function saveAchievementProgress(): void {
        console.log("saving achievements...");
        // update based on stored achievement progress in case it has changed due to activity in another tabs
        loadAchievementProgress();
        Storage.saveItem(lsKey, unlockedAchievements, achievementArraySchema);
        if (!Storage.hasItem(lsKey)) {
            console.warn("save did not create storage item");
        } else {
            console.log(Storage.loadItem(lsKey, achievementArraySchema));
        }
    }

    export function getUnlockedAchievements(): Achievement[] {
        loadAchievementProgress();
        return [...unlockedAchievements];
    }

    function unlock(achievement: Achievement): void {
        // update based on stored achievement progress in case it has changed due to activity in another tabs
        loadAchievementProgress();
        if (!unlockedAchievements.includes(achievement)) {
            console.log(`unlocked ${achievement.title}`);
            unlockedAchievements.push(achievement);
            saveAchievementProgress();
            GameWindow.popup(new AchievementPopup(achievement), 3000);
        }
    }

    // unlocks any previously-locked achievements that are satisfied by the state of the given Game
    export function updateAchievements(game: Game): void {
        console.log("check achievements");
        for (const achievement of Achievement.values()) {
            if (achievement.requirement(game)) {
                unlock(achievement);
            }
        }
    }

    export function unlockAll(): void {
        for (const achievement of Achievement.values()) {
            unlock(achievement);
        }
    }

    export function resetAchievements(): void {
        unlockedAchievements = [];
        Storage.removeItem(lsKey);
    }
}
