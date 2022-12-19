import React, { useState, useEffect, useCallback } from "react";
// import { Button, Dialog } from "@blueprintjs/core";
// import { Table, Column } from "../../components/table";
import classes from "../metaData/MetaData.module.css";
import { getAnalysisPacksRuns } from "../../services";
import { Table } from "../../components/table";

const columns = [
    { value: "filePath", width: 550 },
    { value: "riskAssessmentId", width: 100 },
    { value: "property", width: 200 },
    { value: "jsonRunType", width: 100 },
    { value: "createdAt", width: 200 },

];

const AnalysisPackRunFiles = () => {
    const [analysisPacksRunFiles, setAnalysisPacksRunFiles] = useState([]);

    const initialiseAnalysisPackRunFiles = useCallback(async () => {
        const res = await getAnalysisPacksRuns();

        const { data } = res.data;

        if (res.status === 200 || res.status === 304) {
            setAnalysisPacksRunFiles(data);
        }
    }, [setAnalysisPacksRunFiles]);

    useEffect(() => {
        initialiseAnalysisPackRunFiles();
    }, [initialiseAnalysisPackRunFiles]);

    // const handleDownloadOperation = (id) => {

    // };

    const operations = {
        download: {  width: 200 },
    };

    return (
        <>
            <div className={classes.metaDataContainer}>
                <div className={classes.tableContainer}>
                    <Table
                        width={"100%"}
                        height={"100%"}
                        data={analysisPacksRunFiles}
                        columns={columns.map((column) => ({
                            field: column.value,
                            resizable: true,
                            width: column.width,
                        }))}
                        tableFullWidth={true}
                        operations={operations}
                    />
                </div>
            </div>
        </>
    );
};

export default AnalysisPackRunFiles;
