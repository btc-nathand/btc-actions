const { default: axios } = require('axios');

async function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'toleranceImport'")
    resolve = require('path').resolve
    args['path'] = resolve(args['path']);
    if (args['useCase'] && args['useCase'] !== "B2B" && args['useCase'] !== "RBT") {
        throw new Error("Valid values for argument 'useCase' are 'B2B' or 'RBT'")     
    }

    reqBody = {}
    reqBody['path'] = args['path']
    reqBody['toleranceUseCase'] = args['useCase'] ? args['useCase'] : "B2B"

    await axios.put(EP + "/ep/profiles/global-tolerances")
        .then(resp => {
            console.log("tolerances imported")
        })
        .catch(error => {
            console.log("failed to import tolerances!")
            throw error;
        })
}

module.exports = {main};