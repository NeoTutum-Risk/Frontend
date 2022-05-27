import { atom } from "recoil";

export const showDashboardState = atom({
    key: "showDashboard",
    default: "default"
})

export const activeDashboardPanelState = atom({
    key: "activeDashboardPanel",
    default: null
})