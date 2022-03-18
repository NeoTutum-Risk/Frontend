import { atom, atomFamily, DefaultValue, selectorFamily } from 'recoil'

export const windowsState = atom({
  key: 'windows',
  default: [],
})


export const windowAtom = atomFamily({
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