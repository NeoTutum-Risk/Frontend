import { configureStore } from "@reduxjs/toolkit";
import lookupReducer from "../src/slices/lookup-slice"
import windowsReducer from "../src/slices/window-slice"


// configureStore is the new replacement for createStore which contains thunk
export const store = configureStore({
    /**
     * this will automatically tells configureStore to use combineReducers
     */
    reducer: {
        lookupReducer,
        windowsReducer
    },

})