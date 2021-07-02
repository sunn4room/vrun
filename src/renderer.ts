import vrun from "@/vrun";
import { createApp } from "vue";
import App from "./App.vue";

const logger = vrun.Log.getLogger("renderer.ts");
logger.trace("vrun:", vrun);

vrun.addConfigItem({
  name: "core.width",
  value: 800,
  validator: (value) => {
    if (typeof value === "number" && value < 1000 && value > 500) {
      return true;
    } else {
      return false;
    }
  },
});

vrun.set("core.width", 1000);

createApp(App).mount("#app");
