import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { CreationEngine } from "./engine/engine.ts";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  await engine.navigation.showScreen(MainScreen);
})();
