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
        const possibleTechs: Technology[] = this.game.getResearchOptions();

        const researchHeader = (possibleTechs.length > 0)
            ? UI.makeHeader("Available Research Projects")
            : UI.makeDiv(); // don't show header if there are no available technologies

        const researchResources: Resource[] =
        Resource.values.filter(resource => possibleTechs.some((tech) => tech.researchCost?.resource === resource));

        const researchResourcesHTML: HTMLElement = UI.makeDiv(["research-resources"]);
        if (researchResources.length !== 0) {
            researchResourcesHTML.appendChild(UI.makeHeader("Available Research Data"));
            researchResources.forEach(resource => researchResourcesHTML.appendChild(
                UI.makePara(`${resource.name}: ${this.game.inventory.getResourceQuantity(resource)}`)
            ));
        }

        const researchOptionsHTML = UI.makeDivContaining(possibleTechs.map(tech => this.renderTechOption(tech)));

        const techHistory = this.game.getUnlockedTechnologies()
            .filter(tech => tech.researchCost !== undefined)
            .map(tech => UI.makePara(`- ${tech.name}`, ["previous-research"]));

        const historyHeader = (techHistory.length > 0)
            ? UI.makeHeader("Previous Research Projects", 1, ["previous-research-header"])
            : UI.makeDiv(); // don't show header if no research has been completed

        UI.fillHTML(this.html, [
            researchHeader,
            researchOptionsHTML,
            researchResourcesHTML,
            historyHeader,
            ...techHistory,
            UI.makeButton("Back", () => {
                GameWindow.show(new WorldScreen(this.game));
            }, []),
        ]);
    }

    // only technologies that a have an associated research cost can be rendered
    private renderTechOption(tech: Technology): HTMLElement {

        const researchCost = tech.researchCost;

        // don't render "hidden" technologies, i.e. those that have no research cost
        if (researchCost === undefined) {
            console.warn("rendered unresearchable technology");
            return UI.makeDiv();
        }

        // we assume that all prerequisite technologies are completed because otherwise we don't show the option at all
        const canUnlock = this.game.inventory.canAfford([researchCost]);

        const unlockCallback: () => void = () => {
            this.game.inventory.payCost([researchCost]);
            this.game.unlockTechnology(tech);
            this.game.updateQuestState();
            this.refresh();
        };

        return UI.makeDivContaining([
            UI.makeHeader(tech.name, 2),
            UI.makePara(tech.description),
            UI.makePara(`Development cost: ${tech.researchCost}`),
            UI.makeButton("Conduct Research", unlockCallback, [], canUnlock ? "enabled" : "disabled"),
        ], ["tech-option"]);
    }
}
