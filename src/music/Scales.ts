import { mod } from "../util/Util.js";
import { Arrays } from "../util/Arrays.js";
import { Newtype, newtype, unwrap } from "../util/Newtypes.js";

/**
 * Describe the degrees in a scale, encoded in Ian Ring's format as a 12-bit bit
 * vector. If the `i`th 1 (from the LSB) is at bit `1 << n`, then the `i`th
 * degree of the scale is `n` semitones up from the root.
 *
 * Example: the major scale is `0b101010110101`
 */
export type Scale = Newtype<number, { readonly _: unique symbol; }>;
export const Scale = newtype<Scale>();

/**
 * A 'Chord' is a subset of a 'Scale', encoded in the same bit vector
 * representation.
 */
export type Chord = Newtype<number, { readonly _: unique symbol; }>;
export const Chord = newtype<Chord>();

/**
 * An index of a note into the traditional 12-tone chromatic scale
 * relative to C. For example: C = 0, C# = 1, F = 6, and so on. Note that a
 * 'Pitch' does not indicate an absolute note by itself; you must turn it into a
 * 'MidiNumber' by assigning it relative to a given octave. These can also be
 * outside of 0-11; mod by 12 to normalize. Note that a 'Pitch' plus a
 * 'PitchOffset' is a new Pitch.
 *
 * Example: E has a 'Pitch' of 4.
 */
export type Pitch = Newtype<number, { readonly _: unique symbol; }>;
export const Pitch = newtype<Pitch>();

/**
 * An offset from some pitch, measured in semitones. Used to describe pitches in
 * a scale relative to the root. A group of 'PitchOffset's is referred to as a
 * "pitch class".
 *
 * Example: E, relative to a D, has a 'PitchOffset' of 2.
 */
export type PitchOffset = Newtype<number, { readonly _: unique symbol; }>;
export const PitchOffset = newtype<PitchOffset>();

/**
 * Apply a semitone offset to a base pitch to produce a new pitch. The resulting
 * pitch is not guaranteed to be normalized to the 0-11 range.
 */
export function offsetPitch(base: Pitch, offset: PitchOffset): Pitch {
    return Pitch(unwrap(base) + unwrap(offset));
}

/**
 * An index into a list of notes in a scale.
 *
 * Example: A G in a C major scale would have a 'Degree' of 4.
 */
export type Degree = Newtype<number, { readonly _: unique symbol; }>;
export const Degree = newtype<Degree>();

export interface ScaleQuery {
    // allowed range for number of imperfections (inclusive)
    imperfections?: [number, number];
    // allowed range for number of hemitones (inclusive)
    hemitones?: [number, number];
    // chord that the scale must contain
    chord?: Chord;
    // allowed range for number of notes in the scale (inclusive)
    notes?: [number, number];
}

export namespace Scales {

    export function createScaleFromPitchClass(pitches: PitchOffset[]): Scale {
        if (!pitches.includes(PitchOffset(0))) {
            throw new Error("scales must have a root");
        }
        const vec = pitches
            .map(pitch => 1 << mod(unwrap(pitch), 12)) // mod by 12 to fit into octave
            .filter((val, i, arr) => arr.indexOf(val) === i) // remove duplicates
            .reduce((acc, curr) => acc | curr, 0); // combine into final bit vector
        return Scale(vec);
    }

    // turns a scale into the set of pitches from the root
    // i.e., the scale 2^7 + 2^6 + 2^5 + 2^0 becomes [0, 5, 6, 7]
    export function getPitchClass(scale: Scale): PitchOffset[] {
        const r = [];
        let vec = unwrap(scale);
        for (let i = 0; vec !== 0; vec >>>= 1, i++) {
            if (vec & 1) {
                r.push(PitchOffset(i));
            }
        }
        return r;
    }

    export function getNumberOfNotes(scale: Scale): number {
        return getPitchClass(scale).length;
    }

