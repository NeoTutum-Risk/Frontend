import {
  Button,
  FormGroup,
  H5,
  Icon,
  InputGroup,
  NumericInput,
  Intent,
  Menu,
  MenuItem,
  Tree,
  HTMLSelect,
  FileInput,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import Papa from "papaparse";
import { Classes, Popover2, Tooltip2 } from "@blueprintjs/popover2";
import cloneDeep from "lodash/cloneDeep";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { referenceGroupsState } from "../../../../store/referenceGroups";
import { getMetaData, getDataObject } from "../../../../services";
import { addDataObject } from "../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
  showWarningToaster,
} from "../../../../utils/toaster";
import { windowsState } from "../../../../store/windows";
import { generateID } from "../../../../utils/generateID";

export const ReferenceGroups = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const setWindows = useSetRecoilState(windowsState);
  const [referenceGroups, setReferenceGroups] =
    useRecoilState(referenceGroupsState);
  const [referenceGroupPopOverOpenId, setReferenceGroupPopOverOpenId] =
    useState(null);
  const [referenceGroupPopOverOpenName, setReferenceGroupPopOverOpenName] =
    useState("");
  const [referenceGroupsNodes, setReferenceGroupsNodes] = useState(null);
  const [referenceGroupContextMenu, setReferenceGroupContextMenu] =
    useState(null);
  const [metaData, setMetaData] = useState(null);
  const [dataObjectType, setDataObjectType] = useState(null);
  const [dataObjectLevels, setDataObjectLevels] = useState(1);
  const [dataObjectLevelsInput, setDataObjectLevelsInput] = useState([]);
  const fetchMetaData = useCallback(async () => {
    const { data } = await getMetaData();
    console.log(data);
    setMetaData(data.data);
  }, []);

  //work around for context menu
  const useOnClickOutsideContextMenu = (handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (
          event.target.classList.contains("target_menu") ||
          event.target.getAttribute("data-icon") === "plus" ||
          event.target.getAttribute("data-icon") === "update" ||
          event.target.tagName === "path" ||
          event.target.classList.contains("bp3-menu-item")
        )
          return;

        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [handler]);
  };

  useOnClickOutsideContextMenu(() => {
    setReferenceGroupContextMenu(null);
  });

  const clearData = useCallback(() => {
    setReferenceGroupPopOverOpenId(null);
    setDataObjectType(null);
    setDataObjectLevels(1);
    setDataObjectLevelsInput([]);
  }, [
    setReferenceGroupPopOverOpenId,
    setDataObjectType,
    setDataObjectLevels,
    setDataObjectLevelsInput,
  ]);

  useEffect(() => {
    fetchMetaData();
  }, [fetchMetaData]);

  const handleTextInput = (e, i) => {
    setDataObjectLevelsInput((prev) => {
      if (
        prev.map((item) => item.levelId).indexOf(i) === -1 ||
        prev.length === 0
      ) {
        //console.log(prev.map((item) => item.levelId).indexOf(i));
        return [...prev, { levelId: i, name: e.target.value }];
      } else {
        return prev.map((item) => {
          if (item.levelId === i) {
            return { ...item, name: e.target.value };
          } else {
            return item;
          }
        });
      }
    });
  };

  const csvFileParser = (e, i) => {
    const files = e.target.files;
    //  console.log(files);
    if (files) {
      console.log(files[0].name, i);
      Papa.parse(files[0], {
        complete: function (results) {
          let csvError = false;
          console.log("empty last row check",results.data[results.data.length-1]);
          if(results.data[results.data.length-1].length===1){
            const lastRow = results.data.pop();
            console.log("Fixed File",results.data);
            showWarningToaster(`CSV row#${results.data.length} is an empty row and is removed`);
          }

          //return;
          console.log("header Check", results.data[0][0], results.data[0][2]);
          if (
            !(
              Number.isInteger(Number(results.data[0][0])) &&
              Number.isInteger(Number(results.data[0][2]))
            )
          ) {
            const header = results.data.shift();
            console.log("igoring the header", results.data, header);
            showWarningToaster(`CSV row#1 is considered as header`);
          }

          results.data.forEach((row, index) => {
            if (row.length < 5) {
              showWarningToaster(`CSV row ${index + 1} is less than 5 columns`);
              csvError = true;
            } else {
              // Check Empty Values
              row.forEach((column, columnIndex) => {
                if (!column) {
                  showWarningToaster(
                    `CSV row#${index + 1} column#${columnIndex + 1} is empty`
                  );
                  csvError = true;
                }
              });

              // Check Index & Rank Integers
              console.log(
                "Checking Index & Rank",
                row[0],
                Number(row[0]),
                row[2],
                Number(row[2])
              );
              if (
                !(
                  Number.isInteger(Number(row[0])) &&
                  Number.isInteger(Number(row[2]))
                )
              ) {
                showWarningToaster(
                  `CSV row#${index + 1} column#1 and column#3 must be integers`
                );
                csvError = true;
              }
            }
          });
          console.log(results.data);
          if (csvError) return;
          setDataObjectLevelsInput((prev) => {
            // console.log(prev);
            return prev.map((level) => {
              if (level.levelId === i) {
                return {
                  ...level,
                  fileName: files[0].name,
                  levelData: results,
                };
              } else {
                return level;
              }
            });
          });
          // console.log("Finished:", results.data);
        },
      });
    }
  };
  const levelsInputContent = useMemo(() => {
    let levelsFormGroup = [];
    for (let j = 1; j <= dataObjectLevels; j++) {
      levelsFormGroup.push(
        <FormGroup
          label={`Level ${j} name`}
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          labelFor="Type"
        >
          <InputGroup onChange={(e) => handleTextInput(e, j)}></InputGroup>
          <FileInput
            hasSelection={
              dataObjectLevelsInput[
                dataObjectLevelsInput.map((item) => item.levelId).indexOf(j)
              ]?.fileName
            }
            disabled={
              dataObjectLevelsInput.map((item) => item.levelId).indexOf(j) < 0
            }
            text={
              dataObjectLevelsInput[
                dataObjectLevelsInput.map((item) => item.levelId).indexOf(j)
              ]?.fileName
                ? dataObjectLevelsInput[
                    dataObjectLevelsInput.map((item) => item.levelId).indexOf(j)
                  ].fileName
                : "Choose file..."
            }
            onInputChange={(e) => csvFileParser(e, j)}
          ></FileInput>
        </FormGroup>
      );
    }
    return levelsFormGroup;
  }, [dataObjectLevels, dataObjectLevelsInput]);
  //console.log("Levels Input",levelsInputContent);
  const createDataObject = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (!dataObjectType) {
        showWarningToaster("Select Data Object Type");
        setIsLoading(false);
        return;
      }

      if (dataObjectLevelsInput.length < dataObjectLevels) {
        showWarningToaster("Levels Entered are less than Levels Count");
        setIsLoading(false);
        return;
      }

      let levelErrors = false;
      dataObjectLevelsInput.forEach((level, index) => {
        if (!level.levelData) {
          showWarningToaster(
            `Level ${level.name} index#${index+1} data is missing`
          );
          levelErrors = true;
        }
      });
      if (levelErrors){
        setIsLoading(false);
        return;
      } 

      try {
        const payload = {
          // name: referenceGroupPopOverOpenName,
          referenceGroupId: referenceGroupPopOverOpenId,
          metaDataLevel2Id: dataObjectType,
          levelsArray: dataObjectLevelsInput.map((level) => {
            return {
              name: level.name,
              elements: level.levelData.data.map((array) => {
                return {
                  index: array[0],
                  label: array[1],
                  rank: array[2],
                  name: array[3],
                  description: array[4],
                };
              }),
            };
          }),
        };
        console.log("payload", payload);
        const response = await addDataObject(payload);
        setReferenceGroups((prev) => ({
          ...prev,
          data: prev.data.map((rGroup) =>
            rGroup.id === referenceGroupPopOverOpenId
              ? {
                  ...rGroup,
                  dataObjects: [response.data.data, ...rGroup.dataObjects],
                }
              : rGroup
          ),
        }));
        showSuccessToaster(response.data.msg);
        clearData();
        setIsLoading(false);
      } catch (error) {
        showDangerToaster(error);
        setIsLoading(false);
      }
    },
    [
      clearData,
      dataObjectLevelsInput,
      dataObjectType,
      referenceGroupPopOverOpenId,
      referenceGroupPopOverOpenName,
      setReferenceGroups,
    ]
  );

  const dataObjectPopOverContent = useMemo(
    () => (
      <div key="text3">
        <H5>Data Object</H5>
        <form onSubmit={createDataObject}>
          {/* <FormGroup label="Name" labelInfo="(required)">
            <InputGroup
              onChange={(e) => setReferenceGroupPopOverOpenName(e.target.value)}
            ></InputGroup>
          </FormGroup> */}
          <FormGroup
            label="Type"
            labelInfo="(required)"
            intent={false ? Intent.DANGER : Intent.NONE}
            // helperText="Error"
            labelFor="Type"
          >
            <HTMLSelect
              onChange={(e) => setDataObjectType(Number(e.target.value))}
            >
              <option selected disabled>
                Select Data Object Type
              </option>
              {metaData ? (
                metaData.map((data) => {
                  const mainLevel = [
                    <option disabled>MDL1 - {data.name}</option>,
                    ...data.metaDataLevel2s.map((l2) => (
                      <option value={l2.id}>{l2.name}</option>
                    )),
                  ];
                  // console.log("options",mainLevel);
                  return mainLevel;
                })
              ) : (
                <option>Loading Data</option>
              )}
            </HTMLSelect>
          </FormGroup>
          <FormGroup
            label="Levels"
            labelInfo="(required)"
            intent={false ? Intent.DANGER : Intent.NONE}
            // helperText="Error"
          >
            <NumericInput
              min="1"
              max="5"
              defaultValue="1"
              onValueChange={(e) => setDataObjectLevels(e)}
            ></NumericInput>
          </FormGroup>
          {levelsInputContent}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 15,
            }}
          >
            <Button
              className={Classes.POPOVER2_DISMISS}
              disabled={false}
              style={{ marginRight: 10 }}
              onClick={() => clearData()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              intent={Intent.SUCCESS}
              className={Classes.POPOVER2_DISMISS}
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    ),
    [metaData, levelsInputContent, isLoading, clearData, createDataObject]
  );
  const newDataObject = (id) => {
    setReferenceGroupPopOverOpenId(id);
    setReferenceGroupContextMenu(null);
  };
  useEffect(() => {
    setReferenceGroupsNodes((prev) =>
      referenceGroups.data.map((rGroup) => {
        return {
          id: rGroup.id,
          icon: "projects",
          isExpanded:
            prev?.find((node) => rGroup.id === node.id)?.isExpanded ?? false,
          label: (
            <Popover2
              popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
              content={dataObjectPopOverContent}
              isOpen={rGroup.id === referenceGroupPopOverOpenId}
              position="right"
            >
              <Popover2
                content={
                  <Menu>
                    <MenuItem
                      textClassName="target_menu"
                      icon="plus"
                      text="New Data Object"
                      onClick={() => newDataObject(rGroup.id)}
                    />
                  </Menu>
                }
                isOpen={rGroup.id === referenceGroupContextMenu}
              >
                {rGroup.name}
              </Popover2>
            </Popover2>
          ),
          childNodes: rGroup?.dataObjects
            ? rGroup.dataObjects.map((dataObject) => {
                return {
                  id: dataObject.id,
                  label: dataObject.metaDataLevel2.name,
                  icon: "diagram-tree",
                  type: "dataObject",
                };
              })
            : [],
        };
      })
    );
  }, [
    referenceGroupContextMenu,
    referenceGroupPopOverOpenId,
    referenceGroups.data,
    dataObjectPopOverContent,
  ]);

  const onNodeCollapse = useCallback(
    (nodeData) =>
      setReferenceGroupsNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeData.id) {
            return { ...node, isExpanded: false };
          } else {
            return node;
          }
        })
      ),
    [setReferenceGroupsNodes]
  );

  const onNodeExpand = useCallback(
    (nodeData) =>
      setReferenceGroupsNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeData.id) {
            return { ...node, isExpanded: true };
          } else {
            return node;
          }
        })
      ),
    [setReferenceGroupsNodes]
  );

  const onNodeContextMenu = useCallback((nodeData, _, e) => {
    e.preventDefault();
    setReferenceGroupContextMenu(nodeData.id);
    // console.log(referenceGroupContextMenu);
  }, []);

  const onNodeClick = useCallback(
    async (node) => {
      console.log(node);
      if (node.type !== "dataObject") return;
      const nodeData = await getDataObject(node.id);

      setWindows((prevWindows) =>
        prevWindows.find(
          (window) =>
            window.data.id === nodeData.data.data.id &&
            window.type === "flowchart"
        )
          ? prevWindows
          : [
              {
                type: "flowchart",
                data: nodeData.data.data,
                id: generateID(),
                collapse: false,
              },
              ...prevWindows,
            ]
      );
    },
    [setWindows]
  );

  console.log(referenceGroupsNodes, referenceGroups);
  return (
    <Tree
      contents={referenceGroupsNodes}
      onNodeExpand={onNodeExpand}
      onNodeCollapse={onNodeCollapse}
      onNodeContextMenu={onNodeContextMenu}
      onNodeClick={onNodeClick}
    />
  );
};
