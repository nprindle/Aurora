/* common HTML/DOM-manipulation helper methods shared by our UI
 * this file is not the place to put layout or logic for a specific page or component's UI; those should each get their own file
 */

export default class UI{

    /**
     * create an empty HTML div
     * @param classes CSS classes to be apply style to this div
     */
    static makeDiv(classes: string[]) {
        const div: HTMLElement = document.createElement('div');
        div.classList.add(...classes);
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

    static makePara(str: string, classes: string[]): HTMLElement {
        return UI.makeElement('p', str, classes);
    }

    static makeHeader(str: string, classes: string[], level: number = 1): HTMLElement {
        return UI.makeElement(`h${level}`, str, classes);
    }

    /**
     * Clears the parent (usually a div) and fills it with new contents
     * @param parent 
     * @param elements 
     */
    static fillHTML(parent: HTMLElement, contents: HTMLElement[]) {
        parent.innerHTML = ''; // clear the parent
        contents.forEach(element => parent.appendChild(element)); // add elements to the DOM
    }
}