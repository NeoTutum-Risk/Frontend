import { DataElement } from "./dataElement";
import { ConnetionContext } from "./connectionContext";
import { useRef, useEffect, useCallback, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  addNewElementsConnection,
  removeNewElementsConnection,
} from "../../services";
export const FlowChart = ({ graph }) => {
  const [selectedElements, setSelectedElements] = useState([]);

  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const contextAction = useCallback(
    async (option) => {
      console.log(option, selectedElements);
      if (option === "Connect") {
        const payload = {
          sourceId: selectedElements[0].id,
          targetId: selectedElements[1].id,
        };
        const response = await addNewElementsConnection(payload);
        console.log(response);
      } else if (option === "Disconnect") {
        const connection = selectedElements[0].connections.find(
          (con) => con.targetId === selectedElements[1].id
        )
          ? selectedElements[0].connections.find(
              (con) => con.targetId === selectedElements[1].id
            )
          : selectedElements[1].connections.find(
              (con) => con.targetId === selectedElements[0].id
            );
        const response = await removeNewElementsConnection({
          id: connection.id,
        });
        console.log(connection, response);
      }
    },
    [selectedElements]
  );

  const showContext = useCallback(
    (data) => {
      console.log("RCM", data);
      let option;
      console.log(
        "check",
        selectedElements,
        selectedElements.find((element) => element.id === data.id)
      );
      if (selectedElements.find((element) => element.id === data.id)) {
        if (selectedElements.length === 2) {
          if (
            Math.abs(
              selectedElements[0].level_value - selectedElements[1].level_value
            ) === 1
          ) {
            if (
              selectedElements[0].connections.find(
                (con) => con.targetId === selectedElements[1].id
              ) ||
              selectedElements[1].connections.find(
                (con) => con.targetId === selectedElements[0].id
              )
            ) {
              console.log("Disconnect");
              option = "Disconnect";
            } else {
              console.log("Connect");
              option = "Connect";
            }
          } else {
            console.log("Invalid Connect");
            option = "Invalid Connection";
          }
        } else {
          console.log("Not Two");
          option = `Invalid Connection`;
        }
      } else {
        option = `Not Selected`;
      }

      setContextMenu({
        show: true,
        x: Number(data.x),
        y: Number(data.y),
        option: option,
        function: contextAction,
      });
    },
    [contextAction, selectedElements]
  );

  const elementSelection = useCallback(
    (elementData, state) => {
      console.log(elementData, state);
      if (state) {
        console.log("selecting");
        setSelectedElements((prev) => {
          return [...new Set([...prev, elementData])];
        });
      } else {
        setSelectedElements((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
      }
    },
    [setSelectedElements]
  );

  const handleClick = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <TransformWrapper>
      <TransformComponent>
        <svg
          viewBox="0 0 500 400"
          width={490}
          height={355}
          onClick={handleClick}
        >
          {graph.nodes.map((node) => (
            <DataElement
              data={node}
              elementSelection={elementSelection}
              showContext={showContext}
            />
          ))}
          {contextMenu.show && <ConnetionContext data={contextMenu} />}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  );
};
