import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "./MainMenu.js";


class CreditsEntry {
    constructor(public name: string, public roles: string[]) {}
}

const credits: CreditsEntry[] = [
    new CreditsEntry("Grace Rarer", ["Team Lead", "Game Designer", "Programmer"]),
    new CreditsEntry("Prindle", ["Programmer", "DevOps"]), // <3
    new CreditsEntry("Seong Ryoo", ["Environment Artist"]),
    new CreditsEntry("May Lawver", ["Programmer"]),
    new CreditsEntry("Mitchell Philipp", ["UI Programmer"]),
    new CreditsEntry("Brad Baker", ["Gameplay Programmer"]),
    new CreditsEntry("Will Cooper", ["UI Programmer"]),

];

// this may need to become a real class in the future
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class CreditsScreen implements Page {

    readonly html: HTMLElement;
    constructor() {
        this.html = UI.makeDiv(["credits"]);
        this.refresh();
    }

    refresh(): void {
        UI.fillHTML(this.html, [
            ...credits.map(entry => this.renderCreditsEntry(entry)),
            UI.makeButton("Back", () => GameWindow.show(new MainMenu())),
        ]);
    }

    private renderCreditsEntry(entry: CreditsEntry): HTMLElement {
        return UI.makeDivContaining([
            UI.makeHeader(entry.name, 1),
            ...entry.roles.map(role => UI.makePara(role)),
        ], ["credits-entry"]);
    }
}
