import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import Conversion from "../../resources/Conversion.js";
import Inventory from "../../resources/Inventory.js";
import WorldScreen from "../worldScreen/WorldScreen.js";

import Sortable from "sortablejs";
import Species from "../../resources/Species.js";

// the production screen is where the player selects the priority order for resource conversions
export default class ProductionScreen implements Page {
    readonly html: HTMLElement;
    private game: Game;

    constructor(game: Game) {
        this.game = game;
        this.html = UI.makeDiv(["production-screen"]);
        this.refresh();
    }

    refresh(): void {
        // clone of the inventory that represents what the inventory will be after this turn's conversions are applied
        const inventoryCopy = this.game.inventory.clone();

        const conversions = this.game.getResourceConversions();

        const conversionsHTML: HTMLElement[] = [];
        for (const conversion of conversions) {
            if (inventoryCopy.canAfford(conversion.inputs) && inventoryCopy.hasEnoughWorkers(conversion.requiredWorkers)) {
                conversionsHTML.push(this.renderConversion(conversion, true));
                inventoryCopy.applyConversions([conversion]);
            } else {
                conversionsHTML.push(this.renderConversion(conversion, false));
            }
        }
        const conversionsDiv = UI.makeDivContaining(conversionsHTML);

        Sortable.create(conversionsDiv, {
            onEnd: evt => {
                const fromIndex = evt.oldDraggableIndex;
                const toIndex = evt.newDraggableIndex;
                if (fromIndex !== undefined && toIndex !== undefined) {
                    this.shiftConversion(fromIndex, toIndex);
                }
            }
        });

        const availableWorkersLabel = UI.makePara(
            `Available workers at start of production cycle: ${this.game.inventory.getAvailableWorkers()}`,
            ["production-screen-available-workers"]);
        const unusedWorkersLabel = UI.makePara(
            `Unused workers at end of production cycle: ${inventoryCopy.getAvailableWorkers()}`,
            ["production-screen-worker-consumption-label"]);

        const populationConsumptionHtml = UI.makeDiv();
        if (this.game.inventory.getSpeciesList().length !== 0) {

            // make another clone so that we can step through each species' resource consumption
            // but still be able to run the actual populationGrowth method on inventoryClone afterwards
            const consumptionInventoryCopy = inventoryCopy.clone();

            populationConsumptionHtml.appendChild(
                UI.makePara("Resources required for worker upkeep:", ["production-screen-worker-consumption-label"])
            );
            for (const species of consumptionInventoryCopy.getSpeciesList()) {
                const provided = consumptionInventoryCopy.getProvidedWorkerConsumption(species).quantity;
                const required = consumptionInventoryCopy.getRequiredWorkerConsumption(species).quantity;
                const resource = species.survivalCost.resource;

                const consumptionDescription = `${species.name}: ${provided}/${required} ${resource.name}`;

                const cssClass = (required > provided) ? "population-consumption-unmet" : "population-consumption-met";
                populationConsumptionHtml.appendChild(
                    UI.makePara(consumptionDescription, [cssClass, "production-screen-worker-consumption"])
                );

                consumptionInventoryCopy.payCost([consumptionInventoryCopy.getProvidedWorkerConsumption(species)]);
            }
        }

        // list deaths if any workers have died
        const workerDeathHtml = UI.makeDiv();
        const speciesList = inventoryCopy.getSpeciesList();
        const initialPopulation: Map<Species, number> = new Map();
        for (const species of speciesList) {
            initialPopulation.set(species, inventoryCopy.getPopulation(species));
        }
        inventoryCopy.doPopulationGrowth();
        const finalPopulation: Map<Species, number> = new Map();
        for (const species of speciesList) {
            finalPopulation.set(species, inventoryCopy.getPopulation(species));
        }
        for (const species of speciesList) {
            const initial = initialPopulation.get(species)!;
            const final = finalPopulation.get(species)!;
            const deaths = initial - final;

            if (deaths > 0) {
                workerDeathHtml.appendChild(
                    UI.makePara(`${deaths} ${species.name} will die from lack of ${species.survivalCost.resource.name}!`,
                        ["population-death-label"]));
            }
        }


        UI.fillHTML(this.html, [
            UI.makeHeader("Resource Production Management"),
            UI.makeHeader("Inventory at start of production cycle:", 2, ["production-screen-label"]),
            this.renderInventory(this.game.inventory),
            UI.makeHeader("Resource production", 2, ["production-screen-label"]),
            availableWorkersLabel,
            UI.makePara("Drag conversions to change the activation order", ["production-screen-drag-hint"]),
            conversionsDiv,
            UI.makeHeader("Workforce", 2, ["production-screen-label"]),
            unusedWorkersLabel,
            populationConsumptionHtml,
            workerDeathHtml,
            UI.makeHeader("Inventory at end of production cycle:", 2, ["production-screen-label"]),
            this.renderInventory(inventoryCopy),
            UI.makeButton("Back", () => { GameWindow.show(new WorldScreen(this.game)); }, ["production-screen-back-button"]),
        ]);
    }

    private renderInventory(inventory: Inventory): HTMLElement {
        const resourceDescriptions = inventory.getInventoryStrings().map(resourceString => UI.makePara(resourceString));

        if (resourceDescriptions.length === 0) {
            resourceDescriptions.push(UI.makePara("(none)"));
        }

        return UI.makeDivContaining(resourceDescriptions, ["production-screen-inventory"]);
    }

    renderConversion(conversion: Conversion, canAfford: boolean): HTMLElement {
        const div = UI.makeDiv(["conversion"]);

        let text = conversion.toString();
        let cssClass = "conversion-description-normal"; // css class that changes to show the conversion's status
        if (!conversion.enabled) {
            text = `${conversion.toString()} (disabled) `;
            cssClass = "conversion-description-disabled";
        } else if (!canAfford) {
            text = `${conversion.toString()} (cannot afford)`;
            cssClass = `conversion-description-cannot-afford`;
        }

        const textPara = UI.makePara(text, [cssClass, "conversion-description"]);
        const textDiv = UI.makeDivContaining([textPara], ["conversion-description-box"]);
        div.appendChild(textDiv);
        div.appendChild(UI.makeButton("Toggle", () => { this.toggle(conversion); }));

        return div;
    }

    private shiftConversion(fromIndex: number, toIndex: number): void {
        this.game.shiftConversionPriority(fromIndex, toIndex);
        this.refresh();
    }

    private toggle(conversion: Conversion): void {
        conversion.enabled = !conversion.enabled;
        this.refresh();
    }
}
