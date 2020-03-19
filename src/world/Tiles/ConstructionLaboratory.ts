import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { LabConstructionTexture } from "../../UI/Images.js";
import Game from "../../Game.js";
import EngineeringLab from "./EngineeringLab.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import PsychLab from "./PsychLab.js";
import XenoLab from "./XenoLab.js";
import AlignmentLab from "./AlignmentLab.js";
import Wasteland from "./Wasteland.js";
import { TileWithinDistancePredicate, SpeciesPopulationPredicate, adjacentToRoad } from "../../predicates/TilePredicates.js";
import Ruins from "./Ruins.js";
import { SurveyTech, AiResearchTech } from "../../techtree/TechTree.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import Species from "../../resources/Species.js";
import { constructionProject } from "../../tileProjects/TileProject.js";

export default class ConstructionLaboratory extends Tile {

    protected texture: HTMLImageElement = LabConstructionTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Break down construction site", "Revert this location to wasteland",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Wasteland(position));
            }, [], [], [],
        ),

        constructionProject(EngineeringLab,
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 20)],
            [adjacentToRoad],
            [],
        ),

        constructionProject(PsychLab,
            [new Cost(Resource.BuildingMaterials, 30)],
            [adjacentToRoad],
            [],
        ),

        constructionProject(XenoLab,
            [new Cost(Resource.BuildingMaterials, 40)],
            [new TileWithinDistancePredicate(3, Ruins), adjacentToRoad, new TechPredicate(SurveyTech)],
            [],
        ),

        constructionProject(AlignmentLab,
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 40)],
            [new SpeciesPopulationPredicate(Species.Human, 200), adjacentToRoad],
            [new TechPredicate(AiResearchTech)],
        ),
    ];

    static readonly tileName: string = "Construction Site - Laboratories";
    static readonly tileDescription: string = "An area designated for construction of research laboratories";
    getTileName(): string {
        return ConstructionLaboratory.tileName;
    }
    getTileDescription(): string {
        return ConstructionLaboratory.tileDescription;
    }
}
