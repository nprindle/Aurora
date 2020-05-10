import { Objects } from "../util/Objects.js";
import { Schemas as S } from "@nprindle/augustus";

export default class Resource {
    // all resource instances are defined here
    static readonly Energy = new Resource("⚡ Energy");
    static readonly Food = new Resource("🌯 Food");
    static readonly Metal = new Resource("⛏ Metal Ore");
    static readonly BuildingMaterials = new Resource("🔩 Construction Parts");
    static readonly Electronics = new Resource("💡 Electronics");

    static readonly Cavorite = new Resource("💎 Cavorite");
    static readonly Orichalcum = new Resource("🧪 Orichalcum");
    static readonly Superconductor = new Resource("🧵 Superconductor");
    static readonly SmartMatter = new Resource("💠 SmartMatter");

    static readonly EngineeringKnowledge = new Resource("⚙️ Engineering Data");
    static readonly PsychKnowledge = new Resource("🧠 Psychological Data");
    static readonly AlienKnowledge = new Resource("🛸 Alien Data");
    static readonly AlignmentKnowledge = new Resource("📎 AI Alignment Data");

    private constructor(
        public readonly name: string,
    ) {}

    static readonly entries = Objects.multitonEntries(Resource);
    static readonly values = Objects.multitonValues(Resource);

    static readonly schema = S.mapping(Resource.entries);
}
