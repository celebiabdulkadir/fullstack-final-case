/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";

export function registerPlugins(app) {
  app.use(router).use(pinia);
}
