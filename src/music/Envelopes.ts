import { lerp } from "../util/Util.js";

/**
 * An envelope describes how a sound should change over time. The envelope is
 * generated using an attack, delay, sustain, and release (ADSR).
 */
export interface AdsrConfig {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
}

// Give default values to an 'AdsrConfig'
function normalizeAdsr(config: AdsrConfig): Required<AdsrConfig> {
    const { attack = 0, sustain = 0, decay = 0, release = 0 } = config;
    return { attack, sustain, decay, release };
}

export namespace Envelopes {

    /**
     * Create a 'GainNode' generated using the given ADSR parameters. 'start'
     * refers to the number of seconds since the creation of the 'AudioContext'.
     */
    export function createAdsrEnvelope(
        context: AudioContext, start: number, duration: number, env: AdsrConfig, volume: number = 1
    ): GainNode {
        const { attack, sustain, decay, release } = normalizeAdsr(env);
        const gainNode: GainNode = context.createGain();
        gainNode.gain.setValueAtTime(0, start);
        if (duration < attack) {
            // note gets cut off in middle of attack
            gainNode.gain.linearRampToValueAtTime(lerp(0, volume, duration / attack), start + duration);
            gainNode.gain.linearRampToValueAtTime(0, start + duration + release);
        } else if (duration < attack + decay) {
            // note gets cut off in middle of decay
            gainNode.gain.linearRampToValueAtTime(volume, start + attack);
            gainNode.gain.linearRampToValueAtTime(lerp(volume, volume * sustain, (duration - attack) / decay), start + attack + decay);
            gainNode.gain.linearRampToValueAtTime(0, start + duration + release);
        } else {
            // envelope executes fully
            gainNode.gain.linearRampToValueAtTime(volume, start + attack);
            gainNode.gain.linearRampToValueAtTime(volume * sustain, start + attack + decay);
            gainNode.gain.linearRampToValueAtTime(0, start + duration + release);
        }
        return gainNode;
    }

}
