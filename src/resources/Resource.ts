export default class Resource {
    // define all resources here
    static readonly Energy = new Resource("Energy");
    static readonly Colonists = new Resource("Human Colonists");
    static readonly Metal = new Resource("Metals");
    static readonly BuildingMaterials = new Resource("Construction Materials");

    // the constructor is private because the resources defined as static members above should be the only possible instances
    private constructor(
        public readonly name: string,
    ){}

    // returns a list of all resource instances
    static values(): Resource[] {
        return Object.keys(Resource).map((k: string) => ((Resource as { [key: string]: any})[k] as Resource));
    }
}