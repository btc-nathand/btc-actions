const { default: axios } = require('axios');
const path = require('path')

async function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'formalSpecifierSpecImport'")

    req = {};
    req['specPath'] = args['path'];
    req['optionParam'] = 'OVERWRITE';

    await axios.post(EP + "/ep/specifications-import", req)
        .then(async resp => {
            console.log("successfully imported SPEC file")
        })
        .catch(error => {
            console.log("Could not import SPEC for FormalSpecifier use case!");
            throw error;
        });


}

module.exports = {main};