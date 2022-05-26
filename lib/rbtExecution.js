const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    // data validation
    if(!args['reportSource']) args['reportSource'] = "SCOPE"
    if (args['reportSource'] !== "SCOPE" && args['reportSource'] !== "REQUIREMENT")
        throw new Error("valid values for reportSource are 'SCOPE' or 'REQUIREMENT")
    if(!args['createReport']) args['createReport'] = false;
    
    reqBody = {}
    if (args['executionConfigString'])
        reqBody['data'] = {execConfigNames: args['executionConfigString']}
    else reqBody['data'] = {forceExecute: true}

    let tc_uids = await helper.get_uids(args, 'test-cases-rbt');
    reqBody['UIDs'] = tc_uids;
    reqBody['data']['execConfigNames'] = ["SL MIL"]
    console.log(reqBody);

    await axios.post(EP + "/ep/test-cases-rbt/test-execution-rbt", reqBody)
        .then(async resp => {
            let data = await poll(resp['data']['jobID']);
            console.log(data);
            console.log("successfully executed RBTs")
        })
        .catch(e => {
            console.log("failed to execute RBTs!")
            throw e;
        })

}

module.exports = {main};