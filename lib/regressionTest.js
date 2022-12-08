const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    reqBody = {}
    reqBody['refMode'] = args['executionConfigString'] ? args['executionConfigString'] : "SIL"
    console.log("TODO: this is currently unimplemented functionality")
    /*let architecture_uid = await axios.get(EP + "/ep/architectures")
        .then(resp => {
            return resp['data'][0]['uid'] // TODO (here and in ER Record Export): why not just grab all architectures and iterate over them for all scopes?
        })
    let allScopes = await axios.get(EP + `/ep/architectures/${architecture_uid}/scopes?top-level=true`)
        .then(resp => {
            return resp['data']
        })
    reqBody['UIDs'] = []
    for (scope of allScopes) {
        reqBody['UIDs'].push(scope['uid'])
    }
    await axios.post(EP + "/ep/scopes/b2b", reqBody)
        .then(async resp => {
            let data = await poll(resp['data']['jobID']);
            console.log("executed B2B test")
        })
        .catch(error => {
            console.log("failed B2B test!")
            throw error;
        })*/
}

module.exports = {main};