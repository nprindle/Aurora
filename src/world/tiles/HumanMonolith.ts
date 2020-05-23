import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { HumanMonolithTexture } from "../../ui/Images.js";
import { stripIndent } from "../../util/Text.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import HumanCircuits from "./HumanCircuits.js";
import HumanSeedCore from "./HumanSeedCore.js";
import NeuralEmulator from "./NeuralEmulator.js";
import NanotechFoundry from "./NanotechFoundry.js";
import { techRequirement, tileWithinDistanceRequirement } from "../../queries/DescribedTileQuery.js";
import { Schemas as S } from "@nprindle/augustus";
import Technology from "../../techtree/Technology.js";
import TileProject from "../TileProject.js";
import { MonolithCompletionProject } from "../../quests/MonolithCompletionProject.js";
import World from "../World.js";

@TileType
export default class HumanMonolith extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return HumanMonolithTexture;
    }

    possibleProjects: TileProject[] = [
        new MonolithCompletionProject(
            this.world,
            "Activate Seed Core",
            stripIndent`
            Evidence suggests that, once activated, the hypercomputing matrix will expand to absorb all available
            matter in order to provide as much computing power as possible to sustain a virtual world for its
            inhabitants. It once contained the uploaded minds of its alien designers, but now that it has been
            reprogrammed with the connectomes of human colonists, it should produce a virtual reality utopia optimized
            for the flourishing of humans rather than aliens.`,
            HumanSeedCore,
            HumanCircuits,
            [
                new Cost(Resource.Energy, 100000)
            ],
            [
                tileWithinDistanceRequirement(NanotechFoundry, 3),
                tileWithinDistanceRequirement(NeuralEmulator, 2),
                techRequirement(Technology.SingularityEngineering),
            ],
            []
        )
    ];

    static readonly tileName: string = "Reprogrammed Monolith";
    static readonly tileDescription: string = stripIndent`
        A towering alien structure; the hypercomputing matrix contained with in it has been reprogrammed, and the alien
        data it once held has been replaced with the scanned connectomes of human colonists.`;
    getTileName(): string {
        return HumanMonolith.tileName;
    }
    getTileDescription(): string {
        return HumanMonolith.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: HumanMonolith) => ({ position: x.position }),
        (world: World) => ({ position }) => new HumanMonolith(world, position)
    );
}

