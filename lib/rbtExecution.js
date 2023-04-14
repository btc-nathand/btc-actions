const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    reqBody = {}
    if (args['executionConfigString'])
        reqBody['data'] = {execConfigNames: args['executionConfigString']}
    else {
        let execConf = await axios.get(EP + "/ep/execution-configs");
        execConf = execConf['data']['execConfigNames']
        reqBody['data'] = {forceExecute: true, execConfigNames: execConf };
    }

    let tc_uids = await helper.get_uids(args, 'test-cases-rbt');
    reqBody['UIDs'] = tc_uids;

    await axios.post(EP + "/ep/test-cases-rbt/test-execution-rbt", reqBody)
        .then(async resp => {
            let data = await poll(resp['data']['jobID']);
            console.log("successfully executed RBTs")
        })
        .catch(e => {
            console.log("failed to execute RBTs!")
            console.log(e)
            throw e;
        })

    if (args['reportPath']) {
        let scope_uid = await axios.get(EP + "/ep/scopes?top-level=true")
        console.log(scope_uid)
        scope_uid = scope_uid['uid']
        let report_info = await axios.post(EP + "/ep/scopes/"+scope_uid+"/project-report?template-name=rbt")
            .then(async resp => {
                let data = await poll(resp['data']['jobID']);
                return data
            })
        console.log(report_info);
    }

}

module.exports = {main};