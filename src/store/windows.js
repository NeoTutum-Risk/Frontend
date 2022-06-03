import { atom } from 'recoil'

export const windowsState = atom({
  key: 'windows',
  default: [],
})


export const BPMNLayerState = atom({
  key: "BPMNLayers",
  default: [],
})