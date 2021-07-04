import { VType } from "@/vrun";
import logo from "@/assets/vrun.png";

export default function (vrun: VType) {
  const logger = vrun.Log.getLogger("plugin:core");

  vrun.registerPlugin({
    uuid: "c97d6164-d0f2-43cb-bbe5-56385ed1e329",
    name: "core",
    icon: logo,
    keyword: "",
    keywordConfigurable: false,
    description: "core plugin for vrun app",
    useHot: true,
  });
}
