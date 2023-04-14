const { default: axios } = require("axios");
const path = require('path')

async function main(args) {
    // execute all formal tests
    const data = await axios 
    .post(EP + "/ep/execute-formal-test", {})
    .then(async resp => {
        const data = await helper.poll(resp['data']['jobID']);
        console.log("executed test");
    })
    .catch(error => {
        console.log("Could not execute formal tests!");
        throw error;
    });

    // generate report on all scopes
    const execConfigs = await axios.get(EP + "/ep/execution-configs")
    .then(async resp => {
        return resp['data']['execConfigNames'];
    })
    .catch(error => {
        console.log("Couldnt find available architectures in profile; defaulting to SIL.")
        return 'SIL';
    })
    const scopesList = await axios.get(EP + "/ep/scopes")
    .then(async resp => {
            return resp['data']
    })
    req = {}
    if (args['executionConfigNames']) { // list
        execConfigs = args['executionConfigNames'];
    }
    req['executionConfigInfo'] = {"executionConfigNames": execConfigs}
    req['UIDs'] = scopesList.map(scope => scope['uid']);

    const reportUID = await axios
        .post(EP + "/ep/scopes/formal-test-reports", req)
        .then(async resp => {
            const data = await helper.poll(resp['data']['jobID']);
            console.log(data['result'])
            return data['result']['uid']; // returns dict in array
        })
    console.log(reportUID);
    // export report
    req = {}
    req['exportPath'] = path.join("/mnt", args['exportPath'] ? args['exportPath'] : "/");
    if(args['exportName']) req['newName'] = args['exportName'];
    console.log(req);
    await axios
        .post(EP + "/ep/reports/" + reportUID, req)
        .then(resp => {
            console.log("exported report to repo");
        })
    
}

module.exports = {main};