import Tile, { TileType } from "../Tile.js";
import TileProject from "../../world/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Species from "../../resources/Species.js";
import Game from "../../Game.js";
import Habitat from "./Habitat.js";
import MiningFacility from "./MiningFacility.js";
import SolarPanels from "./SolarArray.js";
import { LanderTexture } from "../../ui/Images.js";
import Resource from "../../resources/Resource.js";
import Greenhouse from "./Greenhouse.js";
import Road from "./Road.js";
import { stripIndent } from "../../util/Text.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../World.js";

@TileType
export default class Lander extends Tile {

    constructor(world: World, position: GridCoordinates) {
        super(world, position);
    }

    getTexture(): HTMLImageElement {
        return LanderTexture;
    }

    possibleProjects: TileProject[] = [
        new TileProject(
            "Unpack Lander", "Unload colonists and deploy prefabricated colonial buildings",
            (position: GridCoordinates, game: Game) => {
                const world = game.world;

                // place colony buildings
                world.placeTile(new Habitat(this.world, new GridCoordinates(position.x + 1, position.y)));
                world.placeTile(new SolarPanels(this.world, new GridCoordinates(position.x + 1, position.y - 1)));
                world.placeTile(new Greenhouse(this.world, new GridCoordinates(position.x - 1, position.y)));
                world.placeTile(new MiningFacility(this.world, new GridCoordinates(position.x - 1, position.y - 1)));
                world.placeTile(new Road(this.world, new GridCoordinates(position.x, position.y - 1)));
                world.placeTile(new Road(this.world, position));
                world.placeTile(new Road(this.world, new GridCoordinates(position.x, position.y + 1)));

                // provide initial supplies
                game.inventory.addResource(Resource.Food, 1000);

                // create initial population
                game.inventory.addWorkers(Species.Human, 100);
                // make workers available on first turn
                game.inventory.releaseWorkers();
            },
            [],
            [],
            [],
        ),
    ];

    static readonly tileName: string = "Landing Pod";
    static readonly tileDescription: string = stripIndent`
        A spacecraft responsible for the final entry-descent-landing phase of the interstellar journey;
        not equipped to ascend back to space`;
    getTileName(): string {
        return Lander.tileName;
    }
    getTileDescription(): string {
        return Lander.tileDescription;
    }

    static readonly schema = S.injecting(
        S.recordOf({ position: GridCoordinates.schema }),
        (x: Lander) => ({ position: x.position }),
        (world: World) => ({ position }) => new Lander(world, position)
    );
}

