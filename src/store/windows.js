import { atom, atomFamily } from 'recoil'

export const windowsState = atom({
  key: 'windows',
  default: [],
})

export const windowFamily = atomFamily({
  key: "windowAtom",
  default: {
    type: "",
    data: {},
    id: "",
    collapse: false,
    width: 0,
    height: 0,
    maximized: false
  }
})

export const windowsIds = atom({
  key: "windowsIds",
  default: [],
}) 

export const BPMNLayerState = atom({
  key: "BPMNLayers",
  default: [],
})