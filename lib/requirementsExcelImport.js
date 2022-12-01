const { default: axios } = require('axios');

async function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'requirementImport'")

   await axios.get(EP + "/ep/requirements-import/excel")
        .then(async resp => {
            console.log(resp)
        })
        .catch(error => {
            console.log("Could not import requirements from Excel!");
            throw error;
        });

}

module.exports = {main};