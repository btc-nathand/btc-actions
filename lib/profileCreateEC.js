const { default: axios } = require("axios");
const path = require("path"); 
const { poll } = require("./helper");

async function main(args) {
    if (!args['profilePath']) throw new Error("Mandatory argument 'profilePath' not provided for step 'profileCreateEC'")
    if (!args['slModelPath']) throw new Error("Mandatory argument 'slModelPath' not provided for step 'profileCreateEC'")
    
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
    if (args['slModelPath']) {
        modelUpdate['ecModelFile'] = path.join(process.env.GITHUB_WORKSPACE, args['slModelPath'])
    }
    if (args['slScriptPath']) {
        modelUpdate['ecInitScript'] = path.join(process.env.GITHUB_WORKSPACE, args['slScriptPath'])
    }
    
    if (args['environmentXmlPath']) {
        modelUpdate['environment'] = path.join(process.env.GITHUB_WORKSPACE, args['environmentXmlPath'])
    }
    if (args['reuseExistingCode']) {
        modelUpdate['useExistingCode'] = args['reuseExistingCode']
    }
    /*if (args['tlSubsystemFilter']) {
        modelUpdate['subsystemMatcher'] = args['tlSubsystemFilter']
    }
    if (args['tlCalibrationFilter']) {
        modelUpdate['calibrationMatcher'] = args['tlCalibrationFilter']
    }
    if (args['tlCodeFileFilter']) {
        modelUpdate['cfileMatcher'] = args['tlCodeFileFilter']
    }*/
    if(Object.keys(modelUpdate).length !== 0) {
        const data = await axios
            .post(EP + "/ep/architectures/embedded-coder", modelUpdate)
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