import { UI } from "../UI.js";
import { Page } from "../Page.js";

// screen for informing user of a game-breaking failure as a more user-friendly alternative to throwing an exception
export default class ExceptionScreen implements Page {
    readonly html: HTMLElement;

    constructor(
        private readonly header: string,
        private readonly message: string,
    ) {
        this.html = UI.makeDivContaining([
            UI.makeHeader(this.header),
            UI.makePara(this.message),
        ], ["message-screen"]);
    }

    refresh(): void {}
}
