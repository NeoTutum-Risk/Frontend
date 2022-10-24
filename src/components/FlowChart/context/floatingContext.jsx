import { Rnd } from "react-rnd";
import { useCallback } from "react";
export const FloatingContext = ({ contextMenu, setContextMenu, children }) => {
  const updateDraftLocation = useCallback(
    async (e, d) => {
      setContextMenu((prev) => ({ ...prev, contextY: d.y, contextX: d.x }));
      if (d.x < 0) {
        setContextMenu((prev) => ({ ...prev, ccontextXx: 0 }));
        d.x = 0;
      }

      if (d.y < 0) {
        setContextMenu((prev) => ({ ...prev, contextY: 0 }));
        d.y = 0;
      }
    },
    [setContextMenu]
  );
  return (
    <Rnd
      position={{
        x: Number(contextMenu.contextX),
        y: Number(contextMenu.contextY),
      }}
      style={{ zIndex: 9999999 }}
      onDragStop={(e, d) => updateDraftLocation(e, d)}
      enableResizing={false}
    >
        {children}
    </Rnd>
  );
};
