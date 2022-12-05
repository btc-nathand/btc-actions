const { default: axios } = require("axios");

async function main(args) {
    
    // execute all formal tests
    const data = await axios 
    .post(EP + "/ep/execute-formal-test", {})
    .then(async resp => {
        const data = await helper.poll(resp['data']['jobID']);

        
        
    })
    .catch(error => {
        console.log("Could not import model!");
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
    const scopesList = await axios.get(EP + "/EP/scopes")
    .then(async resp => {
            return resp['data']
    })
    req = {}
    req['executionConfigNames'] = args['executionConfigNames'] ? ['executionConfigNames'] : execConfigs
    req['UIDs'] = scopesList.map(scope => scope['uid']);
    
    await axios
        .post(EP + "/ep/scopes/formal-test-reports", req)
        .then()
    return data;
}

module.exports = {main};