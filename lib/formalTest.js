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
    console.log(execConfigs);
    const scopesList = await axios.get(EP + "/ep/scopes")
    .then(async resp => {
            return resp['data']
    })
    console.log(scopesList);
    req = {}
    if (args['executionConfigNames']) { // list
        execConfigs = args['executionConfigNames'];
    }
    req['executionConfigInfo'] = {"executionConfigNames": execConfigs}
    req['UIDs'] = scopesList.map(scope => scope['uid']);

    console.log(req);
    const reportUID = await axios
        .post(EP + "/ep/scopes/formal-test-reports", req)
        .then(async resp => {
            const data = await helper.poll(resp['data']['jobID']);
            console.log(data)
            return resp['data'][0]['uid']; // returns dict in array
        })
    
    // export report
    req = {}
    req['exportPath'] = path.join("/mnt", args['exportPath'] ? args['exportPath'] : "/");
    if(args['exportName']) req['newName'] = args['exportName'];
    await axios
        .post(EP + "/ep/reports/" + reportUID, req)
        .then(resp => {
            console.log("exported report to repo");
        })
    
}

module.exports = {main};