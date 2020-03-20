import Tile from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { XenoLabTexture } from "../../UI/Images.js";
import TileProject from "../../tileProjects/TileProject.js";
import { MonolithSurveyTech, AlienHistoryTech } from "../../techtree/TechTree.js";
import Game from "../../Game.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { NotTilePredicate, TileWithinDistancePredicate } from "../../predicates/TilePredicates.js";
import Monolith from "./Monolith.js";
import { stripIndent } from "../../util/Text.js";


export default class XenoLab extends Tile {
    protected texture: HTMLImageElement = XenoLabTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        new Conversion(
            [],
            [new Cost(Resource.AlienKnowledge, 10)],
            50,
        ),
    ];

    possibleProjects: TileProject[] = [
        new TileProject(
            "Survey Alien Monolith",
            stripIndent`
                The monolith appears to be some sort of supercomputer that was left unfinished when the alien civilization collapsed.
                Some archaeological evidence suggests that the monolith's construction caused the war in which the aliens destroyed
                each other. Studying it in detail may reveal its true purpose. Completing this project provides the
                "${MonolithSurveyTech.name}" technology.`,
            (position: GridCoordinates, game: Game) => { game.unlockTechnology(MonolithSurveyTech); },
            [new Cost(Resource.AlienKnowledge, 50)],
            [new TileWithinDistancePredicate(5, Monolith)],
            [new TechPredicate(AlienHistoryTech), new NotTilePredicate(new TechPredicate(MonolithSurveyTech))]
        )
    ];

    static readonly tileName: string = "Xenoarchaeology Lab";
    static readonly tileDescription: string = "A laboratory for studying artifacts and technology left by the now-dead alien civilization";
    getTileName(): string {
        return XenoLab.tileName;
    }
    getTileDescription(): string {
        return XenoLab.tileDescription;
    }
}
