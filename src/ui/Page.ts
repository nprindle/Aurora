/* a page is a container for an HTML UI component and its associated behavior
 * this can be a "screen" of the game or a component within another page
 *
 * to display a page, use GameWindow.show()
 */
export interface Page {
    // root element containing this page's HTML
    readonly html: HTMLElement;
    // updates the information shown on the page (may be a no-op for pages that don't show changing information)
    refresh(): void;

    // pages make optionally implement one or both of these methods in order to receive keyboard input
    handleKeyDown?(event: KeyboardEvent): void;
    handleKeyUp?(event: KeyboardEvent): void;
}
