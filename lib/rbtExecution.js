const { default: axios } = require("axios");

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

    // ****************************
    // generate global list of uids
    // ****************************
    let er_uid = new Set();
    let architecture_uid = await axios.get(EP + "/ep/architectures")
        .then(resp => {
            return resp['data'][0]['uid'] // TODO (here and in ER Record Export): why not just grab all architectures and iterate over them for all scopes?
        })
    let allScopes = await axios.get(EP + `/ep/architectures/${architecture_uid}/scopes`)
        .then(resp => {
            return resp['data']
        })
    let allFolders = await axios.get(EP + "/ep/folders")
    .then(resp => {
        return resp['data']
    })
    let allRequirements = await axios.get(EP + "/ep/requirements-sources")
        .then(async resp => {
            reqList = []
            for (reqSource in resp['data']) {
                let req_source_uid = resp['data'][reqSource]['uid']
                let reqs = await axios.get(EP + `/ep/requirements/${req_source_uid}`)
                    .then(resp => {
                        return resp['data']
                    })
                reqList = [...reqList, ...reqs]
            }
            return reqList;
        });
    let allTestCases = await axios.get(EP + '/ep/test-cases-rbt')
        .then(resp => {
            return resp['data'];
        })

    // first add in white-listed stuff. then, blacklist to remove anything that shouldn't be there.
    if (args['foldersWhitelist']) {
        let whitelist = (args['foldersWhitelist']).split(',')
        let foldersPrime = []
        for (folder in allFolders) {
            if (whitelist.includes(allFolders[folder]['name']))
                foldersPrime.push(allFolders[folder]);
        }
        allFolders = foldersPrime;
    }
    if (args['scopesWhitelist']) {
        let whitelist = (args['scopesWhitelist']).split(',')
        let scopesPrime = []
        for (scope in allScopes) {
            if (whitelist.includes(allScopes[scope]['name']))
                scopesPrime.push(allScopes[scope]);
        }
        allScopes = scopesPrime;
    }
    if (args['requirementsWhitelist']) {
        let whitelist = (args['requirementsWhitelist']).split(',')
        let reqsPrime = []
        for (req in allRequirements) {
            if (whitelist.includes(allRequirements[req]['name']))
                reqsPrime.push(allRequirements[reqs]);
        }
        allRequirements = reqsPrime;
    }
    if (args['testCasesWhitelist']) {
        let whitelist = (args['testCasesWhitelist']).split(',')
        let tcPrime = []
        for (tc in allTestCases) {
            if (whitelist.includes(allTestCases[tc]['name']))
                tcPrime.push(allTestCases[tc]);
        }
        allTestCases = tcPrime;
    }
    if (args['scopesBlacklist']) {
        let blacklist = (args['scopesBlacklist']).split(',')
        let scopesPrime = []
        for (scope in allScopes) {
            if (blacklist.includes(allScopes[scope]['name'])) continue;
            scopesPrime.push(allScopes[scope]);
        }
        allScopes = scopesPrime;
    }
    if (args['foldersBlacklist']) {
        let blacklist = (args['foldersBlacklist']).split(',')
        let foldersPrime = []
        for (folder in allFolders) {
            if (blacklist.includes(allFolders[folder]['name'])) continue;
            foldersPrime.push(allFolders[folder]);
        }
        allFolders = foldersPrime;
    }
    if (args['requirementsBlacklist']) {

    }
    if (args['testCasesBlacklist']) {
        
    }

}

module.exports = {main};