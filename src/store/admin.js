import { atom } from "recoil";

export const showAdminState = atom({
    key: "showAdmin",
    default: false
})

export const activeAdminPanelState = atom({
    key: "activeAdminPanel",
    default: null
})