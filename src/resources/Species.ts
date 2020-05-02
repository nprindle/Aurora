import Cost from "./Cost";
import Resource from "./Resource";
import { Objects } from "../util/Objects.js";
import { Schemas as S } from "@nprindle/augustus";

export default class Species {
    // all species instances are defined here
    static readonly Human = new Species("👩🏻‍🚀 Human Colonists", 0.1, new Cost(Resource.Food, 1));
    static readonly Robot = new Species("🦾 Robots", 0, new Cost(Resource.Energy, 0.5));

    private constructor(
        public readonly name: string,
        public readonly growthMultiplier: number, // % increase in population per turn
        public readonly survivalCost: Cost, // resources required per worker to keep workers of this species alive
    ) {}

    static readonly values = Objects.multitonValues(Species);
    static readonly entries = Objects.multitonEntries(Species);

    static readonly schema = S.mapping(Objects.multitonEntries(Species));
}
