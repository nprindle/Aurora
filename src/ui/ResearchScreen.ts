import Game from "../Game.js";
import { UI } from "./UI.js";
import Technology from "../techtree/Technology.js";
import { GameWindow } from "./GameWindow.js";
import WorldScreen from "./worldScreen/WorldScreen.js";
import Resource from "../resources/Resource.js";
import { Page } from "./Page.js";

export default class ResearchScreen implements Page {

    private game: Game;
    readonly html: HTMLElement;

    constructor(game: Game) {
        this.game = game;
        this.html = UI.makeDiv(["research-screen"]);
        this.refresh();
    }

    refresh(): void {
        let researchHeader = UI.makeHeader("Available Research Projects");

        const possibleTechs: Technology[] = this.game.getResearchOptions();
        const researchResources: Resource[] =
        Resource.values.filter(resource => possibleTechs.some((tech) => tech.researchCost.resource === resource));

        const researchResourcesHTML: HTMLElement = UI.makeDiv(["research-resources"]);
        if (researchResources.length !== 0) {
            researchResourcesHTML.appendChild(UI.makeHeader("Available Research Data"));
            researchResources.forEach(resource => researchResourcesHTML.appendChild(
                UI.makePara(`${resource.name}: ${this.game.inventory.getResourceQuantity(resource)}`)
            ));
        }

        const researchOptionsHTML = UI.makeDivContaining(possibleTechs.map(tech => this.renderTechOption(tech)));

        if (possibleTechs.length === 0) {
            researchHeader = UI.makeDiv();
        }

        let historyHeader = UI.makeHeader("Previous Research Projects", 1, ["previous-research-header"]);
        const techHistory = this.game.getUnlockedTechnologies()
            .filter(tech => tech.visible)
            .map(tech => UI.makePara(`• ${tech.name}`, ["previous-research"]));

        if (techHistory.length === 0) {
            historyHeader = UI.makeDiv();
        }

        const backButton = UI.makeButton("Back", () => {
            GameWindow.show(new WorldScreen(this.game));
        }, []);

        UI.fillHTML(this.html, [
            researchHeader,
            researchOptionsHTML,
            researchResourcesHTML,
            historyHeader,
            ...techHistory,
            backButton,
        ]);
    }

    private renderTechOption(tech: Technology): HTMLElement {
        const div = UI.makeDivContaining([
            UI.makeHeader(tech.name, 2),
            UI.makePara(tech.description),
            UI.makePara(`Development cost: ${tech.researchCost}`)
        ], ["tech-option"]);
        let unmetPrereqs: number = 0;
        for (const prereq of tech.requiredTechs) {
            if (!this.game.hasUnlockedTechnology(prereq)) {
                unmetPrereqs++;
                div.appendChild(UI.makePara(`Requires ${prereq.name} research`));
            }
        }
        const canUnlock = (unmetPrereqs === 0) && this.game.inventory.canAfford([tech.researchCost]);
        const unlockCallback: () => void = () => {
            this.game.inventory.payCost([tech.researchCost]);
            this.game.unlockTechnology(tech);
            this.game.updateQuestState();
            this.refresh();
        };
        div.appendChild(UI.makeButton("Conduct Research", unlockCallback, [], canUnlock ? "enabled" : "disabled"));

        return div;
    }
}
