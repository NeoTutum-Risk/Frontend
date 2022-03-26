import { atom } from "recoil";

export const lookupListState = atom({
  key: "lookupList",
  default: [],
});

export const lookupTableState = atom({
  key: "lookupTable",
  default: [],
})