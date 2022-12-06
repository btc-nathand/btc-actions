const { default: axios } = require('axios');
const path = require('path')

async function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'requirementImport'")

    req = {};
    req['kind'] = 'EXCEL';
    req['nameAttribute'] = args['nameAttribute'] ? args['nameAttribute'] : 'REQ_ID';
    req['descriptionAttribute'] = args['descriptionAttribute'] ? args['descriptionAttribute'] : 'Description'
    req['additionalAttributes'] = args['additionalAttributes'] ? args['additionalAttributes'] : []
    req['settings'] = [
        {"key": "excel_file_path", "value": path.join("/mnt", args['path'])},
        {"key": "projectName_attr", "value": (args['projectName_attr'] ? args['projectName_attr'] : "InformalRequirement")},
        {"key": "excel_id_attr", "value": (args['excel_id_attr'] ? args['excel_id_attr'] : "REQ_ID")},
    ]
    if (args['excel_start_row']) req['excel_start_row'] = args['excel_start_row'];
    if (args['excel_parent_id']) req['excel_parent_id'] = args['excel_parent_id'];

    await axios.post(EP + "/ep/requirements-import", req)
        .then(async resp => {
            console.log("successfully imported requirements")
        })
        .catch(error => {
            console.log("Could not import requirements from Excel!");
            throw error;
        });


}

module.exports = {main};