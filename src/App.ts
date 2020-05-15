import { GameWindow } from "./ui/GameWindow.js";
import { preloadImages } from "./ui/Images.js";
import MainMenuUI from "./ui/menu/MainMenu.js";
import ExceptionScreen from "./ui/menu/ExceptionScreen.js";

// this is the entrypoint to the program.
window.onload = async function() {
    await preloadImages().then(
        // show main menu once all image assets are loaded
        () => {
            GameWindow.show(new MainMenuUI());
        },
        // show error screen if image load fails
        () => {
            GameWindow.show(new ExceptionScreen("Image Load Error", "One or more image assets could not be loaded"));
        }
    );
};
