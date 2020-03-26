import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { IndustryConstructionTexture, } from "../../UI/Images.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import MiningFacility from "./MiningFacility.js";
import Mountain from "./Mountain.js";
import SolarPanels from "./SolarArray.js";
import NuclearPlant from "./NuclearPlant.js";
import Wasteland from "./Wasteland.js";
import { StructureConstructionTech, NuclearTech, IndustrialEngineeringTech, RobotTech, XenoarchaeologyTech,
    XenoMaterialsTech, ZeroPointTech } from "../../techtree/TechTree.js";
import RobotHive from "./RobotHive.js";
import { constructionProject } from "../../tileProjects/TileProject.js";
import ConstructionFactory from "./ConstructionFactory.js";
import ElectronicsFactory from "./ElectronicsFactory.js";
import XenoFactory from "./XenoFactory.js";
import ZeroPointPlant from "./ZeroPointPlant.js";
import { techRequirement, roadRequirement, tileWithinDistanceRequirement } from "../../predicates/DescribedTilePredicate.js";
import { hasTech } from "../../predicates/predicates.js";

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

        constructionProject(SolarPanels,
            [new Cost(Resource.Electronics, 200)],
            [],
            [],
        ),

        constructionProject(RobotHive,
            [new Cost(Resource.BuildingMaterials, 250), new Cost(Resource.Electronics, 500)],
            [
                techRequirement(StructureConstructionTech),
                techRequirement(RobotTech),
                roadRequirement,
            ],
            [hasTech(IndustrialEngineeringTech)],
        ),

        constructionProject(MiningFacility,
            [new Cost(Resource.Energy, 100), new Cost(Resource.BuildingMaterials, 100)],
            [roadRequirement, techRequirement(IndustrialEngineeringTech)],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(ConstructionFactory,
            [new Cost(Resource.BuildingMaterials, 350)],
            [roadRequirement, techRequirement(IndustrialEngineeringTech)],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(ElectronicsFactory,
            [new Cost(Resource.BuildingMaterials, 300), new Cost(Resource.Electronics, 150)],
            [roadRequirement, techRequirement(IndustrialEngineeringTech)],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(XenoFactory,
            [new Cost(Resource.BuildingMaterials, 200), new Cost(Resource.Electronics, 200), new Cost(Resource.Energy, 1000)],
            [roadRequirement, techRequirement(XenoMaterialsTech)],
            [hasTech(XenoarchaeologyTech)],
        ),

        constructionProject(NuclearPlant,
            [new Cost(Resource.BuildingMaterials, 100), new Cost(Resource.Electronics, 100)],
            [techRequirement(NuclearTech), roadRequirement],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(ZeroPointPlant,
            [new Cost(Resource.BuildingMaterials, 200), new Cost(Resource.Electronics, 100), new Cost(Resource.Superconductor, 1000)],
            [techRequirement(ZeroPointTech)],
            [hasTech(XenoarchaeologyTech)],
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