    // Rotate a scale left if amount is positive and right if amount is negative
    export function rotateScale(scale: Scale, amount: number = 1): Scale { // courtesy of nprindle
        const vec = unwrap(scale);
        amount = mod(amount, 12); // ensure we only rotate as much as we need to
        const value = vec << amount | vec >>> (12 - amount);
        return Scale(value & 0xFFF); // mask to make sure it's still a 12-bit vector
    }

    export function hasRoot(scale: Scale): boolean {
        return (unwrap(scale) & 1) !== 0;
    }

    export function getModes(scale: Scale): Scale[] {
        const r: Scale[] = [];
        let curr: Scale = scale;
        do {
            if (hasRoot(curr)) { // only add proper scales - i.e., ones with roots
                r.push(curr);
            }
            curr = rotateScale(curr, 1); // advance to the next mode
        } while (curr !== scale); // once we return to the original scale we're done
        return r;
    }

    export function hasInterval(scale: Scale, semitones: number): boolean {
        semitones = mod(semitones, 12);
        return (unwrap(scale) & (1 << semitones)) !== 0; // if the semitones-th bit is set, the scale contains a given interval
    }

    // count the instances of a particular interval in a scale
    // useful for counting tritonia / hemitonia / etc.
    export function countInterval(scale: Scale, semitones: number): number {
        semitones = mod(semitones, 12);
        const count: number = getModes(scale) // starting from each note in the scale...
            .filter(mode => hasInterval(mode, semitones)).length; // count all the notes with a note N semitones above them
        if (semitones === 6) { // special case (tritones get counted twice since they're symmetrical)
            return count / 2;
        }
        return count;
    }

    // count how many notes in the scale lack a perfect fifth above them
    export function getImperfections(scale: Scale): number {
        return getModes(scale).filter(mode => !hasInterval(mode, 7)).length;
    }

    export function containsScale(parent: Scale, child: Scale): boolean {
        return (unwrap(parent) & unwrap(child)) === unwrap(child);
    }

    export function containsChord(scale: Scale, chord: Chord): boolean {
        return (unwrap(scale) & unwrap(chord)) === unwrap(chord);
    }

    const scales: Scale[] = Arrays.flatten([
        getModes(Scale(0xab5)), // major
        getModes(Scale(0x9ab)), // neapolitan minor
        getModes(Scale(0x557)), // leading whole-tone inverse
        getModes(Scale(0x9ad)), // harmonic minor
        getModes(Scale(0x9b5)), // harmonic major
        getModes(Scale(0xaad)), // melodic minor
        getModes(Scale(0xa6d)), // Jeths' mode
        getModes(Scale(0x9b3)), // double harmonic major
    ]);

    // TODO: this can be made more efficient by caching modes.
    // see if that's worthwhile.
    export function matchesQuery(scale: Scale, query: ScaleQuery): boolean {
        const outOfBounds = (val: number, range: [number, number]): boolean => {
            return (val < range[0]) || (val > range[1]);
        };
        if (query.notes && outOfBounds(getNumberOfNotes(scale), query.notes)) {
            return false;
        }
        if (query.imperfections && outOfBounds(getImperfections(scale), query.imperfections)) {
            return false;
        }
        if (query.hemitones && outOfBounds(countInterval(scale, 1), query.hemitones)) {
            return false;
        }
        // Any scale will contain the scale 0. (This is similar to how the empty set is a subset of any set.)
        // In that case it's sensible / slightly more efficient to skip the check if query.chord is 0.
        if (query.chord !== undefined && unwrap(query.chord) !== 0 && !containsChord(scale, query.chord)) {
            return false;
        }
        return true;
    }

    export function getAllScalesMatchingQuery(query: ScaleQuery): Scale[] {
        return scales.filter(scale => matchesQuery(scale, query));
    }

    // index into a pitch class, shifting up/down through octaves (ie, -1 is the last element of the class, but an octave down)
    export function indexIntoPitchClass(pitches: PitchOffset[], index: number): PitchOffset {
        const baseOffset = pitches[mod(index, pitches.length)];
        const adjust = 12 * Math.floor(index / pitches.length);
        return PitchOffset(unwrap(baseOffset) + adjust);
    }

}
