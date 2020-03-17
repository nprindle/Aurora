import { Frequency } from "./Notes.js";

// TODO: do this better
// This is necessary for decoding sample data, but there has to be a better way to do this.
const tempAudioContext = new AudioContext();

export interface SampleData {
    buffer: AudioBuffer;
    shouldLoop: boolean;
    freq: Frequency; // frequency of sample for pitchshifting reasons
}

export namespace SampleUtils {

    export function createBufferFromGenerator(length: number, func: (i: number) => number): AudioBuffer {
        const arr: Float32Array = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            arr[i] = func(i);
        }
        const buffer = new AudioBuffer({ numberOfChannels: 1, sampleRate: 44100, length: length });
        buffer.copyToChannel(arr, 0);
        return buffer;
    }

    export async function createBufferFromAudioData(length: number, filename: string): Promise<AudioBuffer> {
        const buffer = new AudioBuffer({ numberOfChannels: 1, sampleRate: 44100, length: length });
        const response = await fetch(`assets/${filename}`, {
            headers: new Headers({
                "Content-Type": "audio/ogg"
            })
        });
        const arr = await response.arrayBuffer();
        const tempBuffer = await tempAudioContext.decodeAudioData(arr);
        buffer.copyToChannel(tempBuffer.getChannelData(0), 0);
        return buffer;
    }

    export async function makeSampleData(args: { buffer: Promise<AudioBuffer>; shouldLoop: boolean; freq: Frequency; }): Promise<SampleData> {
        const { buffer, shouldLoop, freq } = args;
        return { buffer: await buffer, shouldLoop, freq };
    }

}

export const Samples = {
    "white_noise": SampleUtils.makeSampleData({
        buffer: Promise.resolve(SampleUtils.createBufferFromGenerator(44100, () => 2 * Math.random() - 1)),
        shouldLoop: true,
        freq: Frequency(440),
    }),
    "snare": SampleUtils.makeSampleData({
        buffer: SampleUtils.createBufferFromAudioData(22050, "samples/snare.ogg"),
        shouldLoop: false,
        freq: Frequency(440),
    }),
    "kick": SampleUtils.makeSampleData({
        buffer: SampleUtils.createBufferFromAudioData(22050, "samples/kick.ogg"),
        shouldLoop: false,
        freq: Frequency(440),
    }),
};
