import { Schemas as S } from "@nprindle/augustus";

export default class Ending {
    constructor(
        readonly title: string,
        readonly description: string,
    ) { }

    equals(other: Ending): boolean {
        return other.description === this.description && other.title === this.title;
    }

    static readonly schema = S.classOf({
        title: S.aString,
        description: S.aString,
    }, ({ title, description }) => new Ending(title, description));
}
