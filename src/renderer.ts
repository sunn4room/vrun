import vrun from "@/vrun";
import init from "./init";
import { createApp } from "vue";
import App from "./app/App.vue";

// init the whole app
init();

const logger = vrun.Log.getLogger("renderer.ts");
logger.trace("vrun:", vrun);

createApp(App).mount("#app");
