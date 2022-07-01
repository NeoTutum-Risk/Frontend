import { createSlice } from "@reduxjs/toolkit";
import { generateID } from "../utils/generateID";

const initialState = {
  windows: [],
};

const windowsSlice = createSlice({
  name: "windows",
  initialState,
  reducers: {
    closeWindowAction: (state, action) => {
      state.windows = state.windows.filter(
        (window) => window.id !== action.payload
      );
    },
    collapseWindowAction: (state, action) => {
      state.windows = state.windows.map((window) => {
        if (window.id !== action.payload) {
          return window;
        } else {
          return { ...window, collapse: true };
        }
      });
    },
    restoreWindowAction: (state, action) => {
        state.windows = [
            {
              ...state.windows[state.windows.map((row) => row.id).indexOf(action.payload)],
              collapse: false,
            },
            ...state.windows.filter((window) => window.id !== action.payload),
          ]
    },
    reArrangeWindowAction: (state, action) => {
        state.windows = action.payload
    },
    appendWindowAtStartAction: (state, action) => {
        //state.windows.unshift(action.payload)
        state.windows = [action.payload, ...state.windows]
    },
    changeInWindowAction: (state, action) => {
        state.windows = state.windows.map((window) => {
            if (window.data.type === "BPMN SequenceFlows") {
              return {
                ...window,
                data: {
                  type: "BPMN SequenceFlows",
                  sequenceFlows: action.payload.sequenceFlows.data.data,
                },
              };
            }

            if (window.data.type === "BPMN Entities") {
              return {
                ...window,
                data: {
                  type: "BPMN Entities",
                  entities: action.payload.entities.data.data,
                },
              };
            }

            return window;
          })
    },
    changeWindowLocationAction: (state, action) => {
        const { directionData, directionIndex, windowIndex, windowData } = action.payload

        state.windows = state.windows.map((window, index) => {
            if (index !== windowIndex && index !== directionIndex) {
              return window;
            }
            if (index === windowIndex) {
              return directionData;
            }
            if (index === directionIndex) {
              return windowData;
            }

            return {};
          });
    },
    changeWindowTypeAction: (state, action) => {
        state.windows = state.windows.map((window) => {
            if (window.id !== action.payload.id) {
              return window;
            } else {
              return { ...window, type: "data", data: action.payload.dataObject };
            }
          });
    },
    windowResizeAction: (state, action) => {

        const {windowId, delta} = action.payload

        state.windows = state.windows.map((storedWindow) => {
            if (storedWindow.id === windowId) {
              return {
                ...storedWindow,
                width: storedWindow.width + delta.width,
                height: storedWindow.height + delta.height,
              };
            } else {
              return storedWindow;
            }
          })
    },
    windowMaximizeAction: (state, action) => {

        state.windows = state.windows.map((storedWindow) => {
            if (storedWindow.id === action.payload) {
              return {
                ...storedWindow,
                maximized: !storedWindow.maximized,
              };
            } else {
              return storedWindow;
            }
          })
    },
    addNewWindowAction: (state, action) => {
        const {windowData, dataId} = action.payload

        state.windows = state.windows.find((window) => window.data.id === dataId)
        ? state.windows
        : [windowData, ...state.windows]
    },
    onWindowNodeClickAction: (state, action) => {

        const {nodeData, windowDefault} = action.payload

        state.windows = state.windows.find(
            (window) =>
              window.data.id === nodeData.data.data.id &&
              window.type === "flowchart"
          )
            ? state.windows
            : [
                {
                  type: "flowchart",
                  data: nodeData.data.data,
                  id: generateID(),
                  collapse: false,
                  width: windowDefault.width,
                  height: windowDefault.height,
                  maximized: false
                },
                ...state.windows,
              ]
    }
  },
});

export const { closeWindowAction, collapseWindowAction, restoreWindowAction, reArrangeWindowAction, appendWindowAtStartAction, changeInWindowAction,changeWindowLocationAction, changeWindowTypeAction, windowResizeAction, windowMaximizeAction, addNewWindowAction, onWindowNodeClickAction } = windowsSlice.actions;

export default windowsSlice.reducer;
