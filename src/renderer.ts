import vrun from "@/vrun";
import { createApp } from "vue";
import App from "./app/App.vue";

const logger = vrun.Log.getLogger("renderer.ts");
logger.trace("vrun:", vrun);

vrun.registerPlugin({
  uuid: "55991ead-af5d-4c0e-89b6-da1b1932d593",
  name: "sunny",
  icon: "",
  keyword: "sn",
  configItems: [
    {
      name: "room",
      value: "room",
      watcher: (newValue, oldValue) => {
        logger.debug("new: %o, old: %o", newValue, oldValue);
      },
    },
  ],
});

createApp(App).mount("#app");
