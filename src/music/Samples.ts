import { Frequency } from "./Notes.js";
import "../polyfills/AudioBuffer.prototype.copyToChannel.js";

export interface SampleData {
    buffer: AudioBuffer;
    shouldLoop: boolean;
    freq: Frequency; // frequency of sample for pitchshifting reasons
}

export namespace SampleUtils {

    // Length is in units of number of samples
    export function createBufferFromGenerator(
        context: AudioContext,
        length: number,
        func: (i: number) => number
    ): AudioBuffer {
        // Number of channels, length, sample rate
        const buffer = context.createBuffer(1, length, 44100);
        const arr: Float32Array = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            arr[i] = func(i);
        }
        buffer.copyToChannel(arr, 0);
        return buffer;
    }

    export async function createBufferFromAudioData(
        context: AudioContext,
        length: number,
        filename: string
    ): Promise<AudioBuffer> {
        const buffer = context.createBuffer(1, length, 44100);
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
                throw new Error(`Unknown error when fetching sample: ${e}`);
            }
        });
        const arr = await response.arrayBuffer();
        const tempBuffer: AudioBuffer = await new Promise((resolve, reject) => {
            // Webkit doesn't support the newer Promise-based syntax for
            // 'AudioContext.prototype.decodeAudioData', only the callback
            // syntax. This returns 'void' when the callbacks are provided, but
            // the compiler doesn't think so, so we cast it to 'void' to
            // silence errors and linter warnings.
            context.decodeAudioData(arr, resolve, reject) as unknown as void;
        });
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
            buffer: Promise.resolve(SampleUtils.createBufferFromGenerator(context, 44100, () => 2 * Math.random() - 1)),
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

