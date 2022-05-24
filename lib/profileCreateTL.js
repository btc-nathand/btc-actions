const { default: axios } = require("axios");
const { poll } = require("./helper");

async function main(args) {
    if (!args['profilePath']) throw new Error("Mandatory argument 'profilePath' not provided for step 'profileCreateTL'")
    if (!args['tlModelPath']) throw new Error("Mandatory argument 'tlModelPath' not provided for step 'profileCreateTL'")
    
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
    if (args['tlModelPath']) {
        modelUpdate['tlModelFile'] = args['tlModelPath']
    }
    if (args['tlScriptPath']) {
        modelUpdate['tlInitScript'] = args['tlScriptPath']
    }
    if (args['tlSubsystem']) {
        modelUpdate['tlSubsystem'] = args['tlSubsystem']
    }
    if (args['environmentXmlPath']) {
        modelUpdate['environment'] = args['environmentXmlPath']
    }
    if (args['reuseExistingCode']) {
        modelUpdate['useExistingCode'] = args['reuseExistingCode']
    }
    if (args['tlSubsystemFilter']) {
        modelUpdate['subsystemMatcher'] = args['tlSubsystemFilter']
    }
    if (args['tlCalibrationFilter']) {
        modelUpdate['calibrationMatcher'] = args['tlCalibrationFilter']
    }
    if (args['tlCodeFileFilter']) {
        modelUpdate['cfileMatcher'] = args['tlCodeFileFilter']
    }
    
    if(Object.keys(modelUpdate).length !== 0) {
        await axios
            .post(EP + "/ep/architectures/targetlink", modelUpdate)
            .then(async resp => {
                await helper.poll(resp['data']['jobID']);
                console.log('model imported')
            })
            .catch(error => {
                console.log("Could not import model!");
                throw error;
            });
    }

    return 0;
}

module.exports = {main};