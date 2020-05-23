import Tile, { TileType, wastelandVariantSchema } from "../Tile.js";
import TileProject from "../../world/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import { LabConstructionTexture } from "../../ui/Images.js";
import Game from "../../Game.js";
import EngineeringLab from "./EngineeringLab.js";
import Resource from "../../resources/Resource.js";
import Cost from "../../resources/Cost.js";
import PsychLab from "./PsychLab.js";
import XenoLab from "./XenoLab.js";
import AlignmentLab from "./AlignmentLab.js";
import Wasteland from "./Wasteland.js";
import Species from "../../resources/Species.js";
import { constructionProject } from "../../world/TileProject.js";
import {
    roadRequirement, techRequirement, speciesPopulationRequirement, nearRuinsOrMonolith
} from "../../queries/DescribedTileQuery.js";
import { hasTech } from "../../queries/Queries.js";
import { Schemas as S } from "@nprindle/augustus";
import Technology from "../../techtree/Technology.js";
import World from "../World.js";

@TileType
export default class ConstructionLaboratory extends Tile {

    constructor(world: World, position: GridCoordinates, private wastelandVariant?: 1 | 2 | 3 | 4 | 5) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return LabConstructionTexture;
    }

    possibleProjects: TileProject[] = [
        new TileProject("Break down construction site", "Revert this location to wasteland",
            (position: GridCoordinates, game: Game) => {
                game.world.placeTile(new Wasteland(this.world, position, this.wastelandVariant));
            }, [], [], [],
        ),

        constructionProject(this.world, EngineeringLab,
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 20)],
            [roadRequirement],
            [],
        ),

        constructionProject(this.world, PsychLab,
            [new Cost(Resource.BuildingMaterials, 30)],
            [roadRequirement],
            [],
        ),

        constructionProject(this.world, XenoLab,
            [new Cost(Resource.BuildingMaterials, 40)],
            [
                nearRuinsOrMonolith(3),
                roadRequirement,
                techRequirement(Technology.Surveying)
            ],
            [],
        ),

        constructionProject(this.world, AlignmentLab,
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 40)],
            [speciesPopulationRequirement(Species.Human, 200), roadRequirement],
            [hasTech(Technology.AiResearch)],
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

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            wastelandVariant: wastelandVariantSchema,
        }),
        (x: ConstructionLaboratory) => ({ position: x.position, wastelandVariant: x.wastelandVariant }),
        (world: World) => ({ position, wastelandVariant }) => new ConstructionLaboratory(world, position, wastelandVariant),
    );
}

