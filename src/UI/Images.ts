/* All images should be declared here so that they start loading as soon as the application starts
 */

const imageQueue: Promise<HTMLImageElement>[] = [];

function makeImage(src: string): HTMLImageElement {
    const img = new Image();
    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        // Don't break everything if an image can't be loaded
        img.onerror = () => resolve(img);
        img.src = src;
    });
    imageQueue.push(imagePromise);
    return img;
}

// UI images
export const HighlightSelectionImage = makeImage("assets/ui/highlight.png");

// tile textures
export const HabitatTexture = makeImage("assets/tiles/habitat.png");
export const WastelandTexture1 = makeImage("assets/tiles/wasteland1.png");
export const WastelandTexture2 = makeImage("assets/tiles/wasteland2.png");
export const WastelandTexture3 = makeImage("assets/tiles/wasteland3.png");
export const WastelandTexture4 = makeImage("assets/tiles/wasteland4.png");
export const WastelandTexture5 = makeImage("assets/tiles/wasteland5.png");
export const SolarPanelsTexture = makeImage("assets/tiles/solar_panels.png");
export const MountainTexture = makeImage("assets/tiles/mountain.png");
export const MiningFacilityTexture = makeImage("assets/tiles/mining_facility.png");
export const LanderTexture = makeImage("assets/tiles/lander.png");
export const GreenhouseTexture = makeImage("assets/tiles/greenhouse.png");

export async function preloadImages(): Promise<HTMLImageElement[]> {
    return Promise.all(imageQueue);
}
