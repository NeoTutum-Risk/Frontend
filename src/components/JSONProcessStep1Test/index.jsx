import { Button, FileInput, FormGroup, Intent } from "@blueprintjs/core";
import axios from "axios";
import { useState } from "react";
import { findJSONData } from "../../services";

const JSONProcessStep1Test = () => {
  const [selectedFile, setSelectedFile] = useState({ name: null });
  const [responseLink, setResponseLink] = useState(null);

  console.log(responseLink);

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

  return (
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
  );
};

export default JSONProcessStep1Test;
