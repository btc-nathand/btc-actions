const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    if (!args['importDir']) throw new Error("Mandatory argument 'importDir' not provided for step 'vectorImport'")
    resolve = require('path').resolve;
    args['importDir'] = resolve(args['importDir']);
    if(args['importDir'][0] != "/") args['importDir'] += '/';
    reqBody = {}
    reqBody['format'] = args['vectorFormat'] ? args['vectorFormat'] : "EXCEL"
    reqBody['vectorKind'] = args['vectorKind'] ? args['vectorKind'] : "TC"
    if (!reqBody['format'] == "EXCEL" && !reqBody['format'] == "CSV" && !reqBody['format'] == "TC")
        throw new Error("'format' argument for step 'vectorImport' must be EXCEL, CSV, or TC");
    if (!reqBody['vectorKind'] == "TC" && !reqBody['vectorKind'] == "SV")
        throw new Error("'vectorKind' argument for step 'vectorImport' must be SV or TC");
    reqBody['overwritePolicy'] = 'OVERWRITE'
    
    var fs = require('fs');
    var files = fs.readdirSync(args['importDir']);
    parsedFiles = []
    for(var file of files) {
        file = args['importDir'] + file;
        parsedFiles.push(file)
        // TODO: only import files that match the vectorFormat
    }
    reqBody['paths'] = parsedFiles

    await axios
        .put(EP + "/ep/stimuli-vectors", reqBody)
        .then(async resp => {
            const data = await poll(resp['data']['jobID']);
            console.log("vectors imported successfully");
            //console.log(data['result']['importStatus'])
        })
        .catch(error => {
            console.log("failed to import vectors");
            throw error;
        })
    
}

module.exports = {main};