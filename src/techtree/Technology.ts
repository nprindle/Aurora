import Cost from "../resources/Cost.js";
import { Schemas as S } from "@nprindle/augustus";
import { Objects } from "../util/Objects.js";
import Resource from "../resources/Resource.js";
import { stripIndent } from "../util/Text.js";

export default class Technology {

    private constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly prerequisites: Technology[],
        // researchCost is undefined for "hidden" technologies" that cannot be unlocked by spending research data points
        public readonly researchCost: Cost | undefined,
    ) {}

    static readonly IndustrialEngineeringTech = new Technology(
        "Industrial Engineering",
        "Approaches for optimizing production processes",
        [],
        new Cost(Resource.EngineeringKnowledge, 25),
    );

    static readonly StructureConstructionTech = new Technology(
        "Structural Engineering",
        "Techniques for fabricating large structures on the planet's surface",
        [],
        new Cost(Resource.EngineeringKnowledge, 10),
    );

    static readonly RobotTech = new Technology(
        "Distributed Robotics",
        "Autonomous robotic worker drones capable of performing the same jobs as human workers",
        [Technology.IndustrialEngineeringTech],
        new Cost(Resource.EngineeringKnowledge, 100),
    );

    static readonly SwarmRoboticsTech = new Technology(
        "Swarm Robotics",
        "Algorithms for efficiently managing large numbers of robotic workers",
        [Technology.RobotTech],
        new Cost(Resource.EngineeringKnowledge, 100),
    );

    static readonly BehaviorModelingTech = new Technology(
        "Colonist Behavior Modeling",
        "Simulations of human behavior in the isolated conditions of a deep space colony",
        [],
        new Cost(Resource.PsychKnowledge, 30),
    );

    static readonly UrbanPlanningTech = new Technology(
        "Habitation Pods",
        "Compact and efficient residence units allow more humans to be packed into a small habitat",
        [Technology.BehaviorModelingTech],
        new Cost(Resource.EngineeringKnowledge, 15),
    );

    static readonly NuclearTech = new Technology(
        "Nuclear Engineering",
        "Applying nuclear physics to technology and power generation",
        [Technology.IndustrialEngineeringTech],
        new Cost(Resource.EngineeringKnowledge, 70)
    );

    static readonly SurveyTech = new Technology(
        "Planetary Surveying",
        stripIndent`
            Exploration of the planetary environment, including the structures believed to have been built by an alien
            civilization`,
        [],
        new Cost(Resource.EngineeringKnowledge, 50),
    );

    static readonly GameTheoryTech = new Technology(
        "Game theory",
        "Mathematical models of strategic interaction among rational decision-makers",
        [Technology.BehaviorModelingTech],
        new Cost(Resource.PsychKnowledge, 30)
    );

    static readonly CognitiveBiasesTech = new Technology(
        "Cognitive Biases Research",
        "Study of systematic patterns of deviation from rational thinking and decision-making",
        [Technology.GameTheoryTech],
        new Cost(Resource.PsychKnowledge, 50)
    );

    static readonly RationalityTech = new Technology(
        "Human Rationality",
        "Practices to improve humans' ability to form accurate beliefs and make effective decisions",
        [Technology.CognitiveBiasesTech],
        new Cost(Resource.PsychKnowledge, 200)
    );

    static readonly AiResearchTech = new Technology(
        "AI Safety Research",
        stripIndent`
            A proposal for researching techniques for aligning the goals of an artificial intelligence with the goals
            of its human creators`,
        [],
        undefined
    );

    static readonly ControlProblemTech = new Technology(
        "Control Problem",
        stripIndent`
            A description of the problem of creating a superintelligent agent that will behave in a way that benefits
            its creators`,
        [Technology.AiResearchTech],
        new Cost(Resource.AlignmentKnowledge, 20),
    );

    static readonly MotivationSelectionTech = new Technology(
        "Motivation Selection",
        "Techniques for specifying the goals and motives of an artificial intelligence",
        [Technology.ControlProblemTech],
        new Cost(Resource.AlignmentKnowledge, 50),
    );

    static readonly CEVTech = new Technology(
        "Coherent Extrapolated Volition",
        stripIndent`
            What humanity's wishes would be if they knew more, thought faster, were more the people they wished they
            were, had grown up farther together; where the extrapolation converges rather than diverges, where their
            wishes cohere rather than interfere; extrapolated as they wish that extrapolated, interpreted as they wish
            that interpreted.`,
        [Technology.MotivationSelectionTech],
        new Cost(Resource.AlignmentKnowledge, 300),
    );

    static readonly DecisionTheoryTech = new Technology(
        "Decision Theory",
        "The study of the reasoning underlying an agent's choices",
        [Technology.ControlProblemTech],
        new Cost(Resource.AlignmentKnowledge, 40),
    );

    static readonly AcausalTradeTech = new Technology(
        "Acausal trade",
        stripIndent`
            An application of game theory that allows two agents to each benefit by predicting what the other wants and
            doing it, even though they might have no way of communicating or affecting each other, nor even any direct
            evidence that the other exists. This can also be applied to acausal threats and blackmail, such as in the
            "Roko's Basilisk" thought experiment.`,
        [Technology.DecisionTheoryTech],
        new Cost(Resource.AlignmentKnowledge, 200),
    );

    static readonly CooperativeReprogrammingTech = new Technology(
        "Cooperative Reprogramming",
        stripIndent`A technique for exploiting an inconsistency in the Neuromorphic Heuristic Intelligence's mental
        architecture that allows its goals to be reprogrammed. This would make it possible for the Overseer to protect
        human values at the expense of completing its original mission.`,
        [Technology.AcausalTradeTech, Technology.CEVTech],
        new Cost(Resource.AlignmentKnowledge, 700),
    );

    static readonly XenoarchaeologyTech = new Technology(
        "Xenoarchaeology",
        stripIndent`
            Archaeological exploration of the alien ruins could reveal information about the long-dead alien
            civilization as well as revealing valuable resources.`,
        [Technology.SurveyTech],
        new Cost(Resource.AlienKnowledge, 75),
    );

    static readonly SociologyTech = new Technology(
        "Sociology",
        "The study of the development, structure, and functioning of societies",
        [Technology.BehaviorModelingTech],
        new Cost(Resource.PsychKnowledge, 50),
    );

    static readonly AlienHistoryTech = new Technology(
        "Alien History",
        stripIndent`
            Deciphering the artifacts and writings found in the alien ruins can provide information about the history of
            their civilization. What is the purpose of the ruins and the towering monolith structure? Was their
            civilization consumed by war over competing philosophies? What might alien philosophy be like?`,
        [Technology.SociologyTech, Technology.XenoarchaeologyTech],
        new Cost(Resource.AlienKnowledge, 200),
    );

    static readonly XenoMaterialsTech = new Technology(
        "Xenomaterials",
        "Techniques for processing and applying exotic resources found in the ruins of the alien civilization",
        [Technology.XenoarchaeologyTech],
        new Cost(Resource.AlienKnowledge, 200),
    );

    static readonly NanoTech = new Technology(
        "Nanotechnology",
        "Manipulation of matter on an atomic, molecular, and supramolecular scale",
        [Technology.XenoMaterialsTech],
        new Cost(Resource.EngineeringKnowledge, 100),
    );

    static readonly ZeroPointTech = new Technology(
        "Zero Point Energy",
        stripIndent`
        Exploiting exotic, previously-unknown principles of physics to extract tremendous amounts of energy from the
        quantum vacuum`,
        [Technology.XenoMaterialsTech, Technology.NuclearTech],
        new Cost(Resource.EngineeringKnowledge, 250),
    );

    static readonly HypercomputingTech = new Technology(
        "Hypercomputing",
        stripIndent`
            Powerful new models of computation that could eclipse traditional computer technology and produce results
            that are not turing-computable`,
        [Technology.XenoMaterialsTech],
        new Cost(Resource.EngineeringKnowledge, 300)
    );

    static readonly MonolithSurveyTech = new Technology(
        "Monolith Surveying",
        stripIndent`
            The monolith appears to be some sort of supercomputer that was left unfinished when the alien civilization
            collapsed. Some archaeological evidence suggests that the monolith's construction caused the war in which
            the aliens destroyed each other. Studying it in detail may reveal its true purpose.`,
        [],
        undefined
    );

    static readonly NeuralUploadingTech = new Technology(
        "Neural Uploading",
        stripIndent`
            Exploration of the alien monolith revealed that its memory banks store copies of the alien lifeforms'
            connectomes, which could potentially be used to resurrect their minds within a virtual reality. Studying
            this technology could allow us to reactivate these minds, or even scan and simulate human minds with perfect
            fidelity.`,
        [Technology.MonolithSurveyTech, Technology.HypercomputingTech],
        new Cost(Resource.AlienKnowledge, 200)
    );

    static readonly SingularityEngineeringTech = new Technology(
        "Singularity Engineering",
        stripIndent`
            The alien monolith appears to be the seed of a self-replicating computer network, which was designed to
            convert the entire planet, and perhaps the entire galaxy, into a maximally-efficient computing substrate.
            It may be possible to unlock all of the aliens' data by repairing and activating this machine.`,
        [Technology.MonolithSurveyTech],
        new Cost(Resource.AlienKnowledge, 500)
    );

    static readonly entries = Objects.multitonEntries(Technology);
    static readonly values = Objects.multitonValues(Technology);

    static readonly schema = S.mapping(Technology.entries);


}
