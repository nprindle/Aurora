import MainMenuUI from "./menu/MainMenuUI.js";
import { UI } from "./UI.js";
import WorldScreen from "./worldScreen/WorldScreen.js";
import Game from "../Game.js";
import { disableCheats, enableCheats } from "../util/Cheats.js";
import TransitionScreen from "./transitionScreen/TransitionScreen.js";
import ProductionScreen from "./productionScreen/ProductionScreen.js";
import CreditsScreen from "./menu/CreditsScreen.js";
import ResearchScreen from "./ResearchScreen.js";

export namespace GameWindow {

    const rootDiv: HTMLElement = document.getElementById("rootdiv")!; // root div for all of our HTML
    let currentRun: Game;

    export function showMainMenu(): void {
        disableCheats();
        UI.fillHTML(rootDiv, [MainMenuUI.renderMainMenu()]);
    }

    export function showCredits(): void {
        disableCheats();
        UI.fillHTML(rootDiv, [CreditsScreen.render()]);
    }

    export function showWorldScreen(): void {
        const worldScreen = new WorldScreen(currentRun);
        UI.fillHTML(rootDiv, [worldScreen.getHTML()]);

        enableCheats(currentRun, worldScreen); // cheats are available when on the world screen

        // Attach keyboard input listener
        document.onkeydown = (e: KeyboardEvent) => {
            worldScreen.handleKeyDown(e);
        };
    }

    export function startGame(): void {
        currentRun = new Game();
        showWorldScreen();
    }

    export function showProductionScreen(): void {
        disableCheats();

        const productionScreen: ProductionScreen = new ProductionScreen(currentRun);
        UI.fillHTML(rootDiv, [productionScreen.getHTML()]);
    }

    export function showResearchScreen(): void {
        disableCheats();

        const researchScreen: ResearchScreen = new ResearchScreen(currentRun);
        UI.fillHTML(rootDiv, [researchScreen.getHTML()]);
    }

    export function transitionToNextTurn(): void {
        disableCheats();
        const transitionScreen = new TransitionScreen();
        UI.fillHTML(rootDiv, [transitionScreen.getHTML()]);

        transitionScreen.startLoading();
        currentRun.completeTurn(); // update game state
        transitionScreen.revealButton();
    }
}
