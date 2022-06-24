const { default: axios } = require('axios');
const path = require('path')

function main(args) {
    if (!args['path']) throw new Error("Mandatory argument 'path' not provided for step 'inputRestrictionsExport'")
    resolve = require('path').resolve
    args['path'] = path.join(process.env.GITHUB_WORKSPACE, args['path'])
    args['path'] = resolve(args['path']);

    reqBody = {}
    reqBody['filePath'] = args['path']

    await axios.post(EP + "/ep/input-restrictions-export")
        .then(resp => {
            console.log("succesfully exported input restrictions")
        })
        .catch(error => {
            console.log("failed to export input restrictions")
            throw error;
        })
}

module.exports = {main};