import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { IndustryConstructionTexture } from "../../UI/Images.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import { TileWithinDistancePredicate, adjacentToRoad } from "../../predicates/TilePredicates.js";
import MiningFacility from "./MiningFacility.js";
import Mountain from "./Mountain.js";
import SolarPanels from "./SolarArray.js";
import NuclearPlant from "./NuclearPlant.js";
import Wasteland from "./Wasteland.js";
import { StructureConstructionTech, NuclearTech, IndustrialEngineeringTech, RobotTech, XenoarchaeologyTech, XenoMaterialsTech, ZeroPointTech, MonolithSurveyTech, NanoTech } from "../../techtree/TechTree.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import RobotHive from "./RobotHive.js";
import { constructionProject } from "../../tileProjects/TileProject.js";
import ConstructionFactory from "./ConstructionFactory.js";
import ElectronicsFactory from "./ElectronicsFactory.js";
import XenoFactory from "./XenoFactory.js";
import NanotechFoundry from "./NanotechFoundry.js";
import Monolith from "./Monolith.js";
import ZeroPointPlant from "./ZeroPointPlant.js";

export default class ConstructionIndustry extends Tile {

    protected texture: HTMLImageElement = IndustryConstructionTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }



    possibleProjects: TileProject[] = [
        new TileProject("Break down construction site", "Revert this location to wasteland",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Wasteland(position));
            }, [], [], [],
        ),

        constructionProject(RobotHive,
            [new Cost(Resource.BuildingMaterials, 250), new Cost(Resource.Electronics, 500)],
            [
                new TechPredicate(StructureConstructionTech),
                new TechPredicate(RobotTech),
                adjacentToRoad,
            ],
            [new TechPredicate(IndustrialEngineeringTech)],
        ),

        constructionProject(SolarPanels,
            [new Cost(Resource.Electronics, 200)],
            [],
            [],
        ),

        constructionProject(MiningFacility,
            [new Cost(Resource.Energy, 200), new Cost(Resource.Metal, 300)],
            [new TileWithinDistancePredicate(5, Mountain), adjacentToRoad, new TechPredicate(IndustrialEngineeringTech)],
            [new TechPredicate(StructureConstructionTech)],
        ),

        constructionProject(ConstructionFactory,
            [new Cost(Resource.BuildingMaterials, 350)],
            [adjacentToRoad, new TechPredicate(IndustrialEngineeringTech)],
            [new TechPredicate(StructureConstructionTech)],
        ),

        constructionProject(ElectronicsFactory,
            [new Cost(Resource.BuildingMaterials, 300), new Cost(Resource.Electronics, 150)],
            [adjacentToRoad, new TechPredicate(IndustrialEngineeringTech)],
            [new TechPredicate(StructureConstructionTech)],
        ),

        constructionProject(XenoFactory,
            [new Cost(Resource.BuildingMaterials, 200), new Cost(Resource.Electronics, 200), new Cost(Resource.Energy, 1000)],
            [adjacentToRoad, new TechPredicate(XenoMaterialsTech)],
            [new TechPredicate(XenoarchaeologyTech)],
        ),

        constructionProject(NuclearPlant,
            [new Cost(Resource.BuildingMaterials, 100), new Cost(Resource.Electronics, 100)],
            [new TechPredicate(NuclearTech), adjacentToRoad],
            [new TechPredicate(StructureConstructionTech)],
        ),

        constructionProject(ZeroPointPlant,
            [new Cost(Resource.BuildingMaterials, 200), new Cost(Resource.Electronics, 100), new Cost(Resource.Superconductor, 1000)],
            [new TechPredicate(ZeroPointTech)],
            [new TechPredicate(XenoarchaeologyTech)],
        ),

        constructionProject(NanotechFoundry,
            [new Cost(Resource.SmartMatter, 1000), new Cost(Resource.BuildingMaterials, 500), new Cost(Resource.Electronics, 200)],
            [adjacentToRoad, new TileWithinDistancePredicate(3, Monolith), new TechPredicate(NanoTech)],
            [new TechPredicate(MonolithSurveyTech)],
        ),
    ];

    static readonly tileName: string = "Construction Site - Industry";
    static readonly tileDescription: string = "An area designated for construction of industrial facilities and infrastructure";
    getTileName(): string {
        return ConstructionIndustry.tileName;
    }
    getTileDescription(): string {
        return ConstructionIndustry.tileDescription;
    }
}
