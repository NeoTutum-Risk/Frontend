export const getMetaDataL2Util = (metaDataLevel2s) => {
    return metaDataLevel2s.length !== 0
    ? metaDataLevel2s.map((metaData2) => metaData2.name)
    : [];
}
