const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    if (!args['dir']) throw new Error("Mandatory argument 'dir' not provided for step 'vectorExport'")
    resolve = require('path').resolve
    args['dir'] = resolve(args['dir']);
    if(args['dir'][0] != "/") args['dir'] += '/';
    reqBody = {}
    reqBody['exportDirectory'] = args['dir']
    reqBody['exportFormat'] = args['vectorFormat'] ? args['vectorFormat'] : "EXCEL"
    args['vectorKind'] = args['vectorKind'] ? args['vectorKind'] : "TC"
    if (!reqBody['exportFormat'] == "EXCEL" && !reqBody['exportFormat'] == "CSV")
        throw new Error("'format' argument for step 'vectorImport' must be EXCEL or CSV");
     

    let uids = []
    if (args['vectorKind'] == "TC") {
        await axios.get(EP + '/ep/test-cases-rbt')
            .then(resp => {
                for(vec of resp['data']) {
                    uids.push(vec['uid']);
                }
            })
        reqBody['UIDs'] = uids;
        await axios.post(EP + "/ep/test-cases-rbt-export", reqBody)
            .then(async resp => {
                let data = await poll(resp['data']['jobID']);
                console.log("successfully exported vectors")
                //console.log(data);
            })
            .catch(error => {
                console.log("failed to export vectors!");
                throw error;
            })
    }
    else if (args['vectorKind'] == "SV") {
        await axios.get(EP + '/ep/stimuli-vectors')
            .then(resp => {
                for(vec of resp['data']) {
                    uids.push(vec['uid']);
                }
            })
        reqBody['UIDs'] = uids;
        await axios.post(EP + "/ep/stimuli-vectors-export", reqBody)
            .then(async resp => {
                let data = await poll(resp['data']['jobID']);
                console.log("successfully exported vectors")
                //console.log(data)
            })
            .catch(error => {
                console.log("failed to export vectors!");
                throw error;
            })
    }
    else {
        throw new Error("'vectorKind' argument for step 'vectorImport' must be SV or TC");
    }
    
}

module.exports = {main};