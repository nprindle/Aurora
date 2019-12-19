import GameWindow from "./UI/GameWindow.js"
import Resource from "./resources/Resource.js";

// this is the entrypoint to the program.
window.onload = function() {
    console.log("Script Loaded");

    GameWindow.showMainMenu();
    console.log(Resource.values());
}