import Resource from "./Resource";

export default class Cost {
    constructor(
        public resource: Resource,
        public quantity: number
    ){}
}