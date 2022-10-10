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
  Checkbox,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import Papa from "papaparse";
import { Classes, Popover2, Tooltip2 } from "@blueprintjs/popover2";
import cloneDeep from "lodash/cloneDeep";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { referenceGroupsState } from "../../../../store/referenceGroups";
import {
  getMetaData,
  getMetaDataL2,
  getDataObject,
  CloneDataObject,
} from "../../../../services";
import {
  addDataObject,
  updateDataObject,
  updateReferenceGroupStatus,
} from "../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
  showWarningToaster,
} from "../../../../utils/toaster";
import {
  windowFamily,
  windowsIds,
  windowsState,
} from "../../../../store/windows";
import { generateID } from "../../../../utils/generateID";
import { mapStatusToIcon } from "../../../../utils/mapStatusToIcon";
import { windowDefault } from "../../../../constants";
export const ReferenceGroups = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [append, setAppend] = useState(false);
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
  const [dataObjectContextMenu, setDataObjectContextMenu] = useState(null);
  const [metaData, setMetaData] = useState([]);
  const [metaDataL2, setMetaDataL2] = useState([]);
  const [dataObjectType, setDataObjectType] = useState(null);
  const [dataObjectClone, setDataObjectClone] = useState(null);
  const [dataObjectLevels, setDataObjectLevels] = useState(1);
  const [dataObjectLevelsInput, setDataObjectLevelsInput] = useState([]);
  const fetchMetaData = useCallback(async () => {
    const { data } = await getMetaData();
    setMetaData(data.data);
  }, []);

  const fetchMetaDataL2 = useCallback(async () => {
    const { data } = await getMetaDataL2();
    setMetaDataL2(data.data);
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
    setDataObjectContextMenu(null);
  });

  const clearData = useCallback(() => {
    setReferenceGroupPopOverOpenId(null);
    setDataObjectType(null);
    setDataObjectLevels(1);
    setDataObjectLevelsInput([]);
    setIsLoading(false);
    setAppend(false);
    setDataObjectClone(null);
  }, [
    setReferenceGroupPopOverOpenId,
    setDataObjectType,
    setDataObjectLevels,
    setDataObjectLevelsInput,
  ]);

  const onDataObjectStateChange = useCallback(
    async ({ status, dataObjectId, referenceGroupId }) => {
      try {
        const response = await updateDataObject(dataObjectId, {
          status: status,
        });
        if (status === "commit") {
          const updateRGStatus = await updateReferenceGroupStatus(
            referenceGroupId,
            { status: "commit" }
          );
        }
        setReferenceGroups((prev) => ({
          ...prev,
          data: prev.data.map((rGroup) => {
            if (rGroup.id !== referenceGroupId) {
              return rGroup;
            } else {
              return {
                ...rGroup,
                dataObjects: rGroup.dataObjects.map((object) =>
                  object.id === dataObjectId
                    ? { ...object, status: response.data.data.status }
                    : object
                ),
              };
            }
          }),
        }));
        showSuccessToaster(`${status} successfully`);
      } catch (error) {
        showDangerToaster(error?.response?.data?.msg ?? error.message);
      }
    },
    [setReferenceGroups]
  );
  useEffect(() => {
    fetchMetaData();
    fetchMetaDataL2();
  }, [fetchMetaData, fetchMetaDataL2]);

  const handleTextInput = (e, i) => {
    setDataObjectLevelsInput((prev) => {
      if (
        prev.map((item) => item.levelId).indexOf(i) === -1 ||
        prev.length === 0
      ) {
        //(prev.map((item) => item.levelId).indexOf(i));
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
    //  (files);
    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          let csvError = false;

          if (results.data[results.data.length - 1].length === 1) {
            const lastRow = results.data.pop();
            showWarningToaster(
              `CSV row#${results.data.length} is an empty row and is removed`
            );
          }

          //return;
          if (
            !(
              Number.isInteger(Number(results.data[0][0])) &&
              Number.isInteger(Number(results.data[0][2]))
            )
          ) {
            const header = results.data.shift();
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
          if (csvError) return;
          setDataObjectLevelsInput((prev) => {
            if (
              prev.map((item) => item.levelId).indexOf(i) === -1 ||
              prev.length === 0
            ) {
              //(prev.map((item) => item.levelId).indexOf(i));
              return [
                ...prev,
                {
                  levelId: i,
                  name: files[0].name,
                  levelData: results,
                  fileName: files[0].name,
                },
              ];
            } else {
              return prev.map((item) => {
                if (item.levelId === i) {
                  return {
                    ...item,
                    name: files[0].name,
                    levelData: results,
                    fileName: files[0].name,
                  };
                } else {
                  return item;
                }
              });
            }

            // (prev);
            // return prev.map((level) => {
            //   if (level.levelId === i) {
            //     return {
            //       ...level,
            //       fileName: files[0].name,
            //       levelData: results,
            //     };
            //   } else {
            //     return level;
            //   }
            // });
          });
          // ("Finished:", results.data);
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
          {/* <InputGroup onChange={(e) => handleTextInput(e, j)}></InputGroup> */}
          <FileInput
            hasSelection={
              dataObjectLevelsInput[
                dataObjectLevelsInput.map((item) => item.levelId).indexOf(j)
              ]?.fileName
            }
            // disabled={
            //   dataObjectLevelsInput.map((item) => item.levelId).indexOf(j) < 0
            // }
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
  //("Levels Input",levelsInputContent);
  const createDataObject = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (!dataObjectType) {
        showWarningToaster("Select Data Object Type");
        setIsLoading(false);
        return;
      }

      if (dataObjectLevelsInput.length < dataObjectLevels && !dataObjectClone) {
        showWarningToaster("Levels Entered are less than Levels Count");
        setIsLoading(false);
        return;
      }

      let levelErrors = false;
      dataObjectLevelsInput.forEach((level, index) => {
        if (!level.levelData) {
          showWarningToaster(
            `Level ${level.name} index#${index + 1} data is missing`
          );
          levelErrors = true;
        }
      });
      if (levelErrors) {
        setIsLoading(false);
        return;
      }

      try {
        const payload = {
          // name: referenceGroupPopOverOpenName,
          referenceGroupId: referenceGroupPopOverOpenId,
          metaDataLevel2Id: dataObjectType,
          append,
          clone: dataObjectClone,
          levelsArray: dataObjectClone
            ? null
            : dataObjectLevelsInput.map((level) => {
                return {
                  name: level.name,
                  elements: level.levelData.data.map((array) => {
                    return {
                      index: array[0],
                      label: array[1],
                      rank: array[2],
                      level: array[3],
                      color: array[4],
                      name: array[5],
                      description: array[6],
                      type: array[7].split(","),
                      scalar: array[8].split(","),
                    };
                  }),
                };
              }),
        };

        const response = await addDataObject(payload);
        if (response.data.error && response.status !== 200) {
          showDangerToaster(
            `Error Creating Data Object: ${response.data.error}`
          );
        } else {
          const metaDataLevel2 = metaDataL2.find(
            (data) => data.id === response.data.data.metaDataLevel2Id
          );
          setReferenceGroups((prev) => ({
            ...prev,
            data: prev.data.map((rGroup) =>
              rGroup.id === referenceGroupPopOverOpenId
                ? {
                    ...rGroup,
                    dataObjects: rGroup.dataObjects
                      ? [
                          { ...response.data.data, metaDataLevel2 },
                          ...rGroup.dataObjects.filter(
                            (data) =>
                              data.metaDataLevel2Id !==
                              response.data.data.metaDataLevel2Id
                          ),
                        ]
                      : [{ ...response.data.data, metaDataLevel2 }],
                  }
                : rGroup
            ),
          }));
          showSuccessToaster(response.data.msg);
          clearData();
        }

        setIsLoading(false);
      } catch (error) {
        showDangerToaster(error);
        setIsLoading(false);
      }
    },
    [
      append,
      clearData,
      dataObjectLevelsInput,
      dataObjectType,
      referenceGroupPopOverOpenId,
      setReferenceGroups,
      dataObjectLevels,
      metaDataL2,
      dataObjectClone,
    ]
  );

  const dataObjectPopOverContent = useMemo(
    () => (
      <div key="text3" style={{ zIndex: 9000000 }}>
        <H5>Data Object</H5>
        <form onSubmit={createDataObject}>
          {/* <FormGroup label="Name" labelInfo="(required)">
            <InputGroup
              onChange={(e) => setReferenceGroupPopOverOpenName(e.target.value)}
            ></InputGroup>
          </FormGroup> */}
          <FormGroup
            label="Target Data Object"
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
                  // ("options",mainLevel);
                  return mainLevel;
                })
              ) : (
                <option>Loading Data</option>
              )}
            </HTMLSelect>
          </FormGroup>
          {!append && (
            <FormGroup label="Source Data Object" labelInfo="(optional)">
              <HTMLSelect
                onChange={(e) => setDataObjectClone(Number(e.target.value))}
              >
                <option selected={!dataObjectClone} disabled>
                  Clone Data Object
                </option>
                {referenceGroups ? (
                  referenceGroups.data.map((refGrp) => {
                    const mainLevel = [
                      <option disabled>{refGrp.name}</option>,
                      ...refGrp.dataObjects.map((obj) => (
                        <option value={obj.metaDataLevel2.id}>
                          {obj.metaDataLevel2.name}
                        </option>
                      )),
                    ];
                    // ("options",mainLevel);
                    return mainLevel;
                  })
                ) : (
                  <option>Loading Data</option>
                )}
              </HTMLSelect>
              {
                dataObjectClone && <Button
                  style={{ paddingLeft: "15px" }}
                  text="Clear Cloning"
                  onClick={() => setDataObjectClone(null)}
                />
              }
            </FormGroup>
          )}

          {!dataObjectClone && (
            <>
              {" "}
              <Checkbox
                disabled={dataObjectClone}
                label="Append"
                value={append}
                onChange={() => setAppend((prev) => !prev)}
              />
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
            </>
          )}
          {!dataObjectClone && levelsInputContent}
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
              intent={append ? Intent.SUCCESS : Intent.DANGER}
              className={Classes.POPOVER2_DISMISS}
            >
              {append ? "Append" : "Create New"}
            </Button>
          </div>
        </form>
      </div>
    ),
    [
      metaData,
      levelsInputContent,
      isLoading,
      clearData,
      createDataObject,
      append,
      referenceGroups,
      dataObjectClone
    ]
  );
  const newDataObject = (id) => {
    setReferenceGroupPopOverOpenId(id);
    setReferenceGroupContextMenu(null);
    setDataObjectContextMenu(null);
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
                  label: (
                    <Popover2
                      isOpen={dataObject?.id === dataObjectContextMenu}
                      content={
                        <Menu>
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName="target_menu"
                            icon="upload"
                            text="commit"
                            onClick={() => {
                              setDataObjectContextMenu(null);
                              onDataObjectStateChange({
                                dataObjectId: dataObject.id,
                                status: "commit",
                                referenceGroupId: dataObject.referenceGroupId,
                              });
                            }}
                          />
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName="target_menu"
                            icon="upload"
                            text="change"
                            onClick={() => {
                              setDataObjectContextMenu(null);
                              onDataObjectStateChange({
                                dataObjectId: dataObject.id,
                                status: "change",
                                referenceGroupId: dataObject.referenceGroupId,
                              });
                            }}
                          />
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName="target_menu"
                            icon="upload"
                            text="close"
                            onClick={() => {
                              setDataObjectContextMenu(null);
                              onDataObjectStateChange({
                                dataObjectId: dataObject.id,
                                status: "close",
                                referenceGroupId: dataObject.referenceGroupId,
                              });
                            }}
                          />
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName="target_menu"
                            icon="upload"
                            text="archive"
                            onClick={() => {
                              setDataObjectContextMenu(null);
                              onDataObjectStateChange({
                                dataObjectId: dataObject.id,
                                status: "archive",
                                referenceGroupId: dataObject.referenceGroupId,
                              });
                            }}
                          />
                        </Menu>
                      }
                    >
                      {metaData.find(
                        (item) =>
                          item.id === dataObject.metaDataLevel2.metaDataLevel1Id
                      )?.name +
                        "." +
                        dataObject.metaDataLevel2.name}
                    </Popover2>
                  ),
                  icon: "diagram-tree",
                  type: "dataObject",
                  secondaryLabel: (
                    <Tooltip2 content={dataObject.status}>
                      <Icon
                        style={{ marginLeft: 16 }}
                        icon={mapStatusToIcon(dataObject.status)}
                      />
                    </Tooltip2>
                  ),
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
    metaData,
    dataObjectContextMenu,
    onDataObjectStateChange,
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
    if (nodeData.type === "dataObject") {
      setDataObjectContextMenu(nodeData.id);
    } else {
      setReferenceGroupContextMenu(nodeData.id);
    }

    // ("context",nodeData);
  }, []);

  const checkMaximized = useRecoilCallback(
    ({ set, snapshot }) =>
      () => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;

        return getWindowsIdsList.find(
          (element) =>
            snapshot.getLoadable(windowFamily(element)).contents.maximized
        );
      },
    []
  );

  // handle the add new reference group window
  // if a reference group window exists then don't add a new reference group window
  // if it doesn't exists then add a new reference group window
  const setWindowCallBack = useRecoilCallback(
    ({ set, snapshot }) =>
      (nodeData) => {
        const getWindowsIdsList = snapshot.getLoadable(windowsIds).contents;

        const windowId = getWindowsIdsList.find((windowId) => {
          const window = snapshot.getLoadable(windowFamily(windowId)).contents;

          return (
            window.data.id === nodeData.data.data.id &&
            window.type === "flowchart"
          );
        });

        if (windowId) {
          return;
        }

        const check = checkMaximized();

        if (check) {
          let old = snapshot.getLoadable(windowFamily(check)).contents;
          set(windowFamily(check), {
            ...old,
            maximized: false,
            collapse: true,
          });
        }

        const id = generateID();
        const windowData = {
          type: "flowchart",
          data: nodeData.data.data,
          id,
          collapse: false,
          width: windowDefault.width,
          height: windowDefault.height,
          maximized: check ? true : false,
        };

        set(windowsIds, (prev) => [id, ...prev]);
        set(windowFamily(id), windowData);
      },
    []
  );

  const onNodeClick = useCallback(
    async (node) => {
      if (node.type !== "dataObject") return;
      const nodeData = await getDataObject(node.id);

      setWindowCallBack(nodeData);
      /*
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
                width: windowDefault.width,
                height: windowDefault.height,
                maximized: false
              },
              ...prevWindows,
            ]
      );
      */
    },
    [setWindows]
  );

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
