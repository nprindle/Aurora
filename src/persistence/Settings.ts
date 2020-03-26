import { Schemas } from "../serialize/Schema.js";
import { Storage } from "./Storage.js";
import { MusicManager } from "../music/MusicManager.js";

/**
 * An instance of 'Settings' a set of configuration options for the game.
 */
export class SettingsOptions {

    // Default settings values
    private constructor(
        // width of viewable area in tiles
        public viewWidth: number = 12,
        // height of viewable area in tiles
        public viewHeight: number = 8,
        // game volume, from 0 to 1
        public volume: number = 0.25,
    ) {}

    static defaultOptions(): SettingsOptions {
        return new SettingsOptions();
    }

    static schema = Schemas.classOf({
        viewWidth: Schemas.aNumber,
        viewHeight: Schemas.aNumber,
        volume: Schemas.aNumber,
    }, ({ viewWidth, viewHeight, volume }) => {
        return new SettingsOptions(viewWidth, viewHeight, volume);
    });
}

export namespace Settings {
    // The key to use in local storage
    const lsKey = "settings" as const;

    /**
     * Load a stored set of options from local storage, or if there is none,
     * load the default set of options. Does not assign it as the current set of
     * options; to do this, use 'Settings.saveOptions'.
     */
    export function loadOptions(): SettingsOptions {
        const stored = Storage.loadItem(lsKey, SettingsOptions.schema);
        if (stored?.resultType === "success") {
            return stored.result;
        } else {
            return SettingsOptions.defaultOptions();
        }
    }

    export let currentOptions: SettingsOptions = loadOptions();

    /**
     * Applies any settings to the game that don't automatically update when the
     * current options are changed. For example, the map dimensions are read
     * from the current settings when the map is shown, and so don't need to be
     * set here, but the music only reads the current volume when initializing,
     * so we need to set it here.
     */
    export function applySettings(options: SettingsOptions): void {
        MusicManager.setVolume(options.volume);
    }

    /**
     * Saves a set of options to the store, and sets the current set of options
     * to the set provided.
     */
    export function saveOptions(options: SettingsOptions): void {
        currentOptions = options;
        applySettings(currentOptions);
        Storage.saveItem(lsKey, options, SettingsOptions.schema);
    }

    /**
     * Replace all current and saved settings with the default settings.
     */
    export function restoreDefaults(): void {
        Settings.saveOptions(SettingsOptions.defaultOptions());
    }
}
