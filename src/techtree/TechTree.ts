import Technology from "./Technology.js";
import Resource from "../resources/Resource.js";
import Cost from "../resources/Cost.js";

export const ResearchableTechnologies: Technology[] = [];

export const IndustrialEngineeringTech = Technology.makeUnlockableTechnology(
    "Industrial Engineering",
    "Approaches for optimizing production processes",
    [],
    new Cost(Resource.EngineeringKnowledge, 25),
);

export const StructureConstructionTech = Technology.makeUnlockableTechnology(
    "Structural Engineering",
    "Techniques for fabricating large structures on the planet's surface",
    [],
    new Cost(Resource.EngineeringKnowledge, 10),
);

export const BehaviorModelingTech = Technology.makeUnlockableTechnology(
    "Colonist Behavior Modeling",
    "Simulations of human behavior in the isolated conditions of a deep space colony",
    [],
    new Cost(Resource.SocialKnowledge, 30),
);

export const UrbanPlanningTech = Technology.makeUnlockableTechnology(
    "Habitation Pods",
    "Compact and efficient residence units allow more humans to be packed into a small habitat",
    [BehaviorModelingTech],
    new Cost(Resource.EngineeringKnowledge, 15),
);
