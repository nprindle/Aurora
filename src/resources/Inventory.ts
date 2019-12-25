import Resource from "./Resource";
import Cost from "./Cost";
import Conversion from "./Conversion";

export default class Inventory {

    private resourceQuantities: Map<Resource, number> = new Map<Resource, number>([]);

    constructor() {
        
    }

    addQuantity(resource: Resource, quantity: number) {
        let oldQuantity = this.resourceQuantities.get(resource)
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

    getQuantity(resource: Resource) {
        let quantity = this.resourceQuantities.get(resource);
        if (quantity == undefined) {
            return 0;
        } else {
            return quantity;
        }
    }

    canAfford(costs: Cost[]) {
        /* since it's possible that the cost list contains more than one cost of the same resource type, we need to aggregate the costs together
         * to make sure that the entire set of costs can be afforded together
         */
        let costMap = new Map<Resource, number>();
        costs.forEach((cost: Cost) => {
            if (costMap.get(cost.resource) == undefined) {
                costMap.set(cost.resource, cost.quantity);
            } else {
                costMap.set(cost.resource, cost.quantity + costMap.get(cost.resource)!);
            }
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

    // Attempts to apply each resource conversion in sequence, skipping those for which the inputs are unavailable at that point in the process
    applyConversions(conversions: Conversion[]) {
        conversions.forEach((conversion: Conversion) => {
            if (this.canAfford(conversion.inputs) && conversion.enabled) {
                this.payCost(conversion.inputs);
                conversion.outputs.forEach((output: Cost) => this.addQuantity(output.resource, output.quantity));
                console.log(conversion);
            }
        });
    }

    clone(): Inventory {
        let clone = new Inventory();
        this.getResourceList().forEach((resource: Resource) => {
            let quantity = this.getQuantity(resource);
            clone.addQuantity(resource, quantity);
        });

        return clone;
    }
}