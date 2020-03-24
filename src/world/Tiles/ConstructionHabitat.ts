import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { HabConstructionTexture, } from "../../UI/Images.js";
import Game from "../../Game.js";
import Habitat from "./Habitat.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import { StructureConstructionTech, UrbanPlanningTech, IndustrialEngineeringTech, } from "../../techtree/TechTree.js";
import Greenhouse from "./Greenhouse.js";
import Arcology from "./Arcology.js";
import Wasteland from "./Wasteland.js";
import { constructionProject } from "../../tileProjects/TileProject.js";
import Hydroponics from "./Hydroponics.js";
import { techRequirement, roadRequirement } from "../../predicates/DescribedTilePredicate.js";
import { hasTech } from "../../predicates/predicates.js";

export default class ConstructionHabitat extends Tile {

    protected texture: HTMLImageElement = HabConstructionTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [

        new TileProject("Break down construction site", "Revert this location to wasteland",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Wasteland(position));
            }, [], [], [],
        ),

        constructionProject(Habitat,
            [new Cost(Resource.BuildingMaterials, 100)],
            [
                techRequirement(StructureConstructionTech),
                roadRequirement,
            ],
            [],
        ),

        constructionProject(Arcology,
            [new Cost(Resource.BuildingMaterials, 250)],
            [techRequirement(UrbanPlanningTech), roadRequirement],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(Greenhouse,
            [new Cost(Resource.BuildingMaterials, 25)],
            [roadRequirement],
            [hasTech(StructureConstructionTech)],
        ),

        constructionProject(Hydroponics,
            [new Cost(Resource.BuildingMaterials, 25), new Cost(Resource.Electronics, 30)],
            [roadRequirement, techRequirement(IndustrialEngineeringTech)],
            [hasTech(StructureConstructionTech)]
        ),
    ];

    static readonly tileName: string = "Construction Site - Habitat";
    static readonly tileDescription: string = "An area designated for construction of habitation and life support facilities";
    getTileName(): string {
        return ConstructionHabitat.tileName;
    }
    getTileDescription(): string {
        return ConstructionHabitat.tileDescription;
    }
}
