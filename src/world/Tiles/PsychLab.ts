import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { PsychLabTexture } from "../../UI/Images.js";
import TileProject from "../../tileProjects/TileProject.js";
import Game from "../../Game.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { CognitiveBiasesTech, RationalityTech, AiResearchTech } from "../../techtree/TechTree.js";
import { NotTilePredicate } from "../../predicates/TilePredicates.js";


export default class PsychLab extends Tile {
    protected texture: HTMLImageElement = PsychLabTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        new Conversion(
            [],
            [new Cost(Resource.PsychKnowledge, 10)],
            25,
        ),
    ];

    possibleProjects = [
        new TileProject(
            "AI Safety Research Proposal",
            "A human researcher wants to start a project with the goal of aligning artificial intelligence to serve human goals. If approved, this line of research risks mission failure, since if the overseer allowed itself to be reprogrammed it would no longer pursue the mission of uncovering information about the aliens at all costs.",
            (position: GridCoordinates, game: Game) => game.unlockTechnology(AiResearchTech),
            [],
            [new TechPredicate(RationalityTech)],
            [new TechPredicate(CognitiveBiasesTech), new NotTilePredicate(new TechPredicate(AiResearchTech))]
        )
    ];

    static readonly tileName: string = "Psychology Lab";
    static readonly tileDescription: string = "A laboratory for studying how humans behave in the isolated conditions of a remote colony";
    getTileName(): string {
        return PsychLab.tileName;
    }
    getTileDescription(): string {
        return PsychLab.tileDescription;
    }
}
