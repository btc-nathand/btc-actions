const { default: axios } = require("axios");
const { poll } = require("./helper");
const path = require('path')

async function main(args) {
    if (!args['profilePath']) throw new Error("Mandatory argument 'profilePath' not provided for step 'profileCreateC'")
    if (!args['codeModelPath']) throw new Error("Mandatory argument 'codeModelPath' not provided for step 'profileCreateC'")
    console.log(args['codeModelPath'])
    args['profilePath'] = path.join(process.env.GITHUB_WORKSPACE, args['profilePath'])
    args['codeModelPath'] = path.join(process.env.GITHUB_WORKSPACE, args['codeModelPath'])
    
    const fs = require('fs');
    console.log(args['codeModelPath'])
    fs.readdir(process.env.GITHUB_WORKSPACE, function (err, files) {console.log(files)})
    try {
    const data = fs.readFileSync( args['codeModelPath'], 'utf8');
    console.log(data);
    } catch (err) {
    console.error(err);
    }
    // steps:
    // 1) create new profile
    // 2) update model paths

    // 1) create profile
    await axios
        .post(EP + "/ep/profiles")
        .then(resp => {
            if(!args['profilePath']) {
                args['profilePath'] = "tmp.epp";
                console.log("Profile path not found; saving as tmp.epp. TODO: nonfunctional");
            }
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