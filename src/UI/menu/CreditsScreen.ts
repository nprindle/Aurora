import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";


class CreditsEntry {
    constructor(public name: string, public roles: string[]){}
}

const credits: CreditsEntry[] = [
    new CreditsEntry("Grace Rarer", ["Team Lead", "Gameplay Programmer"]),
    new CreditsEntry("Prindle", ["DevOps"]), // <3
    new CreditsEntry("May Lawver", ["Programmer (HTML Composition Code)"]),
];

// this may need to become a real class in the future
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class CreditsScreen {
    static render(): HTMLElement {
        const nameParas: HTMLElement[] = credits.map(entry => UI.makePara(entry.name, ["credits-name"]));
        const roleParas: HTMLElement[] = credits.map(entry => UI.makePara(entry.roles.join(", "), ["credits-roles"]));

        return UI.makeDivContaining([
            UI.makeHeader("Credits", 1),
            UI.makeDivContaining([
                UI.makeDivContaining(nameParas, ["credits-names-column"]),
                UI.makeDivContaining(roleParas),
            ], ["credits-container"]),
            UI.makeButton("Back", () => GameWindow.showMainMenu()),
        ], ["credits"]);
    }
}
