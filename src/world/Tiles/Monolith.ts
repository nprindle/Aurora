import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import { MonolithTexture } from "../../UI/Images.js";
import TileProject, { MonolithCompletionProject } from "../../tileProjects/TileProject.js";
import { stripIndent } from "../../util/Text.js";
import AlienSeedCore from "./AlienSeedCore.js";
import AlienCircuits from "./AlienCircuits.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { MonolithSurveyTech, SingularityEngineeringTech } from "../../techtree/TechTree.js";
import NeuralEmulator from "./NeuralEmulator.js";
import NanotechFoundry from "./NanotechFoundry.js";
import { TileWithinDistancePredicate } from "../../predicates/TilePredicates.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";

export default class Monolith extends Tile {
    protected texture: HTMLImageElement = MonolithTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new MonolithCompletionProject(
            "Activate Seed Core",
            stripIndent`
            The alien faction that built the monolith was destroyed by their ideological opponents before they could
            activate the hypercomputing nanotechnology matrix at the heart of the structure. The vast amounts of stored
            information about the aliens, including the digitized connectome scans of the Monolith's creators, can only
            be released by repairing and activating the device.


            Evidence suggests that, once activated, the hypercomputing matrix will expand to absorb all available
            matter in order to provide as much computing power as possible to sustain a virtual world for its
            alien inhabitants.`,
            AlienSeedCore,
            AlienCircuits,
            [
                new Cost(Resource.Energy, 100000)
            ],
            [
                new TileWithinDistancePredicate(3, NanotechFoundry),
                new TileWithinDistancePredicate(2, NeuralEmulator),
                new TechPredicate(SingularityEngineeringTech),
            ],
            [
                new TechPredicate(MonolithSurveyTech)
            ]

        )
    ];

    static readonly tileName: string = "Monolith";
    static readonly tileDescription: string = "A towering alien structure";
    getTileName(): string {
        return Monolith.tileName;
    }
    getTileDescription(): string {
        return Monolith.tileDescription;
    }
}
