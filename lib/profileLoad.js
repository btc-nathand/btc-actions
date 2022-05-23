const { default: axios } = require("axios");

function main(args) {
    if (!args['profilePath']) throw new Error("Mandatory argument 'profilePath' not provided for step 'profileLoad'")
    
    // steps:
    // 1) open profile
    // 2) update model paths
    // 3) prepare matlab
    // 4) update architecture 

    // 1) open profile
    await axios 
        .get(EP + `/ep/profiles/${args['profilePath']}`)
        .then(resp => {
            console.log('profile opened')
        })
        .catch(error => {
            console.log("Profile does not exist, or could not be opened. Creating new profile...");
            await axios
                .post(EP + "/ep/profiles")
                .then(resp => {

                })
                .catch(error => {
                    console.log("Could not create profile. Aborting.");
                    throw error;
                });
        });

    // 2) update model paths
    modelUpdate = {};
    if (args['slModelPath']) {
        modelUpdate['slModelFile'] = args['slModelPath']
    }
    if (args['slScriptPath']) {
        modelUpdate['slInitScript'] = args['slScriptPath']
    }
    if (args['tlModelPath']) {
        modelUpdate['tlModelFile'] = args['tlModelPath']
    }
    if (args['tlScriptPath']) {
        modelUpdate['tlInitScript'] = args['tlScriptPath']
    }
    if (args['addModelInfoPath']) {
        modelUpdate['addModelInfo'] = args['addModelInfoPath']
    }
    if (args['environmentXmlPath']) {
        modelUpdate['environment'] = args['environmentXmlPath']
    }
    if(modelUpdate) {
        await axios
            .put(EP + "/ep/architectures/model-paths/", modelUpdate)
            .then(resp => {
                console.log('model updated')
            })
            .catch(error => {
                console.log("Could not update model paths!");
                throw error;
            });
    }

    // 3) prepare matlab
    let hasModelBasedArchitecture = false;
    await axios
        .get(EP + "/ep/architectures")
        .then(resp => {
            resp['data'].forEach(uid => {
                if (uid['architectureKind'] === "Simulink" || uid['architectureKind'] === 'TargetLink') {
                    hasModelBasedArchitecture = true;
                }
            });
        })
        .catch(error => {
            console.log("Couldn't query architecture kind")
            throw error;
        })
    if (hasModelBasedArchitecture || args['startupScriptPath']) {
        // TODO: the java plugin calls a prepareMatlab function that i can't trace down to anywhere, ask thabo?
    }

    // 4) update architecture
    if (args['updateRequired']) {
        await axios
            .put(EP + "/ep/architectures")
            .then(callback => {
                await axios.get(EP + "/ep/progress/" + callback['data']['jobID'])
                .then(resp => {
                    console.log('architecture updated')
                })
                .catch(error => {
                    console.log("failed to update architecture");
                    throw error;
                })
            })
            .catch(error => {
                console.log("callback request failed");
                throw error;
            });
    }
}

module.exports = {main};