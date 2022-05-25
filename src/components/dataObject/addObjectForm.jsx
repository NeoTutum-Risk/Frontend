import {
  Intent,
  Spinner,
  Switch,
  Icon,
  Menu,
  MenuDivider,
  Classes,
  MenuItem,
  H5,
  FormGroup,
  InputGroup,
  Button,
  HTMLSelect,
  TextArea,
  FileInput,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import Papa from "papaparse";
import { addNewDataObjects } from "../../services";
import { useCallback, useState } from "react";
import {showWarningToaster} from "../../utils/toaster";
export const AddObjectForm = ({ setAddNewObjectDialog, getData }) => {
  const [IOType, setIOType] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [chronType, setChronType] = useState(null);
  const [arrayType, setArrayType] = useState(null);
  const [objectType, setObjectType] = useState("array");
  const [arrayName, setArrayName] = useState(null);
  const [arrayContent, setArrayContent] = useState(null);
  const [arrayDescription, setArrayDescription] = useState(null);
  const [array, setArray] = useState(null);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [importObjectFile, setImportObjectFile] = useState(null);
  const [url, setURL] = useState(null);
  const clearForm = useCallback(() => {
    setIOType(null);
    setName(null);
    setDescription(null);
    setChronType(null);
    setArrayType(null);
    setArrayName(null);
    setArrayDescription(null);
    setArray(null);
    setIsServiceLoading(false);
    setAddNewObjectDialog(false);
    setImportObjectFile(null);
    setURL(null);
  }, [setAddNewObjectDialog]);

  const handleSubmit = useCallback(async () => {
    console.log("payload array",array);
    let payload = new FormData();
    if (objectType === "array") {
      payload.append("IOtype",IOType);
      payload.append("name",name);
      payload.append("description",description);
      payload.append("chronType",chronType);
      payload.append("arrayType",chronType);
      payload.append("arrayName",arrayName);
      payload.append("arrayDescription",arrayDescription);
      payload.append("array",JSON.stringify(array));
      payload.append("fileCSV", importObjectFile);
      payload.append("url",url);
    } else {
      payload.append("IOtype",IOType);
      payload.append("name",name);
      payload.append("description",description);
      payload.append("chronType",chronType);
    }

    const response = await addNewDataObjects(payload);
    if (response.status ===200) {
      getData();
      clearForm();
    }
  }, [
    getData,
    IOType,
    name,
    description,
    chronType,
    // arrayType,
    arrayName,
    arrayDescription,
    array,
    url,
    importObjectFile,
    objectType,
    clearForm
  ]);
  const clearEmpty = useCallback((results)=>{
    if (results.data[results.data.length - 1].length === 1) {
      const lastRow = results.data.pop();
      console.log("Fixed File", results.data);
      showWarningToaster(
        `CSV row#${results.data.length} is an empty row and is removed`
      );
      clearEmpty(results);
    }else{
      return results;
    }
  },[]) 
  const csvFileParser = (e) => {
    const files = e.target.files;
    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          clearEmpty(results);
          // if (results.data[results.data.length - 1].length === 1) {
          //   const lastRow = results.data.pop();
          //   console.log("Fixed File", results.data);
          //   showWarningToaster(
          //     `CSV row#${results.data.length} is an empty row and is removed`
          //   );
          // }

          console.log(results.data);
          setArray(results.data);
        }
      });
    }
  };

  return (
    <div
      key="text3"
      style={{
        backgroundColor: "#30404D",
        color: "white",
        padding: "10px",
        borderRadius: "2px",
      }}
    >
      <H5 style={{ color: "white" }}>New Data Object</H5>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormGroup
          label="I/O Type"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          // helperText="Error"
          labelFor="I/O Type"
        >
          <HTMLSelect onChange={(e) => setIOType(e.target.value)}>
            <option selected disabled>
              I/O Type
            </option>
            <option value="Input">Input</option>
            <option value="Onput">Output</option>
          </HTMLSelect>
        </FormGroup>
        <FormGroup label="Name" labelInfo="(required)" labelFor="newObjectName">
          <InputGroup
            required
            id="newObjectName"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup
          label="Description"
          labelInfo="(required)"
          labelFor="newObjectDescription"
        >
          <TextArea
            required
            value={description}
            fill={true}
            id="newObjectDescription"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup
          label="Chron/Array Type"
          labelInfo="(required)"
          intent={false ? Intent.DANGER : Intent.NONE}
          // helperText="Error"
          labelFor="Array Type"
        >
          <HTMLSelect onChange={(e) => setChronType(e.target.value)}>
            <option selected disabled>
              Array Type
            </option>
            <option value="Snapshot">Snapshot</option>
            <option value="TSeries">TSeries</option>
          </HTMLSelect>
        </FormGroup>
        <RadioGroup
          label="Object Type"
          onChange={(e) => setObjectType(e.target.value)}
          selectedValue={objectType}
          inline={true}
        >
          <Radio label="Array Type" value="array" />
          <Radio label="Text Type" value="type" />
        </RadioGroup>
        {objectType === "array" ? (
          <>
            <FormGroup
              label="Array Name"
              labelInfo="(required)"
              labelFor="arrayName"
            >
              <InputGroup
                required
                id="arrayName"
                value={arrayName}
                onChange={(event) => {
                  setArrayName(event.target.value);
                }}
              />
            </FormGroup>
            <FormGroup
              label="Array Description"
              labelInfo="(required)"
              labelFor="arrayDescription"
            >
              <TextArea
                required
                value={arrayDescription}
                fill={true}
                id="arrayDescription"
                onChange={(event) => {
                  setArrayDescription(event.target.value);
                }}
              />
            </FormGroup>
            <FormGroup
              label={`Array`}
              labelInfo="(required)"
              intent={false ? Intent.DANGER : Intent.NONE}
              labelFor="Type"
            >
              {}
              <FileInput
                fill={true}
                hasSelection={arrayContent}
                text={
                  arrayContent?.name
                    ? arrayContent?.name
                    : "Choose file..."
                }
                onInputChange={(e) => csvFileParser(e)}
              ></FileInput>
            </FormGroup>
            <FormGroup
                label={`Attachment`}
                labelInfo="(required)"
                intent={false ? Intent.DANGER : Intent.NONE}
                labelFor="Type"
              >
                {}
                <FileInput
                  fill={true}
                  hasSelection={importObjectFile}
                  text={
                    importObjectFile?.name
                      ? importObjectFile?.name
                      : "Choose file..."
                  }
                  onInputChange={(e) => {console.log(e);setImportObjectFile(e.target.files[0]);}}
                ></FileInput>
              </FormGroup>
              <FormGroup label="URL" labelInfo="(required)" labelFor="newObjectURL">
          <InputGroup
            required
            id="newObjectURL"
            value={url}
            onChange={(event) => {
              setURL(event.target.value);
            }}
          />
        </FormGroup>
          </>
        ) : null/*(
          <FormGroup label="Text" labelInfo="(required)" labelFor="texttype">
            <TextArea
              required
              value={description}
              fill={true}
              id="texttype"
              onChange={(event) => {
                setArrayDescription(event.target.value);
              }}
            />
          </FormGroup>
            )*/}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          <Button
            disabled={isServiceLoading}
            style={{ marginRight: 10 }}
            onClick={() => {
              clearForm();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isServiceLoading}
            intent={Intent.SUCCESS}
            // onClick={addPortfolio}
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};
