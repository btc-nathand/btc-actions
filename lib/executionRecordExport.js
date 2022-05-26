const { default: axios } = require('axios');
const { poll } = require('./helper');

async function main(args) {
    if (!args['executionConfig']) throw new Error("Mandatory argument 'executionConfig' not provided for step 'executionRecordExport'")
    console.log("TODO: currently executionConfig is not used.")
    if (!args['dir']) throw new Error("Mandatory argument 'dir' not provided for step 'executionRecordExport'")
    resolve = require('path').resolve
    args['dir'] = resolve(args['dir']);

    reqBody = {}
    reqBody['exportDirectory'] = args['dir']
    reqBody['exportFormat'] = args['exportFormat'] ? args['exportFormat'] : "MDF"

    let er_uid = await helper.get_uids(args, 'execution-records');
    
    reqBody['UIDs'] = er_uid;
    console.log(reqBody)

    await axios.post(EP + "/ep/execution-records-export", reqBody)
        .then(async resp => {
            let data = await poll(resp['data']['jobID'])
            console.log(data)
            console.log('successfully exported execution records')
        })
        .catch(error => {
            console.log("failed to export execution records");
            throw error;
        })
}

module.exports = {main};