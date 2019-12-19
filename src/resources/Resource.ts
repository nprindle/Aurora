export enum Resource {
    energy,
    colonists,
    metal,
}

// typescript doesn't allow enum members to have fields and this is my horrible workaround
class ResourceSpecification {
    constructor(
        public name: string,
    ){}
}

// if you add a new resource you have to write its corrosponding specification here
const resourceSpecifications = new Map<Resource, ResourceSpecification>([
    [Resource.energy, new ResourceSpecification("Energy")],
    [Resource.metal, new ResourceSpecification("Refined Metals")],
    [Resource.colonists, new ResourceSpecification("Human Colonists")],
]);

export namespace Resource {
    // the user-visible name of this resource type
    export function getName(resource: Resource): string {
        let specification: ResourceSpecification =  resourceSpecifications.get(resource)!;
        return specification.name;
    }
}