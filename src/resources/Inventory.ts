import { Resource } from "./Resource";

export default class Inventory {

    private resourceQuantities: Map<Resource, number> = new Map<Resource, number>([]);

    constructor() {
        
    }

    add(resource: Resource, quantity: number) {
        let oldQuantity = this.resourceQuantities.get(resource)
        if (oldQuantity == undefined) {
            this.resourceQuantities.set(resource, quantity);
        } else {
            this.resourceQuantities.set(resource, oldQuantity + quantity);
        }
    }

    remove(resource: Resource, quantity: number) {
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

    getResourceList(): Resource[] {
        return Array.from(this.resourceQuantities.keys());
    }
}