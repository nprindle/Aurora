/* common HTML/DOM-manipulation helper methods shared by our UI
 * this file is not the place to put layout or logic for a specific page or component's UI; those should each get their own file
 *
 * thank you to May Lawver for her UI code from last semester's game "Prototype Inheritance", which provided some helpful examples
 */

export default class UI{

    /**
     * create an empty HTML div
     * @param classes CSS classes to be apply style to this div
     */
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
        contents.forEach((element: HTMLElement) => div.appendChild(element));
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
    // creates an HTML pagragraph <p>
    static makePara(str: string, classes?: string[]): HTMLElement {
        return UI.makeElement('p', str, classes);
    }
    // created an HTML header, e.g. <H1> or <H2>
    static makeHeader(str: string, level: number = 1, classes?: string[]): HTMLElement {
        return UI.makeElement(`h${level}`, str, classes);
    }

    /**
     * creates a button
     * @param text the text shown on the button 
     * @param callback the function called when the button is clicked
     * @param classes css classes to apply style to this button
     * @param disabled whether to grey-out and disable the button (defaults to false)
     */
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

    // creates an image
    static makeImg(src: string, classes?: string[]): HTMLImageElement {
        const img: HTMLImageElement = document.createElement('img');
        img.src = src;
        if(classes) {
            img.classList.add(...classes);
        }
        return img;
    }

    static makeCanvas(width: number, height: number, classes?: string[]): HTMLCanvasElement {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        if(classes) {
            canvas.classList.add(...classes);
        }
        return canvas;
    }

    /**
     * creates a list of buttons
     * @param options a list of [string, Function] tuples containing the label text and callback function for each button
     */
    static makeOptions(options: [string, Function][], classes?: string[]): HTMLElement {
        const buttons = options.map((tuple: [string, Function]) => this.makeButton(tuple[0], tuple[1]));
        return this.makeDivContaining(buttons, classes);
    }

    /**
     * creates a slider
     * @param label 
     * @param min 
     * @param max 
     * @param value 
     * @param callback function called whenever the slider is changed
     * @param step optional, the stepping interval (e.g. set to 1 to only allow integer inputs)
     */
    static makeSlider(label: string, min: number, max: number, value: number, callback: Function, step?: number): HTMLElement {
        const input = document.createElement('input');
        input.type = 'range';
        input.min = `${min}`;
        input.max = `${max}`;
        input.value = `${value}`;
        if(step) {
            input.step = `${step}`;
        }
        input.onchange = function (this: GlobalEventHandlers, ev: Event) {
           callback(this);
        }
        const para = UI.makePara(`${label}: `, []);
        para.appendChild(input);
        return para;
    }

    /**
     * clears the parent (usually a div) and fills it with new contents
     * @param parent 
     * @param elements 
     */
    static fillHTML(parent: HTMLElement, contents: HTMLElement[]) {
        parent.innerHTML = ''; // clear the parent
        contents.forEach(element => parent.appendChild(element)); // add elements to the DOM
    }
}