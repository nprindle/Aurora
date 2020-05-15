import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import { Page } from "../Page.js";

export default class MessageScreen implements Page {
    readonly html: HTMLElement;

    constructor(
        private readonly header: string,
        private readonly message: string,
        private readonly backScreen: Page, // the page to return to
    ) {
        this.html = UI.makeDivContaining([
            UI.makeHeader(this.header),
            UI.makePara(this.message),
            UI.makeDivContaining([
                UI.makeButton("Back", () => {
                    GameWindow.show(this.backScreen);
                }),
            ]),
        ], ["message-screen"]);
    }

    refresh(): void {}
}
