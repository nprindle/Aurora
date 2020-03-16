import { mod } from "../util/Util.js";
import { Newtype, newtype, unwrap } from "../util/Newtypes.js";

/**
 * A number representing an absolute note, as defined by MIDI.
 *
 * Example: middle C (C4) has a 'MidiNumber' of 60.
 */
export type MidiNumber = Newtype<number, { readonly _: unique symbol; }>;
export const MidiNumber = newtype<MidiNumber>();

/**
 * The frequency, in Hertz, of an absolute note.
 *
 * Example: A4 has a 'Frequency' of 440.
 */
export type Frequency = Newtype<number, { readonly _: unique symbol; }>;
export const Frequency = newtype<Frequency>();

export interface Note {
    midiNumber: MidiNumber; // the MIDI number of the note
    start: number; // starting time in seconds
    duration: number; // duration in seconds
    endNote?: MidiNumber; // MIDI number of note to end on. if undefined, this has no effect
}

export namespace Notes {

    export const noteNames: string[] = [
        "C", "C#", "D", "D#", "E", "F",
        "F#", "G", "G#", "A", "A#", "B"
    ];

    export function midiNumberToFrequency(midiNumber: MidiNumber): Frequency {
        return Frequency(Math.pow(2, (unwrap(midiNumber) - 69) / 12) * 440);
    }

    export function midiNumberToNoteName(midiNumber: MidiNumber): string {
        const num = unwrap(midiNumber);
        return `${noteNames[mod(num, 12)]}${Math.floor(num / 12) - 1}`;
    }

    // Pitchshift the given note up and down using the coefficient.
    // If the coefficient is 1, it returns the frequency of the initial note.
    // Otherwise, it returns [frequency / coefficient, frequency, frequency * coefficient].
    // Since frequency perception is logarithmic, this shifts the frequency up and down by the same amount.
    export function detuneWithCoeff(midiNumber: MidiNumber, detuneCoeff: number): Frequency[] {
        if (detuneCoeff === 1) {
            return [midiNumberToFrequency(midiNumber)];
        } else {
            const freq: number = unwrap(midiNumberToFrequency(midiNumber));
            return [freq / detuneCoeff, freq, freq * detuneCoeff].map(Frequency);
        }
    }

}
