const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    if (!args['importDir']) {
        console.log("Mandatory argument 'importDir' not provided for step 'vectorImport'")
        throw new Error("Mandatory argument 'importDir' not provided for step 'vectorImport'")
    }
    resolve = require('path').resolve;
    args['importDir'] = resolve(args['importDir']);
    if(args['importDir'][0] != "/") args['importDir'] += '/';
    reqBody = {}
    reqBody['format'] = args['vectorFormat'] ? args['vectorFormat'] : "EXCEL"
    reqBody['vectorKind'] = args['vectorKind'] ? args['vectorKind'] : "TC"
    if (!reqBody['format'] == "EXCEL" && !reqBody['format'] == "CSV" && !reqBody['format'] == "TC") {
        console.log("'format' argument for step 'vectorImport' must be EXCEL, CSV, or TC")
        throw new Error("'format' argument for step 'vectorImport' must be EXCEL, CSV, or TC");
    }
    if (!reqBody['vectorKind'] == "TC" && !reqBody['vectorKind'] == "SV") {
        console.log("'format' argument for step 'vectorImport' must be EXCEL, CSV, or TC")
        throw new Error("'vectorKind' argument for step 'vectorImport' must be SV or TC");
    }
    reqBody['overwritePolicy'] = 'OVERWRITE'
    
    var fs = require('fs');
    var files = fs.readdirSync(args['importDir']);
    parsedFiles = []
    let suffix = ".xlsx"
    switch (vectorFormat) {
        case "CSV":
            suffix = ".csv"
            break
        case "TC":
            suffix = ".tc"
            break
    }
    for(var file of files) {
        file = args['importDir'] + file;
        if (file.endsWith(suffix)) parsedFiles.push(file)
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