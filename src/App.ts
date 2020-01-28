import GameWindow from "./UI/GameWindow.js"
import { preloadImages } from "./UI/Images.js"

// this is the entrypoint to the program.
window.onload = function() {
    console.log("Script Loaded");
    preloadImages().then(() => {
        GameWindow.showMainMenu();
    });
}
