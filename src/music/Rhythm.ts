import { Random } from "../util/Random.js";
import { NonEmptyArray, Arrays } from "../util/Arrays.js";

export default class Rhythm {

    subdivision: number[];
    private _beats: number;
    // valid numbers to group beats into
    private static readonly divisions: number[] = [2, 3];

    constructor(beats: number = 8) {
        this.subdivision = [];
        this._beats = beats;
        this.generateNewSubdivision(beats);
    }

    get beats(): number {
        return this._beats;
    }

    // combine subdivisions at random
    generateTies(): number[] {
        let i: number = 0;
        const r: number[] = [];
        while (i < this.subdivision.length) {
            if (i < this.subdivision.length - 1 && Random.bool(0.5)) {
                r.push(this.subdivision[i] + this.subdivision[i + 1]);
                i += 2;
            } else {
                r.push(this.subdivision[i]);
                i++;
            }
        }
        return r;
    }

    generateNewSubdivision(beats: number): void {
        this._beats = beats;
        this.subdivision = [];
        const min: number = Math.min(...Rhythm.divisions);
        while (beats >= min) {
            const validDivisions = Rhythm.divisions.filter(num => num <= beats) as NonEmptyArray<number>;
            // beats must be larger than the minimum division, so this will
            // always be nonempty; the loop will always terminate
            if (Arrays.isNonEmpty(validDivisions)) {
                const currentDivision = Random.fromArray(validDivisions);
                beats -= currentDivision;
                this.subdivision.push(currentDivision);
            }
        }
        if (beats > 0) {
            this.subdivision.push(beats);
        }
    }

}
