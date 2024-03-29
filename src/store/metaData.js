import { atom } from "recoil";

export const metaDataState = atom({
  key: "metaData",
  default: { id: "", name: "", l2: "", type: "",level: 1 },
});

export const metaDataDialogState = atom({
  key: "metaDataDialog",
  default: false,
});

export const metaDataLoadState = atom({
    key: "metaDataLoad",
    default: false,
  });