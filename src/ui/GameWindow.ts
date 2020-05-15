import { UI } from "./UI.js";
import { Page } from "./Page.js";

export namespace GameWindow {

    // root div for all of the main game HTML
    const rootDiv: HTMLElement = document.getElementById("rootdiv")!;

    // currently-displayed page
    let currentPage: Page | undefined = undefined;

    // div containing pop-ups on top of the rootDiv
    const popUpDiv: HTMLElement = document.getElementById("popup")!;
    // queue of content to be shown as pop-ups, and time in milliseconds that each will be shown
    const popupQueue: { page: Page; milliseconds: number; }[] = [];

    export function show(page: Page): void {
        currentPage = page;
        UI.fillHTML(rootDiv, [page.html]);

        // keyboard handlers will only be called on pages that include them
        document.onkeydown = (ev: KeyboardEvent) => {
            if (page.handleKeyDown) {
                page.handleKeyDown(ev);
            }
        };
        document.onkeyup = (ev: KeyboardEvent) => {
            if (page.handleKeyUp) {
                page.handleKeyUp(ev);
            }
        };
    }

    export function refreshCurrentPage(): void {
        if (currentPage) {
            currentPage.refresh();
        }
    }

    function showNextPopup(): void {
        if (popupQueue.length > 0) {
            UI.fillHTML(popUpDiv, [popupQueue[0].page.html]);
            setTimeout(() => {
                popupQueue.shift();
                showNextPopup();
            }, popupQueue[0].milliseconds);
        } else {
            UI.fillHTML(popUpDiv, []);
        }
    }

    export function addPopup(contents: Page, milliseconds: number): void {
        popupQueue.push({ page: contents, milliseconds: milliseconds });
        if (popupQueue.length === 1) {
            showNextPopup();
        }
    }
}
