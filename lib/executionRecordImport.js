const { default: axios } = require('axios');
const path = require('path')
const { poll } = require("./helper");

async function main(args) {
    if (!args['executionConfig']) throw new Error("Mandatory argument 'executionConfig' not provided for step 'executionRecordImport'")
    if (!args['dir']) throw new Error("Mandatory argument 'dir' not provided for step 'executionRecordImport'")
    let host_dir = path.join(process.env.GITHUB_WORKSPACE, args['dir']);

    reqBody = {}
    reqBody['kind'] = args['executionConfig']
    //args['exportFormat'] ? args['exportFormat'] : "MDF"

    var fs = require('fs');
    var files = fs.readdirSync(host_dir);
    parsedFiles = []
    let suffix = ".mdf"
    if (args['exportFormat'] !== "MDF") suffix = ".xlsx";
    for(var file of files) {
        file = path.join("/mnt", args['dir'], file);
        if (file.endsWith(suffix)) parsedFiles.push(file)
    }
    reqBody['paths'] = parsedFiles

    await axios.post(EP + "/ep/execution-records", reqBody)
        .then(async resp => {
            let data = await helper.poll(resp['data']['jobID']);
            console.log(data);
            console.log("successfully imported execution records");
        })
        .catch(e => {
            console.log("failed to import execution records")
            throw e;
        })

}

module.exports = {main};