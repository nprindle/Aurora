import Resource from "./Resource";

export default class Cost {
    constructor(
        public resource: Resource,
        public quantity: number
    ){}

    toString() {
        return `${this.resource.name} x${this.quantity}`;
    }
}
