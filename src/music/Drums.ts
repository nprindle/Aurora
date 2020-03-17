import { SampleInstrument } from "./Instruments.js";
import { Samples } from "./Samples.js";
import { MidiNumber } from "./Notes.js";
import { impossible } from "../util/Util.js";

export enum Drums {
    KICK, SNARE, CLOSED_HI_HAT, OPEN_HI_HAT
}

export namespace Drumkit {

    const closedHiHat: Promise<SampleInstrument> = SampleInstrument.fromSample(Samples.white_noise, {
        attack: 0.01, decay: 0.05
    }, 0.5);

    const openHiHat: Promise<SampleInstrument> = SampleInstrument.fromSample(Samples.white_noise, {
        attack: 0.01, decay: 0.2
    }, 0.5);

    // TODO: generalize sampling
    const snare: Promise<SampleInstrument> = SampleInstrument.fromSample(Samples.snare, { sustain: 1 }, 1.5);
    const kick: Promise<SampleInstrument> = SampleInstrument.fromSample(Samples.kick, { sustain: 1 }, 1.5);

    // TODO: make these sound good
    export async function scheduleHit(context: AudioContext, start: number, drum: Drums): Promise<AudioNode> {
        switch (drum) {
        case Drums.KICK:
            return (await kick).scheduleNote(context, {
                midiNumber: MidiNumber(69),
                start: start,
                duration: 1
            });
        case Drums.SNARE:
            return (await snare).scheduleNote(context, {
                midiNumber: MidiNumber(69),
                start: start,
                duration: 1
            });
        case Drums.CLOSED_HI_HAT:
            return (await closedHiHat).scheduleNote(context, {
                midiNumber: MidiNumber(70),
                start: start,
                duration: 0.05
            });
        case Drums.OPEN_HI_HAT:
            return (await openHiHat).scheduleNote(context, {
                midiNumber: MidiNumber(70),
                start: start,
                duration: 0.2
            });
        default: impossible();
        }
    }

}
