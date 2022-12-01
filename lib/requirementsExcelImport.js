const { default: axios } = require('axios');
const path = require('path')

async function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'requirementImport'")

   await axios.get(EP + "/ep/requirements-import/excel")
        .then(async resp => {
            console.log(resp['data']['settings'])
        })
        .catch(error => {
            console.log("Could not import requirements from Excel!");
            throw error;
        });

    req = {};
    req['kind'] = 'EXCEL';
    req['nameAttribute'] = args['nameAttribute'] ? args['nameAttribute'] : 'REQ_ID';
    req['descriptionAttribute'] = args['descriptionAttribute'] ? args['descriptionAttribute'] : 'Description'
    req['additionalAttributes'] = args['additionalAttributes'] ? args['additionalAttributes'] : []
    req['settings'] = [
        
    ]


    req['path'] = path.join("/mnt", args['path'])

}

module.exports = {main};