/* common HTML/DOM-manipulation helper methods shared by our UI
 * this file is not the place to put layout or logic for a specific page or component's UI; those should each get their own file
 *
 * thank you to May Lawver for her UI code from last semester's game "Prototype Inheritance", which provided some helpful examples
 */

// Emoji rendering is done using the twemoji library
// (https://github.com/twitter/twemoji)
import twemoji from "twemoji";
import * as twemojiParser from "twemoji-parser";

export namespace UI {

    // makes an empty HTML div with the given css classes
    export function makeDiv(classes?: string[]): HTMLElement {
        const div: HTMLElement = document.createElement("div");
        if (classes) {
            div.classList.add(...classes);
        }
        return div;
    }

    // makes a div containing the given HTML elements
    export function makeDivContaining(contents: HTMLElement[], classes?: string[]): HTMLElement {
        const div = makeDiv(classes);
        for (const element of contents) {
            div.appendChild(element);
        }
        return div;
    }

    export function makeElement(element: string, text: string, classes?: string[]): HTMLElement {
        const e: HTMLElement = document.createElement(element);
        e.innerText = text;
        if (classes) {
            e.classList.add(...classes);
        }
        return e;
    }

    // Modifies an element in-place to use Twitter emoji and returns it
    export function patchEmoji(element: HTMLElement): HTMLElement {
        twemoji.parse(element, { folder: "svg", ext: ".svg" });
        return element;
    }

    export function containsEmoji(str: string): boolean {
        return twemojiParser.parse(str).length > 0;
    }

    // creates an HTML paragraph <p>, supporting Twitter emoji
    export function makePara(str: string, classes?: string[]): HTMLElement {
        const par = makeElement("p", str, classes);
        if (containsEmoji(str)) {
            patchEmoji(par);
        }
        return par;
    }

    // created an HTML header, e.g. <H1> or <H2>
    export function makeHeader(str: string, level: number = 1, classes?: string[]): HTMLElement {
        const header = makeElement(`h${level}`, str, classes);
        if (containsEmoji(str)) {
            patchEmoji(header);
        }
        return header;
    }

    // Creates a button which executes the given callback function when clicked.
    // The callback may reference the button itself, as well as the mouse event.
    export function makeButton(
        text: string,
        callback: (button: HTMLButtonElement, ev: MouseEvent) => any,
        classes?: string[],
        buttonEnabled: "enabled" | "disabled" = "enabled"
    ): HTMLButtonElement {
        const b: HTMLButtonElement = document.createElement("button");
        b.type = "button";
        if (buttonEnabled === "disabled") {
            b.disabled = true;
        }
        b.innerText = text;
        if (classes) {
            b.classList.add(...classes);
        }
        b.onclick = function(ev: MouseEvent) {
            ev.preventDefault();
            callback(b, ev);
        };
        if (containsEmoji(text)) {
            patchEmoji(b);
        }
        return b;
    }

    // Creates a slider with an inclusive range and a default value, with the
    // appropriate callback when the slider value changes
    export function makeSlider(label: string, min: number, max: number, value: number,
        callback: (value: number) => void, step?: number): HTMLElement {
        const input = document.createElement("input");
        input.type = "range";
        input.min = min.toString();
        input.max = max.toString();
        input.value = value.toString();
        if (step !== undefined) {
            input.step = step.toString();
        }
        input.oninput = function(this: GlobalEventHandlers) {
            const handlers = this as GlobalEventHandlers & { value?: string; };
            if (handlers.value !== undefined) {
                const num = Number(handlers.value);
                if (!isNaN(num) && min <= num && num <= max) {
                    callback(num);
                }
            }
        };
        const par = UI.makePara(`${label}: `);
        const div = UI.makeDivContaining([par, input]);
        return div;
    }

    // Make a slider with an adjacent label displaying its current value
    export function makeTrackedSlider(
        label: string, min: number, max: number, def: number, callback: (value: number) => void, step?: number
    ): HTMLElement {
        const tracker = UI.makePara(def.toString());
        const slider = UI.makeSlider(label, min, max, def, (value: number) => {
            callback(value);
            tracker.innerText = value.toString();
        }, step);
        return UI.makeDivContaining([slider, tracker], ["settings-slider"]);
    }

    // creates an HTML canvas for drawing graphics
    export function makeCanvas(width: number, height: number, classes?: string[]): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        if (classes) {
            canvas.classList.add(...classes);
        }
        return canvas;
    }

    // clears the parent (usually a div) and fills it with new contents
    export function fillHTML(parent: HTMLElement, contents: HTMLElement[]): void {
        parent.innerHTML = "";
        for (const element of contents) {
            parent.appendChild(element);
        }
    }
}
