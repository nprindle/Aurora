import UI from "../UI.js";
import GameWindow from "../GameWindow.js";


class CreditsEntry {
    constructor(public name: string, public roles: string[]){}
}

const credits: CreditsEntry[] = [
    new CreditsEntry("Grace Rarer", ["Team Lead", "Gameplay Programmer"]),
    new CreditsEntry("Prindle", ["Tooling Programmer"]), // <3
]

export default class CreditsScreen {
    static render(): HTMLElement {

        console.log(credits);
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
