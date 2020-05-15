import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import Quote from "./Quote.js";
import { indentWithNBS } from "../../util/Text.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import Game from "../../Game.js";
import { GameSave } from "../../persistence/GameSave.js";
import Conversion from "../../resources/Conversion.js";
import { Page } from "../Page.js";

// "loading" screen shown between turns
export default class TransitionScreen implements Page {
    readonly html: HTMLElement;
    private loadingArea: HTMLElement;
    private loadingBar: HTMLElement;
    private quote: Quote;
    private doneLoading: boolean = false;

    constructor(
        private game: Game,
        private quoteIndex?: number,
    ) {
        this.html = UI.makeDiv();
        this.loadingBar = UI.makeDiv(["transition-loading-bar"]);
        this.loadingArea = UI.makeDivContaining([
            this.loadingBar
        ], ["transition-loading-area"]);
        if (quoteIndex) {
            this.quote = Quote.getQuote(quoteIndex);
        } else {
            this.quote = Quote.getRandomQuote();
        }

        // Add in leading quotation mark after leading whitespace
        const quotedText = indentWithNBS(this.quote.text).replace(/^(\s*)/, "$1“") + "”";
        UI.fillHTML(this.html, [
            UI.makeDivContaining([
                UI.makePara(quotedText),
                UI.makePara(`- ${this.quote.attribution}`, ["transition-attribution"])
            ], ["transition-quote-panel"]),
            this.loadingArea
        ]);
    }

    refresh(): void {}

    startLoading(): void {
        const startTime = Date.now();
        this.game.completeTurn();
        GameSave.saveProgress({ game: this.game, nextConversionPriority: Conversion.unsafeGetNextPriority() });
        const elapsedTime = Date.now() - startTime;

        setTimeout(() => {
            UI.fillHTML(this.loadingArea, [
                UI.makeButton("Continue", () => { this.continueToNextTurn(); })
            ]);
            this.doneLoading = true;
        }, 2000 - elapsedTime);
    }

    private continueToNextTurn(): void {
        GameWindow.show(new WorldScreen(this.game));
    }

    handleKeyDown(): void {
        if (this.doneLoading) {
            this.continueToNextTurn();
        }
    }
}
