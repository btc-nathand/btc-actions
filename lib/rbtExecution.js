const { default: axios } = require("axios");
const { poll } = require("./helper");
const path = require("path");

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
        scope_uid = scope_uid['data'][0]['uid']
        let report_info = await axios.post(EP + "/ep/scopes/"+scope_uid+"/project-report")
            .then(async resp => {
                let data = await poll(resp['data']['jobID']);
                return data
            })
        report_uid = report_info['result']['uid']
        patharr = args['reportPath'].split('/')
        reqBody = {}
        reqBody['newName'] = patharr.pop();
        reqBody['exportPath'] = path.join("/mnt", ...patharr);

        await axios.post(EP + "/ep/reports/"+report_uid, reqBody);
        console.log("exported report")
    }

}

module.exports = {main};