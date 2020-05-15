import { GameWindow } from "../GameWindow";
import { UI } from "../UI";
import { Page } from "../Page";

// a UI for prompting the user to confirm that they want to do something
export class ConfirmScreen implements Page {
    readonly html: HTMLElement;

    constructor(
        text: string,
        backScreen: Page, // the page to return to if the user selects cancel
        action: () => void, // callback used when the user selects confirm
    ) {
        this.html = UI.makeDivContaining([
            UI.makeHeader(text, 1),
            UI.makeDivContaining([
                UI.makeButton("confirm", () => {
                    action();
                }),
                UI.makeButton("cancel", () => GameWindow.show(backScreen)),
            ], ["main-menu-options"]),
        ], ["main-menu", "confirm-menu"]);
        this.refresh();
    }

    refresh(): void {}
}
