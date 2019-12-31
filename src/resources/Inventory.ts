import Resource from "./Resource";
import Cost from "./Cost";
import Conversion from "./Conversion";

export default class Inventory {

    private resourceQuantities: Map<Resource, number> = new Map<Resource, number>([]);

    constructor(){}

    // TODO make sure we can't get a negative resource value by adding a negative amount
    addQuantity(resource: Resource, quantity: number) {
        let oldQuantity = this.resourceQuantities.get(resource);
        if (oldQuantity == undefined) {
            this.resourceQuantities.set(resource, quantity);
        } else {
            this.resourceQuantities.set(resource, oldQuantity + quantity);
        }
    }

    removeQuantity(resource: Resource, quantity: number) {
        let oldQuantity = this.resourceQuantities.get(resource)!;
        if ((oldQuantity - quantity) < 0) {
            throw `Tried to set inventory ${resource.name} to negative value.`;
        }
        this.resourceQuantities.set(resource, oldQuantity - quantity);
    }

    getQuantity(resource: Resource): number {
        return this.resourceQuantities.get(resource) || 0;
    }

    canAfford(costs: Cost[]): boolean {
        /* since it's possible that the cost list contains more than one cost of the same resource type, we need to aggregate the costs together
         * to make sure that the entire set of costs can be afforded together
         */
        let costMap = new Map<Resource, number>();
        costs.forEach((cost: Cost) => {
            costMap.set(cost.resource, cost.quantity + (costMap.get(cost.resource) || 0));
        });

        return Array.from(costMap.keys()).every((resource: Resource) => {
            let costQuantity = costMap.get(resource)!;
            let availableQuantity = this.getQuantity(resource);
            return costQuantity <= availableQuantity;
        });
    }

    payCost(costs: Cost[]) {
        if (this.canAfford(costs)) {
            costs.forEach((cost: Cost) => this.removeQuantity(cost.resource, cost.quantity));
        } else {
            throw "Cannot afford to pay cost";
        }
    }

    getResourceList(): Resource[] {
        return Array.from(this.resourceQuantities.keys());
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
                conversion.outputs.forEach((output: Cost) => this.addQuantity(output.resource, output.quantity));
            }
        });
    }

    clone(): Inventory {
        let clone = new Inventory();
        this.getResourceList().forEach((resource: Resource) => {
            clone.addQuantity(resource, this.getQuantity(resource));
        });
        return clone;
    }
}
