import Resource from "./Resource";
import Cost from "./Cost";
import Conversion from "./Conversion";
import QuantityMap from "../util/QuantityMap";

export default class Inventory {

    private resourceQuantities: QuantityMap<Resource> = new QuantityMap<Resource>();

    constructor(){}

    add(resource: Resource, quantity: number) {
        this.resourceQuantities.add(resource, quantity);
    }

    remove(resource: Resource, quantity: number) {
        this.resourceQuantities.remove(resource, quantity);
    }

    getQuantity(resource: Resource): number {
        return this.resourceQuantities.get(resource) || 0;
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
            const availableQuantity = this.getQuantity(resource);
            return costQuantity <= availableQuantity;
        });
    }

    payCost(costs: Cost[]) {
        if (this.canAfford(costs)) {
            costs.forEach((cost: Cost) => this.remove(cost.resource, cost.quantity));
        } else {
            throw "Cannot afford to pay cost";
        }
    }

    getResourceList(): Resource[] {
        return this.resourceQuantities.getKeys();
    }

    // returns strings showing the resource type and amount for each resource in the inventory
    getInventoryStrings(): string[] {
        return this.getResourceList().map((resource: Resource) => `${resource.name}: ${this.getQuantity(resource)}`);
    }

    // Attempts to apply each resource conversion in sequence, skipping those for which the inputs are unavailable at that point in the process
    applyConversions(conversions: Conversion[]) {
        conversions.forEach((conversion: Conversion) => {
            if (this.canAfford(conversion.inputs) && conversion.enabled) {
                this.payCost(conversion.inputs);
                conversion.outputs.forEach((output: Cost) => this.add(output.resource, output.quantity));
            }
        });
    }

    clone(): Inventory {
        const clone = new Inventory();
        this.getResourceList().forEach((resource: Resource) => {
            clone.add(resource, this.getQuantity(resource));
        });
        return clone;
    }
}
