import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Species from "../../resources/Species.js";
import Housing from "../../resources/Housing.js";
import { ArcologyTexture } from "../../UI/Images.js";
import Game from "../../Game.js";
import { AiResearchTech, RationalityTech, CognitiveBiasesTech } from "../../techtree/TechTree.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { NotTilePredicate, SpeciesPopulationPredicate } from "../../predicates/TilePredicates.js";
import TileProject from "../../tileProjects/TileProject.js";
import { stripIndent } from "../../util/Text.js";

export default class Arcology extends Tile {

    protected texture: HTMLImageElement = ArcologyTexture;

    populationCapacity: Housing = new Housing(Species.Human, 2000);

    possibleProjects = [
        new TileProject(
            "AI Safety Research Proposal",
            stripIndent`
            A human colonist wants to start a project with the goal of aligning artificial intelligence to serve human goals.

            If approved, this line of research risks mission failure, since if the overseer allowed itself to be reprogrammed it would
            no longer pursue the mission of uncovering information about the aliens at all costs.`,
            (position: GridCoordinates, game: Game) => game.unlockTechnology(AiResearchTech),
            [],
            [new TechPredicate(RationalityTech)],
            [
                new TechPredicate(CognitiveBiasesTech),
                new NotTilePredicate(new TechPredicate(AiResearchTech)),
                new SpeciesPopulationPredicate(Species.Human, 500),
            ]
        )
    ];

    constructor(position: GridCoordinates) {
        super(position);
    }

    static readonly tileName: string = "Arcology";
    static readonly tileDescription: string = "A self-contained habitat for efficiently housing a large number of humans";
    getTileName(): string {
        return Arcology.tileName;
    }
    getTileDescription(): string {
        return Arcology.tileDescription;
    }
}
