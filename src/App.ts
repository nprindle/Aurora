import { GameWindow } from "./ui/GameWindow.js";
import { preloadImages } from "./ui/Images.js";
import MainMenuUI from "./ui/menu/MainMenu.js";

// this is the entrypoint to the program.
window.onload = async function() {
    await preloadImages();
    GameWindow.show(new MainMenuUI());
};
