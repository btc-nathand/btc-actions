const { default: axios } = require('axios');
const path = require('path')

async function main(args) {
    if (!args['executionConfig']) throw new Error("Mandatory argument 'executionConfig' not provided for step 'executionRecordImport'")
    if (!args['dir']) throw new Error("Mandatory argument 'dir' not provided for step 'executionRecordImport'")
    resolve = require('path').resolve
    args['dir'] = resolve(args['dir']);
    console.log(args['dir'])

    reqBody = {}
    reqBody['kind'] = args['executionConfig']
    //args['exportFormat'] ? args['exportFormat'] : "MDF"

    var fs = require('fs');
    var files = fs.readdirSync(args['dir']);
    parsedFiles = []
    let suffix = ".mdf"
    if (args['exportFormat'] !== "MDF") suffix = ".xlsx";
    for(var file of files) {
        file = path.join(args['dir'], file);
        if (file.endsWith(suffix)) parsedFiles.push(file)
    }
    reqBody['paths'] = parsedFiles

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
    sleep(10000)

    await axios.post(EP + "/ep/execution-records", reqBody)
        .then(async resp => {
            let data = await poll(resp['data']['jobID']);
            console.log("successfully imported execution records");
        })
        .catch(e => {
            console.log("failed to import execution records")
            throw e;
        })

}

module.exports = {main};