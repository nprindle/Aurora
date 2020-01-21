import Game from "../../Game.js";
import UI from "../UI.js";
import GameWindow from "../GameWindow.js";

export default class WorldScreenHeader {
    private html: HTMLElement;
    private run: Game;
    /* This is used to determine when to apply "emphasis" css to newly-advanced quest objectives
     * It's tracked statically to persist when we leave the World Screen and then come back to a new world screen instance
     */
    private static prevQuestDescription: string = "";

    // this should be called at the start of each run to reset the static prevQuestDescription
    static resetQuestDescriptionHistory() {
        WorldScreenHeader.prevQuestDescription = "";
    }

    constructor(run: Game) {
        this.html = UI.makeDiv(['world-screen-header']);
        this.run = run;
        this.refresh();
    }

    refresh() {
        const quitButton = UI.makeButton("Quit Game", () => {GameWindow.showMainMenu();});
        const transitionButton = UI.makeButton("Next Turn", () => {GameWindow.transitionToNextTurn();});
        const productionScreenButton = UI.makeButton("Manage Production", () => {GameWindow.showProductionScreen()});
        const questText = this.run.getCurrentQuestText();
        let questDescription = UI.makePara(`Objective: ${questText}`, ["world-screen-quest-description"]);

        // show message after quest completion
        const prevQuestDescription = WorldScreenHeader.prevQuestDescription;
        if (questText !== prevQuestDescription && prevQuestDescription !== "") {
            console.log("set bold");
            questDescription = UI.makePara(`Completed: ${prevQuestDescription}`, ["world-screen-quest-description", "quest-description-emphasis"]);

            // reset description after time has passed
            setTimeout(() => {
                console.log("remove bold");
                this.refresh();
            }, 1500);
        }
        WorldScreenHeader.prevQuestDescription = questText;

        UI.fillHTML(this.html, [
            quitButton,
            productionScreenButton,
            transitionButton,
            questDescription,
        ]);
    }

    getHTML(): HTMLElement {
        return this.html;
    }
}
