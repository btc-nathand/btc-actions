const { default: axios } = require("axios");
const { poll } = require("./helper");
const path = require('path')

async function main(args) {
    if (!args['codeModelPath']) throw new Error("Mandatory argument 'codeModelPath' not provided for step 'profileCreateC'")
    
    args['codeModelPath'] = path.join("/mnt", args['codeModelPath'])
    
    // steps:
    // 1) create new profile
    // 2) update model paths

    // 1) create profile
    await axios
        .post(EP + "/ep/profiles")
        .then(resp => {
            console.log("Profile created")
        })
        .catch(error => {
            console.log("Could not create profile. Aborting.");
            throw error;
        });

    // 2) update model paths
    modelUpdate = {};
    if (args['codeModelPath']) {
        modelUpdate['modelFile'] = args['codeModelPath']
    }
    prefs = {}
    prefs['preferenceName'] = 'GENERAL_COMPILER_SETTING'
    prefs['preferenceValue'] = 'GCC (64bit)'
    await axios.put(EP + "/ep/preferences", [prefs])
 
    if(Object.keys(modelUpdate).length !== 0) {
        const data = await axios
            .post(EP + "/ep/architectures/ccode", modelUpdate)
            .then(async resp => {
                const data = await helper.poll(resp['data']['jobID']);
                console.log('model imported');
                return data;
            })
            .catch(error => {
                console.log("Could not import model!");
                throw error;
            });
    }

    return 0;
}

module.exports = {main};