function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function poll(ID) {
    while(true) {
        let data = await axios.get(EP + "/ep/progress/?progress-id=" + ID)
            .then(async resp => {
                if (resp.status != 202)
                    return resp.data;
                return null
            })
            .catch(error => {
                console.log(error)
                throw new Error(error.message)
            })
            if (data) {
                return data;
            }
            await sleep(200);
        }
  }

  function query_lists_for_uids(query_list, global_list, set) {
    for (query of query_list) {
        for (obj of global_list) {
            if (obj['name'] == query) {
                set.add(obj['uid']);
                break;
            }
        }
    }
}

function pare_to_minimal(minimal_list, global_list) {
    let pared_list = []
    for (obj in global_list) {
        if (minimal_list.includes(global_list[obj]['name']))
            pared_list.push(global_list[obj]);
    }
    return pared_list;
}

async function list_to_uid(global_list, obj_endpoint, uid_url_endpoint, global_uid) {
    for (obj in global_list) {
        obj_uid = global_list[obj]['uid']
        await axios.get(EP + `/ep/${obj_endpoint}/${obj_uid}/${uid_url_endpoint}`)
            .then(resp => {
                for (s in resp.data) {
                    global_uid.add(resp.data[s]['uid']);
                }
            })
            .catch(e => {}) // object not found-- not an error, just an exception thrown by api.
    }
}

  async function get_uids(args, uid_url_endpoint) {
      // ****************************
    // generate global list of uids
    // ****************************
    let global_uids = new Set();
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
    let allRequirements = []
    try {
        allRequirements = await axios.get(EP + "/ep/requirements-sources")
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
    } catch(e) {} // no reqs found, this isnt an error.
    let allTestCases = await axios.get(EP + '/ep/test-cases-rbt')
        .then(resp => {
            return resp['data'];
        })

    // get uids for all blacklisted subsets
    let blacklist_uid = new Set();
    if (args['scopesBlacklist']) {
        let blacklist = (args['scopesBlacklist']).split(',')
        query_lists_for_uids(blacklist, allScopes, blacklist_uid);
    }
    if (args['foldersBlacklist']) {
        let blacklist = (args['foldersBlacklist']).split(',')
        query_lists_for_uids(blacklist, allFolders, blacklist_uid);
    }
    if (args['requirementsBlacklist']) {
        let blacklist = (args['requirementsBlacklist']).split(',')
        query_lists_for_uids(blacklist, allRequirements, blacklist_uid);
    }
    if (args['testCasesBlacklist']) {
        let blacklist = (args['testCasesBlacklist']).split(',')
        query_lists_for_uids(blacklist, allTestCases, blacklist_uid);
    }

    // cut down global list to whitelist.
    if (args['foldersWhitelist']) {
        let whitelist = (args['foldersWhitelist']).split(',')
        allFolders = pare_to_minimal(whitelist, allFolders);
    }
    if (args['scopesWhitelist']) {
        let whitelist = (args['scopesWhitelist']).split(',')
        allScopes = pare_to_minimal(whitelist, allScopes);
    }
    if (args['requirementsWhitelist']) {
        let whitelist = (args['requirementsWhitelist']).split(',')
        allRequirements = pare_to_minimal(whitelist, allRequirements);
    }
    if (args['testCasesWhitelist']) {
        let whitelist = (args['testCasesWhitelist']).split(',')
        allTestCases = pare_to_minimal(whitelist, allTestCases);
    }
    // convert all whitelisted subsets to UID of interest
    await list_to_uid(allFolders, "folders", uid_url_endpoint, global_uids);
    await list_to_uid(allScopes, "scopes", uid_url_endpoint, global_uids);
    await list_to_uid(allRequirements, "requirements", uid_url_endpoint, global_uids);
    for (tc in allTestCases) {
        if(tc['uid']) global_uids.add(tc['uid'])
    }
    return Array.from(global_uids);
  }

  module.exports = {poll, get_uids};