import Resource from "./Resource.js";
import Cost from "./Cost.js";
import Conversion from "./Conversion.js";
import QuantityMap from "../util/QuantityMap.js";
import Species from "./Species.js";

export default class Inventory {

    private resourceQuantities: QuantityMap<Resource> = new QuantityMap<Resource>();
    private population: QuantityMap<Species> = new QuantityMap<Species>(); // all workers (available + occupied)
    private availableWorkers: number = 0; // workers that have not been occupied for this turn yet

    constructor(){}

    addResource(resource: Resource, quantity: number) {
        this.resourceQuantities.add(resource, quantity);
    }

    removeResource(resource: Resource, quantity: number) {
        this.resourceQuantities.remove(resource, quantity);
    }

    getResourceQuantity(resource: Resource): number {
        return this.resourceQuantities.get(resource) || 0;
    }

    addWorkers(species: Species, quantity: number) {
        this.population.add(species, quantity);
    }

    // TODO automatically cap population of each type

    // makes the entire population pool available as workers (makes all workers unoccupied)
    releaseWorkers() {
        this.availableWorkers = this.population.getSum();
    }

    occupyWorkers(quantity: number) {
        if (this.availableWorkers < quantity) {
            throw "insufficient workers";
        }
        if (quantity < 0) {
            throw "tried to occupy a negative number of workers";
        }
        this.availableWorkers = this.availableWorkers - quantity;
    }

    getTotalPopulation(): number {
        return this.population.getSum();
    }

    getAvailableWorkers(): number {
        return this.availableWorkers;
    }

    canAfford(costs: Cost[]): boolean {
        /* since it's possible that the cost list contains more than one cost of the same resource type, we need to aggregate the costs together
         * to make sure that the entire set of costs can be afforded together
         */
        const costMap = new Map<Resource, number>();
        costs.forEach((cost: Cost) => {
            costMap.set(cost.resource, cost.quantity + (costMap.get(cost.resource) || 0));
        });

        return Array.from(costMap.keys()).every((resource: Resource) => {
            const costQuantity = costMap.get(resource)!;
            const availableQuantity = this.getResourceQuantity(resource);
            return costQuantity <= availableQuantity;
        });
    }

    hasEnoughWorkers(requiredWorkers: number): boolean {
        return this.availableWorkers > requiredWorkers;
    }

    payCost(costs: Cost[]) {
        if (this.canAfford(costs)) {
            costs.forEach((cost: Cost) => this.removeResource(cost.resource, cost.quantity));
        } else {
            throw "Cannot afford to pay cost";
        }
    }

    getResourceList(): Resource[] {
        return this.resourceQuantities.getKeys();
    }

    // returns strings showing the resource type and amount for each resource in the inventory
    getInventoryStrings(): string[] {
        return this.getResourceList().map((resource: Resource) => `${resource.name}: ${this.getResourceQuantity(resource)}`);
    }

    // returns strings showing the ammounts of each population type
    getPopulationStrings(): string[] {
        return this.population.getKeys().map(species => `${this.population.get(species)} ${species.name}`);
    }

    // Attempts to apply each resource conversion in sequence, skipping those for which the inputs are unavailable at that point in the process
    applyConversions(conversions: Conversion[]) {
        conversions.forEach((conversion: Conversion) => {
            if (this.canAfford(conversion.inputs) && this.hasEnoughWorkers(conversion.requiredWorkers) && conversion.enabled) {
                this.payCost(conversion.inputs);
                this.occupyWorkers(conversion.requiredWorkers);
                conversion.outputs.forEach((output: Cost) => this.addResource(output.resource, output.quantity));
            }
        });
    }

    clone(): Inventory {
        const clone = new Inventory();
        clone.resourceQuantities = this.resourceQuantities.clone();
        clone.population = this.population.clone();
        clone.availableWorkers = this.availableWorkers;
        return clone;
    }
}
