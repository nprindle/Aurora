import Tile, { TileType } from "../Tile.js";
import GridCoordinates from "../GridCoordinates.js";
import Species from "../../resources/Species.js";
import Housing from "../../resources/Housing.js";
import { HabitatTexture } from "../../ui/Images.js";
import { Schemas as S } from "@nprindle/augustus";
import { safetyProject } from "../../quests/SafetyProject.js";
import World from "../World.js";

@TileType
export default class Habitat extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return HabitatTexture;
    }

    static populationCapacity: Housing = new Housing(Species.Human, 200);
    populationCapacity: Housing = Habitat.populationCapacity;

    possibleProjects = [
        safetyProject
    ];

    static readonly tileName: string = "Habitat Dome";
    static readonly tileDescription: string =
        "A pressurized structure that provides housing, services, and life support for humans";

    getTileName(): string {
        return Habitat.tileName;
    }
    getTileDescription(): string {
        return Habitat.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({
            position: GridCoordinates.schema,
            populationCapacity: Housing.schema
        }),
        (x: Habitat) => ({
            position: x.position,
            populationCapacity: x.populationCapacity,
        }),
        (world: World) => ({ position, populationCapacity }) => {
            const h = new Habitat(world, position);
            h.populationCapacity = populationCapacity;
            return h;
        }
    );
}

