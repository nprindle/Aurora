import Tile, { TileType, wastelandVariantSchema } from "../Tile.js";
import TileProject from "../../world/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { HabConstructionTexture, } from "../../ui/Images.js";
import Game from "../../Game.js";
import Habitat from "./Habitat.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import Greenhouse from "./Greenhouse.js";
import Arcology from "./Arcology.js";
import Wasteland from "./Wasteland.js";
import { constructionProject } from "../../world/TileProject.js";
import Hydroponics from "./Hydroponics.js";
import { techRequirement, roadRequirement } from "../../queries/DescribedTileQuery.js";
import { hasTech } from "../../queries/Queries.js";
import RobotHive from "./RobotHive.js";
import { Schemas as S } from "@nprindle/augustus";
import Technology from "../../techtree/Technology.js";
import World from "../World.js";

@TileType
export default class ConstructionHabitat extends Tile {

    constructor(world: World, position: GridCoordinates, private wastelandVariant?: 1 | 2 | 3 | 4 | 5 ) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return HabConstructionTexture;
    }

    possibleProjects: TileProject[] = [

        new TileProject("Break down construction site", "Revert this location to wasteland",
            (position: GridCoordinates, game: Game) => {
                game.world.placeTile(new Wasteland(this.world, position, this.wastelandVariant));
            }, [], [], [],
        ),

        constructionProject(this.world, RobotHive,
            [new Cost(Resource.BuildingMaterials, 250), new Cost(Resource.Electronics, 500)],
            [
                techRequirement(Technology.StructuralEngineering),
                techRequirement(Technology.Robotics),
                roadRequirement,
            ],
            [hasTech(Technology.IndustrialEngineering)],
        ),

        constructionProject(this.world, Habitat,
            [new Cost(Resource.BuildingMaterials, 200)],
            [
                techRequirement(Technology.StructuralEngineering),
                roadRequirement,
            ],
            [],
        ),

        constructionProject(this.world, Arcology,
            [new Cost(Resource.BuildingMaterials, 500)],
            [techRequirement(Technology.UrbanPlanning), roadRequirement],
            [hasTech(Technology.StructuralEngineering)],
        ),

        constructionProject(this.world, Greenhouse,
            [new Cost(Resource.BuildingMaterials, 25)],
            [roadRequirement],
            [hasTech(Technology.StructuralEngineering)],
        ),

        constructionProject(this.world, Hydroponics,
            [new Cost(Resource.BuildingMaterials, 25), new Cost(Resource.Electronics, 30)],
            [roadRequirement, techRequirement(Technology.IndustrialEngineering)],
            [hasTech(Technology.StructuralEngineering)]
        ),
    ];

    static readonly tileName: string = "Construction Site - Habitat";
    static readonly tileDescription: string =
        "An area designated for construction of habitation and life support facilities";

    getTileName(): string {
        return ConstructionHabitat.tileName;
    }
    getTileDescription(): string {
        return ConstructionHabitat.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            wastelandVariant: wastelandVariantSchema,
        }),
        (x: ConstructionHabitat) => ({ position: x.position, wastelandVariant: x.wastelandVariant }),
        (world: World) => ({ position, wastelandVariant }) => new ConstructionHabitat(world, position, wastelandVariant),
    );
}

