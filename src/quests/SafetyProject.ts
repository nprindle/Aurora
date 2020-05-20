import TileProject from "../world/TileProject";
import GridCoordinates from "../world/GridCoordinates";
import Game from "../Game";
import { techRequirement } from "../queries/DescribedTileQuery";
import { hasTech, notQuery, speciesHasPopulation } from "../queries/Queries";
import Species from "../resources/Species";
import { stripIndent } from "../util/Text";
import Technology from "../techtree/Technology";

// completing this action reveals the hidden "AI Alignment" technology tree that leads to the alternate ending
export const safetyProject: TileProject = new TileProject(
    "AI Safety Research Proposal",
    stripIndent`
    A human colonist wants to start a project with the goal of aligning artificial intelligence to serve human
    goals.

    If approved, this line of research risks mission failure, since if the overseer allowed itself to be
    reprogrammed it would no longer pursue the mission of uncovering information about the aliens at all
    costs.`,
    (position: GridCoordinates, game: Game) => game.unlockTechnology(Technology.AiResearchTech),
    [],
    [techRequirement(Technology.RationalityTech)],
    [
        hasTech(Technology.CognitiveBiasesTech),
        notQuery(hasTech(Technology.AiResearchTech)),
        speciesHasPopulation(Species.Human, 500),
    ]
);
