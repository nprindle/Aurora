import { Frequency } from "./Notes.js";

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

    export async function createBufferFromAudioData(context: AudioContext, length: number, filename: string): Promise<AudioBuffer> {
        const buffer = new AudioBuffer({ numberOfChannels: 1, sampleRate: 44100, length: length });
        const response = await fetch(`assets/${filename}`, {
            headers: new Headers({
                "Content-Type": "audio/ogg"
            })
        }).catch(async (e) => {
            if (e instanceof Response) {
                throw new Error(await e.text());
            } else if (e instanceof Error) {
                throw e;
            } else {
                throw new Error('Unknown error when fetching sample: ' + e);
            }
        });
        const arr = await response.arrayBuffer();
        const tempBuffer = await context.decodeAudioData(arr);
        buffer.copyToChannel(tempBuffer.getChannelData(0), 0);
        return buffer;
    }

    export async function makeSampleData(
        args: { buffer: Promise<AudioBuffer>; shouldLoop: boolean; freq: Frequency; }
    ): Promise<SampleData> {
        const { buffer, shouldLoop, freq } = args;
        return { buffer: await buffer, shouldLoop, freq };
    }

}

export type SampleNames = "white_noise" | "snare" | "kick";

/**
 * Given an AudioContext, use it to construct all available samples.
 */
export function makeSamples(context: AudioContext): Record<SampleNames, Promise<SampleData>> {
    return {
        white_noise: SampleUtils.makeSampleData({
            buffer: Promise.resolve(SampleUtils.createBufferFromGenerator(44100, () => 2 * Math.random() - 1)),
            shouldLoop: true,
            freq: Frequency(440),
        }),
        snare: SampleUtils.makeSampleData({
            buffer: SampleUtils.createBufferFromAudioData(context, 22050, "samples/snare.ogg"),
            shouldLoop: false,
            freq: Frequency(440),
        }),
        kick: SampleUtils.makeSampleData({
            buffer: SampleUtils.createBufferFromAudioData(context, 22050, "samples/kick.ogg"),
            shouldLoop: false,
            freq: Frequency(440),
        }),
    };
}

