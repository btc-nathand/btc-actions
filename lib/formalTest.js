const { default: axios } = require("axios");

async function main(args) {
    // execute all formal tests
    const data = await axios 
    .post(EP + "/ep/execute-formal-test", {})
    .then(async resp => {
        const data = await helper.poll(resp['data']['jobID']);
    })
    .catch(error => {
        console.log("Could not execute formal tests!");
        throw error;
    });

    // generate report on all scopes
    const execConfigs = await axios.get(EP + "/ep/execution-configs")
    .then(async resp => {
        return resp['data'];
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
    req['executionConfigInfo'] = args['executionConfigNames'] ? ['executionConfigNames'] : execConfigs
    req['UIDs'] = scopesList.map(scope => scope['uid']);

    const reportUID = await axios
        .post(EP + "/ep/scopes/formal-test-reports", req)
        .then(async resp => {
            return resp['data']['uid'];
        })
    
    // export report
    req = {}
    req['exportPath'] = path.join("/mnt", args['exportPath'] ? args['exportPath'] : "/");
    if(args['exportName']) req['newName'] = args['exportName'];
    await axios
        .post(EP + "/ep/reports/" + reportUID, req)
        .then(resp => {
            console.log("exported report");
            console.log(resp['data']);
        })
    
}

module.exports = {main};