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
import { RationalityTech, StructureConstructionTech, SurveyTech } from "../../techtree/TechTree.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import Species from "../../resources/Species.js";

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

        new TileProject(`Construct ${EngineeringLab.tileName}`, EngineeringLab.tileDescription,
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new EngineeringLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 20)],
            [adjacentToRoad],
            [],
        ),

        new TileProject(`Construct ${PsychLab.tileName}`, PsychLab.tileDescription,
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new PsychLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 30)],
            [adjacentToRoad],
            [],
        ),

        new TileProject(`Construct ${XenoLab.tileName}`, XenoLab.tileName,
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new XenoLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 40)],
            [new TileWithinDistancePredicate(3, Ruins), adjacentToRoad, new TechPredicate(SurveyTech)],
            [new TechPredicate(StructureConstructionTech)],
        ),

        new TileProject(`Construct ${AlignmentLab.tileName}`, AlignmentLab.tileDescription,
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new AlignmentLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 40)],
            [new SpeciesPopulationPredicate(Species.Human, 200), adjacentToRoad],
            [new TechPredicate(RationalityTech)],
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
