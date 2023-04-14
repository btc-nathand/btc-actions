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
    reqBody['overwritePolicy'] = 'OVERWRITE'
    
    var fs = require('fs');
    var files = fs.readdirSync(args['importDir']);
    parsedFiles = []
    
    for(var file of files) {
        file = args['importDir'] + file;
        parsedFiles.push(file)
    }
    reqBody['paths'] = parsedFiles

    await axios
        .put(EP + "/ep/test-cases-rbt", reqBody)
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