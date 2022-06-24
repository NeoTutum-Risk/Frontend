import { Button, FileInput, FormGroup, H5, Intent } from "@blueprintjs/core";
import { Popover2, Classes } from "@blueprintjs/popover2";
import axios from "axios";
import { useState } from "react";
import { findJSONData } from "../../services";

const JSONProcessStep1Test = () => {
  const [selectedFile, setSelectedFile] = useState({ name: null });
  const [responseLink, setResponseLink] = useState(null);
  const [popupState, setPopupState] = useState(false);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();

    formData.append("myFile", selectedFile, selectedFile.name);

    findJSONData(formData).then((res) => {
      setResponseLink(res.data.data);
    });
  };

  const fileReUpload = () => {
    setSelectedFile({ name: null })
    setResponseLink(null)
  }

  const handlePopupClose = () => {
    setPopupState(false);
    setSelectedFile({name: null})
    setResponseLink(null)
  };

  return (
    <Popover2
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      isOpen={popupState}
      content={
        <div key="text">
          <H5>JSON process step 1 test</H5>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "flex-end",
                marginTop: 15,
              }}
            >
      <div>

        {!responseLink && (
          <>
            <FormGroup
              label="Upload File"
              labelInfo="(required)"
              intent={false ? Intent.DANGER : Intent.NONE}
              labelFor="Type"
            >
              <FileInput
                hasSelection={selectedFile?.name}
                text={selectedFile?.name ? selectedFile.name : "Choose file..."}
                onInputChange={onFileChange}
              ></FileInput>
            </FormGroup>

            <Button
                  className={Classes.POPOVER2_DISMISS}
                  style={{ marginRight: 10 }}
                  onClick={handlePopupClose}
                >
                  Cancel
                </Button>
            <Button
              icon="upload"
              onClick={onFileUpload}
              intent={Intent.SUCCESS}
            >
              Upload File
            </Button>
          </>
        )}

        {responseLink && (
          <>
                <Button
                  className={Classes.POPOVER2_DISMISS}
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={handlePopupClose}
                >
                  Cancel
                </Button>
            <Button
              icon="upload"
              style={{marginBottom: 10}}
              onClick={fileReUpload}
              intent={Intent.SUCCESS}
            >
              ReUpload File
            </Button>

            <a href={responseLink.readFile} target="_blank">
              <Button
                icon="link"
                intent={Intent.SUCCESS}
                style={{ margin: "0 .5rem" }}
              >
                Preview File
              </Button>
            </a>

            <a href={responseLink.downloadFile} download target="_blank">
              <Button icon="download" intent={Intent.SUCCESS}>
                Download File
              </Button>
            </a>
          </>
        )}
      </div>
            </div>
          </div>
        </div>
      }
    >
      <div onClick={() => setPopupState(true)}>
        JSON process step 1 test
      </div>
    </Popover2>
  );
};

export default JSONProcessStep1Test;


/*


<div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        {!responseLink && (
          <>
            <FormGroup
              label="Upload File"
              labelInfo="(required)"
              intent={false ? Intent.DANGER : Intent.NONE}
              labelFor="Type"
            >
              <FileInput
                hasSelection={selectedFile?.name}
                text={selectedFile?.name ? selectedFile.name : "Choose file..."}
                onInputChange={onFileChange}
              ></FileInput>
            </FormGroup>

            <Button
              icon="upload"
              onClick={onFileUpload}
              intent={Intent.SUCCESS}
            >
              Upload File
            </Button>
          </>
        )}

        {responseLink && (
          <>
            <Button
              icon="upload"
              onClick={fileReUpload}
              intent={Intent.SUCCESS}
            >
              ReUpload File
            </Button>

            <a href={responseLink.readFile} target="_blank">
              <Button
                icon="link"
                intent={Intent.SUCCESS}
                style={{ margin: "0 .5rem" }}
              >
                Preview File
              </Button>
            </a>

            <a href={responseLink.downloadFile} download target="_blank">
              <Button icon="download" intent={Intent.SUCCESS}>
                Download File
              </Button>
            </a>
          </>
        )}
      </div>
    </div>

*/