import { Button, FileInput, FormGroup, H5, Intent, HTMLSelect, NumericInput, InputGroup, Icon } from "@blueprintjs/core";
import { Popover2, Classes } from "@blueprintjs/popover2";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addAnalysisPack, getMetaData } from "../../services";
import {
    showDangerToaster,
    showSuccessToaster,
} from "../../utils/toaster";

const JSONUploadAnalyticsPack = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [configFile, setConfigFile] = useState(null);
    const [validFile, setValidFile] = useState(null);
    const [analysisPackName, setAnalysisPackName] = useState('');
    const [isPopOverOpen, setPopOverOpen] = useState(false);
    const [metaData, setMetaData] = useState([]);
    // const [metaDataIdentifier, setMetaDataIdentifier] = useState(null);
    const [filesCount, setFilesCount] = useState(1);

    const fetchMetaData = useCallback(async () => {
        const { data } = await getMetaData();
        setMetaData(data.data);
    }, []);

    useEffect(() => {
        fetchMetaData();
    }, [fetchMetaData]);

    const resetHandler = useCallback(() => {
        setPopOverOpen(false);
        setFilesCount(1);
        setSelectedFiles([])
        setConfigFile(null)
        setAnalysisPackName('');
    }, [])
  
    const onFileUpload = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                const payload = new FormData();

                payload.append("name", analysisPackName)
                payload.append("fileJSON", configFile)
                payload.append("fileJSON", validFile)

                for (const file of selectedFiles) {
                    payload.append("fileJSON", file.fileData);
                }
                const response = await addAnalysisPack(payload);

                if (response.status >= 200 && response.status < 300) {
                    showSuccessToaster("Analysis Packs Created")
                }
            } catch (error) {
                showDangerToaster("Somthing Went wrong")
                console.log(error);
            }
            resetHandler()
        },
        [filesCount, selectedFiles, configFile],
    )

    const AnalysisPackFileContentForm = useMemo(() => (
        <div key="text3">

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon="cloud-upload" size='15' style={{ margin: '0 10px 0 0' }} />
                <H5>Upload JSON File</H5>
            </div>
            <form onSubmit={onFileUpload}>
                <FormGroup
                    label="Analysis Pack Name"
                    labelInfo="(required)"
                    labelFor="analysisJSONPackName"
                >
                    <InputGroup
                        required
                        id="analysisJSONPackName"
                        value={analysisPackName}
                        onChange={(e) => {
                            setAnalysisPackName(e.target.value);
                        }}
                    />
                </FormGroup>

                <FormGroup
                    label={`Upload Config File`}
                    labelInfo="(required)"
                    intent={false ? Intent.DANGER : Intent.NONE}
                    labelFor="Type"
                >

                    <FileInput
                        hasSelection={configFile?.name}
                        text={configFile?.name ? configFile.name : "Choose file"}
                        // onInputChange={(e) => setSelectedFile([...selectedFile, e.target.files[0]])}
                        onInputChange={(e) => {
                            setConfigFile(e.target.files[0]);
                        }}

                    ></FileInput>

                </FormGroup>
                <FormGroup
                    label={`Upload Validation File`}
                    labelInfo="(required)"
                    intent={false ? Intent.DANGER : Intent.NONE}
                    labelFor="Type"
                >

                    <FileInput
                        hasSelection={validFile?.name}
                        text={validFile?.name ? validFile.name : "Choose file"}
                        onInputChange={(e) => {
                            setValidFile(e.target.files[0]);
                        }}

                    ></FileInput>

                </FormGroup>
                {/* <FormGroup
                    label="Analysis Pack Property"
                    labelInfo="(required)"
                    intent={false ? Intent.DANGER : Intent.NONE}
                    // helperText="Error"
                    labelFor="Type"
                >
                    <HTMLSelect onChange={(e) => setMetaDataIdentifier(Number(e.target.value))}>
                        <option selected disabled>
                            Select MDL1/MDL2 Identifier
                        </option>
                        {metaData ? (
                            metaData.map((data) => {
                                const mainLevel = [
                                    <option disabled>MDL1 - {data.name}</option>,
                                    ...data.metaDataLevel2s.map((l2) => (
                                        <option value={l2.id}>{l2.name}</option>
                                    )),
                                ];
                                return mainLevel;
                            })
                        ) : (
                            <option>Loading Data</option>
                        )}
                    </HTMLSelect>
                </FormGroup> */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: 'column',
                        justifyContent: "flex-end",
                        marginTop: 15,
                    }}
                >
                    <FormGroup
                        label="Levels"
                        labelInfo="(required)"
                        intent={false ? Intent.DANGER : Intent.NONE}
                    >
                        <NumericInput
                            min="1"
                            max="12"
                            defaultValue="1"
                            onValueChange={(e) => setFilesCount(e)}
                        ></NumericInput>
                    </FormGroup>

                    {
                        [...Array(filesCount).keys()].map((_, idx) => {
                            return (
                                <FormGroup
                                    label={`Upload JSON File ${idx + 1}`}
                                    labelInfo="(required)"
                                    intent={false ? Intent.DANGER : Intent.NONE}
                                    labelFor="Type"
                                    key={idx}
                                >
                                    <FileInput
                                        hasSelection={selectedFiles[idx]?.fileData.name}
                                        text={selectedFiles[idx]?.fileData.name ? selectedFiles[idx].fileData.name : "Choose file..."}
                                        onInputChange={(e) => {
                                            setSelectedFiles((prev) => {
                                                if (prev.map((item) => item.fileIdx).indexOf(idx) === -1 || prev.length === 0) {
                                                    return [
                                                        ...prev,
                                                        {
                                                            fileIdx: idx,
                                                            fileData: e.target.files[0]
                                                        },
                                                    ];
                                                } else {
                                                    return prev.map((item) => {
                                                        if (item.fileIdx === idx) {
                                                            return {
                                                                ...item,
                                                                fileData: e.target.files[0]
                                                            }
                                                        } else {
                                                            return item;
                                                        }
                                                    });
                                                }
                                            });
                                        }}

                                    ></FileInput>

                                </FormGroup>
                            )
                        })
                    }

                </div>
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
                        onClick={resetHandler}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={false}
                        intent={Intent.SUCCESS}
                        className={Classes.POPOVER2_DISMISS}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    ));


    return (

        <>
            <Popover2
                isOpen={isPopOverOpen}
                popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                content={AnalysisPackFileContentForm}
            >

                <div onClick={() => setPopOverOpen(true)} >
                    Upload JSON Analysis Packs
                </div>
            </Popover2>
        </>


    );
};

export default JSONUploadAnalyticsPack;

