import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Species from "../../resources/Species.js";
import Housing from "../../resources/Housing.js";
import { ArcologyTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { safetyProject } from "../../quests/SafetyProject.js";
import World from "../World.js";

@TileType
export default class Arcology extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return ArcologyTexture;
    }

    populationCapacity: Housing = new Housing(Species.Human, 2000);

    possibleProjects = [
        safetyProject
    ];

    static readonly tileName: string = "Arcology";
    static readonly tileDescription: string =
        "A self-contained habitat for efficiently housing a large number of humans";

    getTileName(): string {
        return Arcology.tileName;
    }
    getTileDescription(): string {
        return Arcology.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            populationCapacity: Housing.schema,
        }),
        (x: Arcology) => ({
            position: x.position,
            populationCapacity: x.populationCapacity,
        }),
        (world: World) => ({ position, populationCapacity }) => {
            const r = new Arcology(world, position);
            r.populationCapacity = populationCapacity;
            return r;
        }
    );
}

