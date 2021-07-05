import vrun from "../..";
import logo from "@/assets/vrun.png";
import { VItem } from "../../item";

export default {
  uuid: "c97d6164-d0f2-43cb-bbe5-56385ed1e329",
  name: "core",
  icon: logo,
  keyword: "",
  keywordConfigurable: false,
  description: "core plugin for vrun app",
  useHot: true,
  search: (searchword: string) => {
    const ret: VItem[] = [];
    if (searchword !== "") {
      const count = Math.floor(Math.random() * 51);
      for (let i = 1; i <= count; i++) {
        ret.push({
          name: "name " + i,
          description: "description " + i,
          value: 30,
          valueDesc: {
            type: "slider",
            max: 100,
            min: 0,
          },
        });
      }
    }
    vrun.setItems(ret);
  },
  enter: (item: VItem) => {
    vrun
      .getUserInput("")
      .then((value) => {
        console.log(value);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
};
