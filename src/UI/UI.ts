/* common HTML/DOM-manipulation helper methods shared by our UI
 * this file is not the place to put layout or logic for a specific page or component's UI; those should each get their own file
 *
 * thank you to May Lawver for her UI code from last semester's game "Prototype Inheritance", which provided some helpful examples
 */

export default class UI{

    // makes an empty HTML div with the given css classes
    static makeDiv(classes?: string[]) {
        const div: HTMLElement = document.createElement('div');
        if(classes) {
            div.classList.add(...classes);
        }
        return div;
    }

    // makes a div containing the given HTML elements
    static makeDivContaining(contents: HTMLElement[], classes?: string[]) {
        const div = this.makeDiv(classes);
        for (const element of contents) {
            div.appendChild(element);
        }
        return div;
    }

    static makeElement(element: string, text: string, classes?: string[]): HTMLElement {
        const e: HTMLElement = document.createElement(element);
        e.innerText = text;
        if (classes) {
            e.classList.add(...classes);
        }
        return e;
    }

    // creates an HTML paragraph <p>
    static makePara(str: string, classes?: string[]): HTMLElement {
        return UI.makeElement('p', str, classes);
    }
    // created an HTML header, e.g. <H1> or <H2>
    static makeHeader(str: string, level: number = 1, classes?: string[]): HTMLElement {
        return UI.makeElement(`h${level}`, str, classes);
    }

    // creates a button which executes the given callback function when clicked
    static makeButton(text: string, callback: Function, classes?: string[], disabled: boolean = false): HTMLButtonElement {
        const b: HTMLButtonElement = document.createElement('button');
        b.type = 'button';
        b.disabled = disabled;
        b.innerText = text;
        if(classes) {
            b.classList.add(...classes);
        }
        b.onclick = function (ev: MouseEvent) {
            ev.preventDefault;
            callback.call(this, ev);
        };
        return b;
    }

    // creates an HTML canvas for drawing graphics
    static makeCanvas(width: number, height: number, classes?: string[]): HTMLCanvasElement {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        if(classes) {
            canvas.classList.add(...classes);
        }
        return canvas;
    }

     // clears the parent (usually a div) and fills it with new contents
    static fillHTML(parent: HTMLElement, contents: HTMLElement[]) {
        parent.innerHTML = ''; // clear the parent
        for (const element of contents) {
            parent.appendChild(element); // add elements to the parent
        }
    }
}
