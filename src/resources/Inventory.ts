import Resource from "./Resource";
import Cost from "./Cost";

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
        // TODO prevent making inventory negative
        let oldQuantity = this.resourceQuantities.get(resource)!;
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
        // TODO fix bugs resulting from passing in a list where more than 1 cost is of the same resource type
        return costs.every((cost: Cost) => {
            return (this.getQuantity(cost.resource) >= cost.quantity);
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
}