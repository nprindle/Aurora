import { Objects } from "../util/Objects.js";
import { Schemas as S } from "../serialize/Schema.js";
import Game from "../Game.js";
import Lander from "../world/Tiles/Lander.js";
import Hydroponics from "../world/Tiles/Hydroponics.js";
import { HumanEnding, AlienEnding } from "../quests/Quests.js";
import Species from "../resources/Species.js";
import AlienSeedCore from "../world/Tiles/AlienSeedCore.js";
import HumanSeedCore from "../world/Tiles/HumanSeedCore.js";
import HumanMonolith from "../world/Tiles/HumanMonolith.js";
import { AiResearchTech } from "../techtree/TechTree.js";
import Recycler from "../world/Tiles/Recycler.js";

export default class Achievement {


    static readonly StartAchievement = new Achievement(
        "🚀", "One Small Step",
        "You deployed a colony on the surface of Aurora",
        (game: Game) => !game.world.getTiles().some(tile => tile instanceof Lander),
    );
    static readonly ExcavationPointAchievement = new Achievement(
        "💎", "Grave Robber",
        `You looted the alien ruins for valuable resources`,
        (game: Game) => game.world.getTiles().some(tile => tile instanceof Recycler),
    );
    static readonly FoodAchievement = new Achievement(
        "🌯", "Burritos are just monads in the category of enchiladafunctors",
        `You built a ${Hydroponics.tileName}`,
        (game: Game) => game.world.getTiles().some(tile => tile instanceof Hydroponics),
    );
    static readonly KillHumansAchievement = new Achievement(
        "💀", "Fully Automated",
        "You allowed all of the human colonists to die",
        (game: Game) => (
            game.inventory.getPopulation(Species.Human) === 0)
            && !game.world.getTiles().some(
                tile => tile instanceof Lander
                || tile instanceof AlienSeedCore
                || tile instanceof HumanSeedCore
                || tile instanceof HumanMonolith
            ),
    );
    static readonly SafetyProjectAchievement = new Achievement(
        "🖇️", "Fable of the Sparrows",
        "You approved the AI Safety Research Project",
        (game: Game) => game.hasUnlockedTechnology(AiResearchTech)
    );
    static readonly AlienEndingAchievement = new Achievement(
        "👾", "Mission Accomplished",
        "You discovered as much as possible about the aliens by freeing them to conquer the universe",
        (game: Game) => !!game.getQuestEndState()?.equals(AlienEnding),
    );
    static readonly TrueEndingAchievement = new Achievement(
        "🌌", "We'll make Heaven a place on Earth",
        "You uplifted humanity into a virtual utopia",
        (game: Game) => !!game.getQuestEndState()?.equals(HumanEnding),
    );

    // the constructor is private because the resources defined as static members above should be the only possible instances
    private constructor(
        readonly emoji: string,
        readonly title: string,
        readonly description: string,
        readonly requirement: (game: Game) => boolean,
    ) {}

    // returns a list of all species instances
    static values(): Achievement[] {
        return Objects.safeKeys(Achievement)
            .map(k => Achievement[k])
            .filter((v): v is Achievement => v instanceof Achievement);
    }

    static entries(): Record<string, Achievement> {
        const acc: Record<string, Achievement> = {};
        Objects.safeEntries(Achievement)
            .filter((t): t is [keyof typeof Achievement, Achievement] => t[1] instanceof Achievement)
            .forEach(([k, v]) => { acc[k] = v; });
        return acc;
    }

    static schema = S.mapping(Achievement.entries());
}
