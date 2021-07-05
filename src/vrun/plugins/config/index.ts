import vrun from "../..";
import logo from "@/assets/vrun.png";
import { VItem } from "../../item";

export default {
  uuid: "c898481b-5510-4487-87f6-699378ad0f1c",
  name: "config",
  icon: logo,
  keyword: "config",
  keywordConfigurable: false,
  description: "config plugin for vrun app",
  useHot: false,
  search: (searchword: string) => {
    const ret: VItem[] = [];
    for (const [name, configItem] of vrun.config) {
      if (vrun.orderMatch(searchword, name)) {
        ret.push(configItem);
      }
    }
    vrun.setItems(ret);
  },
  enter: (item: VItem) => {
    if (item.next) {
      const nextValue = item.next(item.value!);
      vrun.set(item.name, nextValue);
    } else {
      vrun.getUserInput(item.value!).then((nextValue) => {
        vrun.set(item.name, nextValue);
      });
    }
  },
  exit: (item: VItem) => {
    if (item.prev) {
      const nextValue = item.prev(item.value!);
      vrun.set(item.name, nextValue);
    } else {
      vrun.getUserInput(item.value!).then((nextValue) => {
        vrun.set(item.name, nextValue);
      });
    }
  },
};
