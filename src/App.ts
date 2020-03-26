import { GameWindow } from "./UI/GameWindow.js";
import { preloadImages } from "./UI/Images.js";
import MainMenuUI from "./UI/menu/MainMenu.js";

// this is the entrypoint to the program.
window.onload = async function() {
    console.log("Script Loaded");
    await preloadImages();
    GameWindow.show(new MainMenuUI());
};
