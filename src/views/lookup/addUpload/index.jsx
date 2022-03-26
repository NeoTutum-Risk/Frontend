import {
  Button,
  FileInput,
  FormGroup,
  H5,
  HTMLSelect,
  InputGroup,
  Intent,
  NumericInput,
} from "@blueprintjs/core";
import { Classes, Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { UploadLookupFile, getMetaData } from "../../../services";
import { protfoliosState } from "../../../store/portfolios";
import {
  showDangerToaster,
  showSuccessToaster,
  showWarningToaster,
} from "../../../utils/toaster";
import classes from "../Lookup.module.css";
import Papa from "papaparse";

export const AddUpload = ({loading, setLoading}) => {
  const [newPortfolioNameError, setNewPortfolioNameError] = useState(null);
  const [newPortfolioName, setNewPortfolioName] = useState(null);
  const [isAddPortfolioLoading, setIsAddPortfolioLoading] = useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const setPortfolios = useSetRecoilState(protfoliosState);
  const [dataObjectLevels, setDataObjectLevels] = useState(1);
  const [dataObjectLevelsInput, setDataObjectLevelsInput] = useState([]);
  const [dataObjectType, setDataObjectType] = useState(null);
  const [xType, setXType] = useState(null);
  const [yType, setYType] = useState(null);

  const [metaData, setMetaData] = useState([]);
  const fetchMetaData = useCallback(async () => {
    const { data } = await getMetaData();
    setMetaData(data.data);
  }, []);

  useEffect(() => {
    fetchMetaData();
  }, [fetchMetaData]);

  const addCSVFile = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        setIsAddPortfolioLoading(true);
        setNewPortfolioNameError(null);
        setNewPortfolioName(null);

        const lookupRows = dataObjectLevelsInput[0].levelData.data

        if(!xType || !yType || !dataObjectType || lookupRows.length === 0){
          showDangerToaster('all the fields should be filled')
          return
        }

        const { data } = await UploadLookupFile({
          metaDataLevel2Id: dataObjectType,
          x: xType,
          y: yType,
          lookupRows
        });

        setIsPopOverOpen(false)
        setLoading(!loading)

        showSuccessToaster(`file has been successfully created`);
      } catch (error) {
        setNewPortfolioNameError(error.message);
        showDangerToaster(error.message);
        setIsAddPortfolioLoading(false);
      }
    },
    [newPortfolioName, setPortfolios, dataObjectLevelsInput]
  );


  const csvFileParser = (e, i) => {
    const files = e.target.files;
    //  console.log(files);
    if (files) {
      console.log(files[0].name, i);
      Papa.parse(files[0], {
        complete: function (results) {
          let csvError = false;
          console.log(
            "empty last row check",
            results.data[results.data.length - 1]
          );
          if (results.data[results.data.length - 1].length === 1) {
            const lastRow = results.data.pop();
            console.log("Fixed File", results.data);
            showWarningToaster(
              `CSV row#${results.data.length} is an empty row and is removed`
            );
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
            }
          });
          console.log(results.data);
          if (csvError) return;
          setDataObjectLevelsInput((prev) => {
            if (
              prev.map((item) => item.levelId).indexOf(i) === -1 ||
              prev.length === 0
            ) {
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
          });
        },
      });
    }
  };

  const levelsInputContent = useMemo(() => {
    let levelsFormGroup = [];
    for (let j = 1; j <= dataObjectLevels; j++) {
      levelsFormGroup.push(
        <FormGroup
          label="Upload File"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          labelFor="Type"
        >
          <FileInput
            hasSelection={
              dataObjectLevelsInput[
                dataObjectLevelsInput.map((item) => item.levelId).indexOf(j)
              ]?.fileName
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

  const csvFileContentForm = useMemo(() => (
    <div key="text3">
      <H5>Upload CSV File</H5>
      <form onSubmit={addCSVFile}>
        <FormGroup
          label="Type"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          // helperText="Error"
          labelFor="Type"
        >
          <HTMLSelect onChange={(e) => setDataObjectType(Number(e.target.value))}>
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
          label="X"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          // helperText="Error"
          labelFor="Type"
        >
          <HTMLSelect onChange={(e) => setXType(Number(e.target.value))}>
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
          label="Y"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          // helperText="Error"
          labelFor="Type"
        >
          <HTMLSelect onChange={(e) => setYType(Number(e.target.value))}>
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
            onClick={() => {
              setIsPopOverOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={false}
            intent={Intent.SUCCESS}
            className={Classes.POPOVER2_DISMISS}
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  ));

  return (
    <Popover2
      isOpen={isPopOverOpen}
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      content={csvFileContentForm}
    >
      <Tooltip2 usePortal={false} content={<span>Upload CSV File</span>}>
        <Button
          icon="upload"
          className={classes.btnStyle}
          small
          onClick={() => setIsPopOverOpen(true)}
          intent={Intent.SUCCESS}
        />
      </Tooltip2>
    </Popover2>
  );
};
