import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    lookupList: [],
    lookupTable: []
}

const lookupSlice = createSlice({
    name: "lookup",
    initialState,
    reducers: {
        setLookupList: (state, action) => {
            state.lookupList = action.payload
        },
        setLookupTable: (state, action) => {
            state.lookupTable = action.payload
        }
    }
})

export const {setLookupList, setLookupTable} = lookupSlice.actions

export default lookupSlice.reducer;